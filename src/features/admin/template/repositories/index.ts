import { ITemplateRepository } from './template.repository'
import { templateMockRepository } from './template.mock.repository'

export const templateRepository: ITemplateRepository = templateMockRepository

export * from './template.repository'
export * from './template.mock.repository'
