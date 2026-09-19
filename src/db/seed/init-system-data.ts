import { and, eq, inArray, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { db } from "..";
import { permission, role, rolePermission, user } from "../schema";

// quyền áp dụng lên các đối tượng (user,template,form) trong hệ thống
const permissionCode = {
  user: {
    create: 'user.create',
    read: 'user.read',
    update: 'user.update',
    delete: 'user.delete',
  },
  template: {
    create: 'template.create',
    read: 'template.read',
    update: 'template.update',
    delete: 'template.delete',
  },
  form: {
    submit: 'form.submit',
  },
} as const;

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function roleSeed(tx: Transaction) {
  const roles: (typeof role.$inferInsert)[] = [
    {
      roleCode: 'super_admin',
      name: 'Super Admin',
      description: 'quản trị viên có toàn quyền truy cập và quản lý tất cả các biểu mẫu ,user,admin trong hệ thống.',
    },
    {
      roleCode: 'admin',
      name: 'Admin',
      description: 'quản trị viên có thể quản lý user thường và biểu mẫu',
    },
    {
      roleCode: 'user',
      name: 'User',
      description: 'Chỉ có thể quản lý biểu mẫu của chính mình',
    },
  ];
  await tx.insert(role).ignore().values(roles);
}

async function permissionSeed(tx: Transaction) {
  const { user, template, form } = permissionCode;
  const permissions: (typeof permission.$inferInsert)[] = [
    {
      permissionCode: user.create,
      description: 'Tạo user',
    },
    {
      permissionCode: user.read,
      description: 'Xem user',
    },
    {
      permissionCode: user.update,
      description: 'Cập nhật user',
    },
    {
      permissionCode: user.delete,
      description: 'Xóa user',
    },
    {
      permissionCode: template.create,
      description: 'Tạo biểu mẫu',
    },
    {
      permissionCode: template.read,
      description: 'Xem biểu mẫu',
    },
    {
      permissionCode: template.update,
      description: 'Cập nhật biểu mẫu',
    },
    {
      permissionCode: template.delete,
      description: 'Xóa biểu mẫu',
    },
    {
      permissionCode: form.submit,
      description: 'Yêu cầu duyệt form để đưa vào template cộng đồng',
    },
  ];

  await tx.insert(permission).ignore().values(permissions);
}

async function rolePermissionSeed(tx: Transaction) {
  const { user, template, form } = permissionCode;

  const rolePermissions = await tx
    .select({ roleId: role.id, permissionId: permission.id })
    .from(role)
    .crossJoin(permission)
    .where(
      or(
        and(
          eq(role.roleCode, 'super_admin'),
          inArray(permission.permissionCode, [user.create, user.read, user.update, user.delete])
        ),
        and(
          eq(role.roleCode, 'admin'),
          inArray(permission.permissionCode, [template.create, template.read, template.update, template.delete])
        ),
        and(
          eq(role.roleCode, 'user'),
          inArray(permission.permissionCode, [form.submit])
        )
      )
    );

  if (rolePermissions.length > 0) {
    await tx.insert(rolePermission).ignore().values(rolePermissions);
  }
}

async function superAdminDataSeed(tx: Transaction) {
  const [superAdminRole] = await tx
    .select({ id: role.id })
    .from(role)
    .where(eq(role.roleCode, 'super_admin'));

  if (!superAdminRole) {
    throw new Error('Không tìm thấy role super_admin');
  }

  const fullName = process.env.SUPER_ADMIN_FULL_NAME;
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!fullName || !email || !password) {
    throw new Error('Không đủ thông tin để seed SuperAdmin');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await tx.insert(user).ignore().values({
    fullName,
    email,
    password: hashedPassword,
    roleId: superAdminRole.id,
    status: 'active',
  });
}

async function main() {
  console.log('---Đang khởi tạo system data---');
  await db.transaction(async (tx) => {
    await roleSeed(tx);
    await permissionSeed(tx);
    await rolePermissionSeed(tx);
    await superAdminDataSeed(tx);
  });

  console.log('---Khởi tạo system data thành công---');
  process.exit(0);
}

main().catch((error) => {
  console.error('---Lỗi khởi tạo system data (đã rollback):---', error);
  process.exit(1);
});