"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintCanvas } from "@/features/form-builder/print/PrintCanvas";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";

interface SubmissionPrintViewerProps {
  submissionId: number;
  formName: string;
  submittedAt: string;
  schema: FormSchemaJson;
}

export function SubmissionPrintViewer({
  submissionId,
  formName,
  submittedAt,
  schema,
}: SubmissionPrintViewerProps) {
  return (
    <div className="light min-h-screen w-full bg-neutral-100 print:bg-white flex flex-col text-neutral-900">
      {/* Thanh công cụ đồng bộ kiểu dáng với PublicFormViewer */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shadow-2xs print:hidden">
        <div className="flex flex-col min-w-0">
          <h1 className="text-base font-bold text-neutral-900 truncate">
            {formName} (#{submissionId})
          </h1>
          <p className="text-xs text-neutral-500 truncate">
            Thời gian nộp: {submittedAt}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          className="cursor-pointer gap-2 shrink-0"
        >
          <Printer className="size-4" />
          <span>In / Lưu PDF</span>
        </Button>
      </header>

      {/* Khung giấy A4 1:1 với dữ liệu đã điền */}
      <main className="w-full flex justify-center py-6 print:py-0">
        <PrintCanvas schema={schema} />
      </main>
    </div>
  );
}
