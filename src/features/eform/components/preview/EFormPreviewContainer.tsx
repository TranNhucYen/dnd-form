"use client";

import { useMemo } from "react";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import { transformSchemaToEForm } from "../../engine/schema-to-eform.transformer";
import { EFormViewer } from "../EFormViewer";
import { EFormPreviewHeader } from "./EFormPreviewHeader";

interface EFormPreviewContainerProps {
  schema: FormSchemaJson;
  title?: string;
}

export function EFormPreviewContainer({
  schema,
  title,
}: EFormPreviewContainerProps) {
  const layout = useMemo(() => {
    return transformSchemaToEForm(schema);
  }, [schema]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden flex-col bg-neutral-100">
      <EFormPreviewHeader title={title} />

      <main className="flex flex-1 w-full min-w-0 justify-center p-3 sm:p-6 md:p-8">
        <div className="w-full min-w-0 max-w-2xl">
          <EFormViewer layout={layout} title={title} />
        </div>
      </main>
    </div>
  );
}
