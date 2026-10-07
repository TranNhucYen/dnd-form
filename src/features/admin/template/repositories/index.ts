import { ITemplateRepository, drizzleTemplateRepository } from './template.repository'
import { templateMockRepository } from './template.mock.repository'
import { isMockMode } from '@/lib/config'

export const templateRepository = isMockMode()
  ? templateMockRepository
  : drizzleTemplateRepository

