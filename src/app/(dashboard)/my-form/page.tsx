import type { Metadata } from 'next'
import MyFormList from '@/features/my-form/components/MyFormList'

export const metadata: Metadata = {
  title: 'Biểu mẫu của tôi',
}

export default function MyFormPage() {
  return <MyFormList />
}