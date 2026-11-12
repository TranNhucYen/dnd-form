'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HomeTabContent, PageTabContent } from '@/features/form-builder/toolbar/tabs'
import { HistoryTools } from '@/features/form-builder/toolbar/tools'
import { FORM_BUILDER_LABELS } from '@/features/form-builder/constants/labels'

export function PublicBuilderToolbar() {
  return (
    <header className="flex w-full shrink-0 flex-col border-b border-border/80 bg-background select-none">
      <Tabs defaultValue="home" className="w-full gap-0">
        <div className="flex h-8 items-center gap-1.5 bg-transparent px-2">
          <HistoryTools />
          <div className="mx-0.5 h-4 w-0.5 bg-border" />
          <TabsList variant="line">
            <TabsTrigger value="home">{FORM_BUILDER_LABELS.toolbarTabs.home}</TabsTrigger>
            <TabsTrigger value="page">{FORM_BUILDER_LABELS.toolbarTabs.page}</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex h-10 items-center overflow-x-auto px-2">
          <TabsContent value="home" className="m-0">
            <HomeTabContent />
          </TabsContent>
          <TabsContent value="page" className="m-0">
            <PageTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </header>
  )
}
