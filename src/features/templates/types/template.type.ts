export interface GuidelineItem {
  id: string
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
  DRAFT = 'draft'
}

export interface Template {
  id: number
  name: string
  ownerId?: number
  ownerName: string
  categoryId?: number
  categoryName: string
  type: TemplateType
  pricingType: TemplatePricingType
  status: TemplateStatus
  description?: string
  guideline?: GuidelineItem[]
  downloads: number
  createdAt?: Date | string
  updatedAt: Date | string
}