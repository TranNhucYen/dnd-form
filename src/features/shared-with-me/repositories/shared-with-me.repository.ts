import { db } from '@/db'
import { form, formShare, user } from '@/db/schema'
import { and, eq, desc, ne } from 'drizzle-orm'
import type { SharedWithMeItem, SharedPermission } from '../types/shared-with-me.type'

export interface ISharedWithMeRepository {
  getSharedWithMeForms(userId: number): Promise<SharedWithMeItem[]>
}

export const drizzleSharedWithMeRepository: ISharedWithMeRepository = {
  async getSharedWithMeForms(userId: number): Promise<SharedWithMeItem[]> {
    const records = await db
      .select({
        id: form.id,
        name: form.name,
        description: form.description,
        permission: formShare.permission,
        sharedAt: formShare.createdAt,
        ownerId: form.ownerId,
        ownerName: user.fullName,
        ownerEmail: user.email,
      })
      .from(formShare)
      .innerJoin(form, eq(formShare.formId, form.id))
      .innerJoin(user, eq(form.ownerId, user.id))
      .where(
        and(
          eq(formShare.userId, userId),
          eq(formShare.subjectType, 'user'),
          ne(form.ownerId, userId)
        )
      )
      .orderBy(desc(formShare.createdAt))

    return records.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      permission: r.permission as SharedPermission,
      sharedAt: r.sharedAt.toISOString(),
      ownerId: r.ownerId,
      ownerName: r.ownerName,
      ownerEmail: r.ownerEmail,
    }))
  },
}
