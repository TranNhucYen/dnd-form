'use client'

import { createContext, useContext } from 'react'

interface FormBuilderCapabilities {
  allowMediaUpload: boolean
}

const FormBuilderCapabilitiesContext = createContext<FormBuilderCapabilities>({
  allowMediaUpload: true,
})

export function FormBuilderCapabilitiesProvider({
  allowMediaUpload,
  children,
}: FormBuilderCapabilities & { children: React.ReactNode }) {
  return (
    <FormBuilderCapabilitiesContext.Provider value={{ allowMediaUpload }}>
      {children}
    </FormBuilderCapabilitiesContext.Provider>
  )
}

export function useFormBuilderCapabilities() {
  return useContext(FormBuilderCapabilitiesContext)
}
