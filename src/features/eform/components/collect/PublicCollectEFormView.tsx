"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { transformSchemaToEForm } from "../../engine/schema-to-eform.transformer";
import { EFormViewer } from "../EFormViewer";
import { submitPublicEFormAction } from "../../actions/collect.action";
import type { PublicCollectFormDetail } from "../../services/collect.service";

interface PublicCollectEFormViewProps {
  form: PublicCollectFormDetail;
}

export function PublicCollectEFormView({ form }: PublicCollectEFormViewProps) {
  const layout = useMemo(() => {
    return transformSchemaToEForm(form.schemaContent);
  }, [form.schemaContent]);

  const submittedDataRef = useRef<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleValueChange = (fieldId: string, value: unknown) => {
    submittedDataRef.current[fieldId] = value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await submitPublicEFormAction(
        form.token,
        submittedDataRef.current,
      );
      if (!res.success) {
        toast.error(res.error || "Không thể gửi biểu mẫu. Vui lòng thử lại.");
        return;
      }
      setIsSubmitted(true);
      toast.success("Gửi biểu mẫu thành công!");
    } catch {
      toast.error("Đã xảy ra lỗi khi gửi biểu mẫu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndFillAgain = () => {
    submittedDataRef.current = {};
    setIsSubmitted(false);
    setFormKey((prev) => prev + 1);
  };

  if (isSubmitted) {
    return (
      <div className="light flex min-h-screen w-full items-center justify-center bg-neutral-100 p-4 text-neutral-900">
        <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-xs">
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="size-6" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900">
            Đã gửi biểu mẫu thành công
          </h2>
          <p className="text-sm text-neutral-500">
            Thông tin bạn điền cho biểu mẫu{" "}
            <strong className="text-neutral-900">{form.name}</strong> đã được tự
            động điền vào biểu mẫu gốc.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetAndFillAgain}
            className="mt-2 gap-2 cursor-pointer"
          >
            <RefreshCw className="size-3.5" />
            <span>Điền thêm một bản khác</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="light min-h-screen bg-neutral-100 flex flex-col w-full max-w-full overflow-x-hidden text-neutral-900">
      {/* Thanh công cụ đồng bộ kiểu dáng với PublicFormViewer */}
      <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex flex-col min-w-0">
          <h1 className="text-base font-bold text-neutral-900 truncate">
            {form.name}
          </h1>
          {form.description && (
            <p className="text-xs text-neutral-500 truncate">
              {form.description}
            </p>
          )}
        </div>
      </header>

      {/* Khung điền E-Form */}
      <main className="flex flex-1 w-full min-w-0 justify-center p-3 sm:p-6 md:p-8">
        <form
          key={formKey}
          onSubmit={handleSubmit}
          className="w-full min-w-0 max-w-2xl flex flex-col gap-5"
        >
          <EFormViewer
            layout={layout}
            title={form.name}
            onValueChange={handleValueChange}
          />

          <div className="flex items-center justify-end gap-3 rounded-xl border border-neutral-300 bg-white p-4 shadow-xs">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 cursor-pointer px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  <span>Gửi biểu mẫu</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
