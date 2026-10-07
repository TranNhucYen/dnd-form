import { isMockMode } from '@/lib/config'
import { type IMyFormRepository, drizzleMyFormRepository } from './my-form.repository'
import { myFormMockRepository } from './my-form.mock.repository'

export * from './my-form.repository'

export const myFormRepository = isMockMode()
  ? myFormMockRepository
  : drizzleMyFormRepository
