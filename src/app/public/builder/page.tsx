import type { Metadata } from 'next'
import { PublicBuilder } from '@/features/public-builder/components/PublicBuilder'

export const metadata: Metadata = { title: 'Form Builder công khai' }

export default function PublicBuilderPage() {
  return <PublicBuilder />
}
