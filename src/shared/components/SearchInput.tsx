import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SearchInputProps extends React.ComponentProps<typeof Input> {
  wrapperClassName?: string
  iconClassName?: string
}

export function SearchInput({
  wrapperClassName,
  iconClassName,
  className,
  placeholder = 'Tìm kiếm...',
  ...props
}: SearchInputProps) {
  return (
    <div className={cn('relative w-full', wrapperClassName)}>
      <Search
        className={cn(
          'size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
          iconClassName
        )}
      />
      <Input
        placeholder={placeholder}
        className={cn('text-xs h-9 pl-8 focus-visible:ring-1', className)}
        {...props}
      />
    </div>
  )
}
