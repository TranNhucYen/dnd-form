import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/shared/constants/routes'

export function PublicAuthLinks() {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Button asChild variant="outline" size="sm">
        <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
      </Button>
      <Button asChild size="sm">
        <Link href={ROUTES.REGISTER}>Đăng ký</Link>
      </Button>
    </div>
  )
}
