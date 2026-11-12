import { and, eq, inArray, or } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import { db } from '..'
import { permission, role, rolePermission, user } from '../schema'
import { PERMISSIONS, ROLE_PERMISSION_CODES } from '../../shared/auth/permissions'
import { UserRole } from '../../shared/types/user.type'

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]

const permissionDefinitions: (typeof permission.$inferInsert)[] = [
  { permissionCode: PERMISSIONS.user.create, description: 'Tạo user' },
  { permissionCode: PERMISSIONS.user.read, description: 'Xem user' },
  { permissionCode: PERMISSIONS.user.update, description: 'Cập nhật user' },
  { permissionCode: PERMISSIONS.user.delete, description: 'Xóa user' },
  { permissionCode: PERMISSIONS.template.create, description: 'Tạo biểu mẫu' },
  { permissionCode: PERMISSIONS.template.read, description: 'Xem biểu mẫu' },
  { permissionCode: PERMISSIONS.template.update, description: 'Cập nhật biểu mẫu' },
  { permissionCode: PERMISSIONS.template.delete, description: 'Xóa biểu mẫu' },
  { permissionCode: PERMISSIONS.category.create, description: 'Tạo danh mục biểu mẫu' },
  { permissionCode: PERMISSIONS.category.read, description: 'Xem danh mục biểu mẫu' },
  { permissionCode: PERMISSIONS.category.update, description: 'Cập nhật danh mục biểu mẫu' },
  { permissionCode: PERMISSIONS.category.delete, description: 'Xóa danh mục biểu mẫu' },
  { permissionCode: PERMISSIONS.dashboard.read, description: 'Xem dashboard admin và thống kê hệ thống' },
  { permissionCode: PERMISSIONS.form.submit, description: 'Yêu cầu duyệt form để đưa vào template cộng đồng' },
]

async function roleSeed(tx: Transaction) {
  const roles: (typeof role.$inferInsert)[] = [
    {
      roleCode: 'super_admin',
      name: 'Super Admin',
      description: 'Quản trị viên có toàn quyền quản lý người dùng, biểu mẫu mẫu và danh mục.',
    },
    {
      roleCode: 'admin',
      name: 'Admin',
      description: 'Quản trị viên có thể quản lý biểu mẫu mẫu và danh mục.',
    },
    {
      roleCode: 'user',
      name: 'User',
      description: 'Người dùng quản lý biểu mẫu của mình và gửi biểu mẫu cộng đồng.',
    },
  ]
  await tx.insert(role).ignore().values(roles)
}

async function permissionSeed(tx: Transaction) {
  await tx.insert(permission).ignore().values(permissionDefinitions)
}

async function rolePermissionSeed(tx: Transaction) {
  const assignments = await tx
    .select({ roleId: role.id, permissionId: permission.id })
    .from(role)
    .crossJoin(permission)
    .where(
      or(
        ...Object.entries(ROLE_PERMISSION_CODES).map(([roleCode, codes]) =>
          and(
            eq(role.roleCode, roleCode as UserRole),
            inArray(permission.permissionCode, [...codes]),
          ),
        ),
      ),
    )

  if (assignments.length > 0) {
    await tx.insert(rolePermission).ignore().values(assignments)
  }
}

async function superAdminDataSeed(tx: Transaction) {
  const [superAdminRole] = await tx
    .select({ id: role.id })
    .from(role)
    .where(eq(role.roleCode, 'super_admin'))

  if (!superAdminRole) {
    throw new Error('Không tìm thấy role super_admin')
  }

  const [existingSuperAdmin] = await tx
    .select({ id: user.id })
    .from(user)
    .where(eq(user.roleId, superAdminRole.id))
    .limit(1)

  if (existingSuperAdmin) return

  const fullName = process.env.SUPER_ADMIN_FULL_NAME
  const email = process.env.SUPER_ADMIN_EMAIL
  const password = process.env.SUPER_ADMIN_PASSWORD

  if (!fullName || !email || !password) {
    throw new Error('Không đủ thông tin để seed Super Admin')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  await tx.insert(user).ignore().values({
    fullName,
    email,
    password: hashedPassword,
    roleId: superAdminRole.id,
    status: 'active',
  })
}

async function main() {
  console.log('Đang khởi tạo system data...')
  await db.transaction(async (tx) => {
    await roleSeed(tx)
    await permissionSeed(tx)
    await rolePermissionSeed(tx)
    await superAdminDataSeed(tx)
  })
  console.log('Khởi tạo system data thành công')
  process.exit(0)
}

main().catch((error) => {
  console.error('Lỗi khởi tạo system data (đã rollback):', error)
  process.exit(1)
})
