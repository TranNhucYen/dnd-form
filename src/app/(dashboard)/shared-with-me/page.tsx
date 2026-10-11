import type { Metadata } from 'next'
import SharedWithMeList from '@/features/shared-with-me/components/SharedWithMeList'

export const metadata: Metadata = {
  title: 'Chia sẻ với tôi',
}

export default function SharedWithMePage() {
  return <SharedWithMeList />
}
