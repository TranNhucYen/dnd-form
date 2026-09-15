import { isMockMode } from '@/lib/config'
import { drizzleMyFormRepository } from './my-form.repository'
import { myFormMockRepository } from './my-form.mock.repository'

export const myFormRepository = isMockMode()
  ? myFormMockRepository
  : drizzleMyFormRepository
