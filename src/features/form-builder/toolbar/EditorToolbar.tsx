import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeTabContent, PageTabContent } from "./tabs";

export function EditorToolbar() {
  return (
    <header data-toolbar className="flex w-full shrink-0 flex-col border-b border-border/80 bg-background select-none">
      {/* các tab  */}
      <Tabs defaultValue="home" className="w-full gap-0">
        <div className="flex h-8 items-center bg-transparent">
          <TabsList variant="line">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="page">Page</TabsTrigger>
          </TabsList>
        </div>
      
      {/* thanh công cụ theo từng tab  */}
        <div className="flex h-10 items-center">
          <TabsContent value="home" className="m-0">
            <HomeTabContent />
          </TabsContent>

          <TabsContent value="page" className="m-0">
            <PageTabContent />
          </TabsContent>
        </div>
      </Tabs>
    </header>
  );
}
