import type { Metadata } from 'next'
import List from '@/features/templates/components/List'

export const metadata: Metadata = {
  title: 'Form mẫu',
}

export default function TemplatesPage() {
  return <List />
}
