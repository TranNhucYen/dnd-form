'use client'

import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { AlertTriangle, Loader2 } from 'lucide-react'
import type { MyForm } from '../types/my-form.type'

interface DeleteFormModalProps {
  forms: MyForm[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmDelete: (id: number) => Promise<unknown>
}

export function DeleteFormModal({
  forms,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteFormModalProps) {
  const { t } = useTranslation()
  const [isDeleting, setIsDeleting] = useState(false)

  if (forms.length === 0) return null

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDeleting(true)
    try {
      let allDeleted = true
      for (const form of forms) {
        const result = await onConfirmDelete(form.id)
        if (result !== true) allDeleted = false
      }
      if (allDeleted) onOpenChange(false)
    } catch (err) {
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <AlertTriangle />
          </AlertDialogMedia>
          <AlertDialogTitle>
            {forms.length === 1
              ? t('myForm.generated.xacNhanXoaBieuMau')
              : t('myForm.deleteManyTitle', { count: forms.length })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {forms.length === 1 ? (
              <>{t('myForm.generated.banCoChacChanMuonXoaBieuMau')} <strong className="text-foreground font-semibold">&ldquo;{forms[0].name}&rdquo;</strong>?</>
            ) : (
              <>{t('myForm.generated.banCoChacChanMuonXoa')} {forms.length} {t('myForm.generated.bieuMauDaChon')}</>
            )}{' '}
            {t('myForm.generated.moiDuLieuCauTrucTruongLienQuanSe')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="cursor-pointer text-xs">
            {t('myForm.generated.huyBo')}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="cursor-pointer text-xs"
          >
            {isDeleting ? (
              <>
                <Loader2 data-icon="inline-start" className="animate-spin" />
                {t('myForm.generated.dangXoa')}
              </>
            ) : (
              forms.length === 1
                ? t('myForm.generated.xacNhanXoa')
                : t('myForm.deleteManyAction', { count: forms.length })
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
