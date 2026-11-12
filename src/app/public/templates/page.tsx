import type { Metadata } from 'next'
import List from '@/features/templates/components/List'

export const metadata: Metadata = { title: 'Thư viện form mẫu' }

export default function PublicTemplatesPage() {
  return (
    <div className="p-4 md:p-6">
      <List publicView />
    </div>
  )
}
