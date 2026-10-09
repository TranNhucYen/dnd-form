import type { Metadata } from 'next'
import { CommunityList } from '@/features/community/components/CommunityList'

export const metadata: Metadata = {
  title: 'Kho cộng đồng',
}

export default function CommunityPage() {
  return <CommunityList />
}
