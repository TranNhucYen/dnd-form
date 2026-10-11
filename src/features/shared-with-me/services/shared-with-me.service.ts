import { sharedWithMeRepository } from '../repositories'
import type { SharedWithMeItem } from '../types/shared-with-me.type'
import { formatDate } from '@/shared/utils'

function formatSharedItem(item: SharedWithMeItem): SharedWithMeItem {
  return {
    ...item,
    formattedSharedAt: formatDate(item.sharedAt),
  }
}

export const sharedWithMeService = {

  async getSharedWithMeForms(userId: number): Promise<SharedWithMeItem[]> {
    const items = await sharedWithMeRepository.getSharedWithMeForms(userId)
    return items.map(formatSharedItem)
  },
}
