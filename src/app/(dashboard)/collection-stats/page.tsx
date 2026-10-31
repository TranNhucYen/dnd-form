import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionStatsView } from "@/features/eform";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Thống kê thu thập",
};

export default function CollectionStatsPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full flex flex-col gap-4 p-4">
          <Skeleton className="h-10 w-64 rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-72 w-full rounded-lg" />
        </div>
      }
    >
      <CollectionStatsView />
    </Suspense>
  );
}
