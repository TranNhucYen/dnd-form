export interface GuidelineItem {
  id?: string
  content: string
}

export enum TemplateType {
  STATIC_FILE = 'static_file',
  DND_TEMPLATE = 'dnd_template',
}

export enum TemplatePricingType {
  FREE = 'free',
  PAID = 'paid',
}

export enum TemplateStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
}

export interface Template {
  id: number
  name: string
  ownerId?: number
  ownerName: string
  categoryId?: number
  categoryName: string
  type?: TemplateType
  pricingType: TemplatePricingType | 'free' | 'paid'
  status?: TemplateStatus | string
  description?: string | null
  guideline?: (GuidelineItem | string)[] | null
  downloads: number
  schemaId?: number
  createdAt?: Date | string
  updatedAt: Date | string
}

export type ActionResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface UseTemplateResult {
  formId: number
}