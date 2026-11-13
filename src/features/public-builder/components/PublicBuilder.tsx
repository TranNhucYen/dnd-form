'use client'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { Input } from '@/components/ui/input'
import { CanvasViewPort } from '@/features/form-builder/canvas/CanvasViewPort'
import { FormBuilderCapabilitiesProvider } from '@/features/form-builder/context/FormBuilderCapabilities'
import { DragPreviewOverlay } from '@/features/form-builder/dnd/DragPreviewOverlay'
import { Palette } from '@/features/form-builder/left-sidebar/Palette'
import { useFormBuilderStore } from '@/features/form-builder/store/useFormBuilderStore'
import { PublicBuilderToolbar } from './PublicBuilderToolbar'

function clearPublicBuilderState() {
  const store = useFormBuilderStore.getState()
  store.setOnSave(undefined)
  store.setOnExport(undefined)
  store.setOnNewForm(undefined)
  store.setIsSaving(false)
  store.resetForm()
  useFormBuilderStore.setState({
    selectedFieldId: null,
    selectedFieldIds: [],
    clipboardField: null,
    isReadOnly: false,
    isDirty: false,
    isSaving: false,
  })
}

export function PublicBuilder() {
  const { t } = useTranslation()
  const [isReady, setIsReady] = useState(false)
  const [title, setTitle] = useState(() => t('publicBuilder.untitledForm'))
  const [isDraggingOverField, setIsDraggingOverField] = useState(false)

  useEffect(() => {
    clearPublicBuilderState()
    setIsReady(true)

    return () => {
      clearPublicBuilderState()
    }
  }, [])

  if (!isReady) {
    return <div className="flex h-full min-h-96 items-center justify-center text-sm text-muted-foreground">{t('publicBuilder.generated.dangMoFormBuilder')}</div>
  }

  return (
    <FormBuilderCapabilitiesProvider allowMediaUpload={false}>
      <div className="flex h-full min-h-[600px] flex-col overflow-hidden bg-neutral-100">
        <div className="flex min-h-14 shrink-0 items-center justify-between gap-4 border-b bg-background px-4">
          <Input
            aria-label={t('publicBuilder.generated.tenBieuMauTamThoi')}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            className="h-9 max-w-md border-transparent text-base font-semibold shadow-none focus-visible:border-input"
          />
        </div>

        <DragDropProvider>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <PublicBuilderToolbar />
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <Palette />
              <main className="light min-w-0 flex-1">
                <CanvasViewPort onCollisionChange={setIsDraggingOverField} />
              </main>
              <div className="light">
                <DragPreviewOverlay isDraggingOverField={isDraggingOverField} />
              </div>
            </div>
          </div>
        </DragDropProvider>
      </div>
    </FormBuilderCapabilitiesProvider>
  )
}
