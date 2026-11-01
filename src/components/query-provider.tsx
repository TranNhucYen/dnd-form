"use client"

import {useState} from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Giữ dữ liệu
        staleTime: 30_000,
        gcTime: 30 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  })
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  // Không tạo QueryClient ở phạm vi module để tránh rò rỉ dữ liệu giữa các request SSR
  const [queryClient] = useState(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export { QueryProvider }
