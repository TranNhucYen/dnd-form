'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Sun, Moon, Laptop } from 'lucide-react'

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const themes = [
    {
      id: 'light',
      label: 'Sáng (Light Mode)',
      description: 'Giao diện nền sáng phù hợp làm việc ban ngày hoặc nơi đủ ánh sáng',
      icon: Sun,
    },
    {
      id: 'dark',
      label: 'Tối (Dark Mode)',
      description: 'Giao diện nền tối giúp giảm mỏi mắt khi làm việc trong môi trường tối',
      icon: Moon,
    },
    {
      id: 'system',
      label: 'Theo hệ thống (System)',
      description: 'Tự động đồng bộ theo cài đặt giao diện của hệ điều hành / thiết bị',
      icon: Laptop,
    },
  ]

  return (
    <Card className="border-border/80 shadow-xs">
      <CardHeader>
        <CardTitle className="text-base font-bold">Giao diện (Theme)</CardTitle>
        <CardDescription className="text-xs">
          Lựa chọn chế độ hiển thị sáng hoặc tối cho ứng dụng
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {themes.map((item) => {
            const Icon = item.icon
            const isChecked = theme === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`flex flex-col text-left gap-1 rounded-lg border p-3.5 transition-all cursor-pointer select-none ${
                  isChecked
                    ? 'border-primary bg-primary/5 ring-1 ring-primary/30 shadow-xs'
                    : 'border-border/80 hover:bg-muted/40 hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-7 rounded-md flex items-center justify-center ${
                      isChecked
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {item.label}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {item.description}
                </span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
