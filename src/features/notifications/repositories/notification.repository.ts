import { db } from '@/db'
import { notification, user, template } from '@/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import {
  AppNotification,
  CreateNotificationPayload,
  NotificationType,
} from '../types/notification.type'

export interface INotificationRepository {
  findByUserId(userId: number, limit?: number): Promise<AppNotification[]>
  delete(id: string, userId: number): Promise<boolean>
  deleteAllByUserId(userId: number): Promise<boolean>
  create(payload: CreateNotificationPayload): Promise<AppNotification>
  findTemplateAuthorId(templateId: number): Promise<number | null>
}

export const drizzleNotificationRepository: INotificationRepository = {
  async findByUserId(userId: number, limit = 50): Promise<AppNotification[]> {
    const rows = await db
      .select({
        id: notification.id,
        userId: notification.userId,
        actorId: notification.actorId,
        actorName: user.fullName,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        actionUrl: notification.actionUrl,
        metadata: notification.metadata,
        createdAt: notification.createdAt,
      })
      .from(notification)
      .leftJoin(user, eq(notification.actorId, user.id))
      .where(eq(notification.userId, userId))
      .orderBy(desc(notification.createdAt))
      .limit(limit)

    return rows.map((r) => ({
      id: String(r.id),
      userId: r.userId,
      actorId: r.actorId,
      actorName: r.actorName || null,
      type: r.type as NotificationType,
      title: r.title,
      message: r.message,
      actionUrl: r.actionUrl,
      metadata: (r.metadata as Record<string, unknown>) || null,
      createdAt: r.createdAt,
    }))
  },

  async delete(id: string, userId: number): Promise<boolean> {
    const numId = Number(id)
    if (isNaN(numId)) return false

    await db
      .delete(notification)
      .where(and(eq(notification.id, numId), eq(notification.userId, userId)))

    return true
  },

  async deleteAllByUserId(userId: number): Promise<boolean> {
    await db
      .delete(notification)
      .where(eq(notification.userId, userId))

    return true
  },

  async create(payload: CreateNotificationPayload): Promise<AppNotification> {
    const [result] = await db.insert(notification).values({
      userId: payload.userId,
      actorId: payload.actorId || null,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      actionUrl: payload.actionUrl || null,
      metadata: payload.metadata || null,
    })

    const insertedId = (result as { insertId?: number }).insertId

    return {
      id: insertedId ? String(insertedId) : String(Date.now()),
      userId: payload.userId,
      actorId: payload.actorId || null,
      actorName: null,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      actionUrl: payload.actionUrl || null,
      metadata: payload.metadata || null,
      createdAt: new Date(),
    }
  },

  async findTemplateAuthorId(templateId: number): Promise<number | null> {
    const [row] = await db
      .select({ createdById: template.createdById })
      .from(template)
      .where(eq(template.id, templateId))
      .limit(1)

    return row?.createdById ?? null
  },
}

