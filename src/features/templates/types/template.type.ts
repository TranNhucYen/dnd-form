import type { FormSchemaJson } from '@/features/form-builder/types/formBuilder.types'

import {
  TemplatePricingType,
  TemplatePublishStatus,
} from '@/shared/types/template.type'

export {
  TemplatePricingType,
  TemplatePublishStatus,
  TemplatePublishStatus as TemplateStatus,
} from '@/shared/types/template.type'
export type { ActionResponse } from '@/shared/types/action.type'

export interface GuidelineItem {
  id?: string
  content: string
}

export enum TemplateType {
  STATIC_FILE = 'static_file',
  DND_TEMPLATE = 'dnd_template',
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
  status?: TemplatePublishStatus | string
  description?: string | null
  guideline?: (GuidelineItem | string)[] | null
  downloads: number
  schemaId?: number
  schemaContent?: FormSchemaJson
  createdAt?: Date | string
  updatedAt: Date | string
}

export interface UseTemplateResult {
  formId: number
}