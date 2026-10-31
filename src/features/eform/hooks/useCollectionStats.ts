"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  deleteFormSubmissionAction,
  getFormCollectionConfigAction,
  getUserCollectingFormsAction,
  toggleFormCollectionAction,
} from "../actions/collect.action";
import type {
  CollectingFormSummary,
  FormCollectionConfig,
  FormSubmissionItem,
} from "../services/collect.service";

export function useCollectionStats() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFormIdParam = searchParams.get("formId");

  const [forms, setForms] = useState<CollectingFormSummary[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(
    initialFormIdParam ? Number(initialFormIdParam) : null,
  );
  const [config, setConfig] = useState<FormCollectionConfig | null>(null);

  const [isLoadingForms, setIsLoadingForms] = useState(true);
  const [isManualLoadingSubmissions, setIsManualLoadingSubmissions] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [submissionSearch, setSubmissionSearch] = useState("");

  // Tải danh sách các form khi mount
  useEffect(() => {
    let ignore = false;

    getUserCollectingFormsAction()
      .then((res) => {
        if (ignore) return;
        if (!res.success || !res.data) {
          toast.error(res.error || "Không thể tải danh sách biểu mẫu.");
          return;
        }
        setForms(res.data);

        // Tự động chọn form đầu tiên nếu chưa có form nào được chọn
        setSelectedFormId((prev) => {
          if (prev && res.data.some((f) => f.id === prev)) {
            return prev;
          }
          const firstActive = res.data.find((f) => f.isCollecting);
          if (firstActive) {
            return firstActive.id;
          }
          return res.data[0]?.id ?? null;
        });
      })
      .catch(() => {
        if (!ignore) {
          toast.error("Lỗi khi tải danh sách biểu mẫu.");
        }
      })
      .finally(() => {
        if (!ignore) {
          setIsLoadingForms(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Tải phản hồi khi selectedFormId thay đổi
  useEffect(() => {
    if (!selectedFormId) return;

    let ignore = false;

    getFormCollectionConfigAction(selectedFormId)
      .then((res) => {
        if (ignore) return;
        if (!res.success || !res.data) {
          toast.error(res.error || "Không thể tải danh sách phản hồi.");
          setConfig(null);
          return;
        }
        setConfig(res.data);
      })
      .catch(() => {
        if (!ignore) {
          toast.error("Lỗi khi tải phản hồi của biểu mẫu.");
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedFormId]);

  // Trạng thái đang tải bản nộp
  const isLoadingSubmissions =
    Boolean(selectedFormId && config?.formId !== selectedFormId) ||
    isManualLoadingSubmissions;

  // Hàm thủ công để tải lại phản hồi của form đã chọn
  const loadSubmissions = useCallback(async (formId: number) => {
    setIsManualLoadingSubmissions(true);
    try {
      const res = await getFormCollectionConfigAction(formId);
      if (!res.success || !res.data) {
        toast.error(res.error || "Không thể tải danh sách phản hồi.");
        return;
      }
      setConfig(res.data);
    } catch {
      toast.error("Lỗi khi tải phản hồi của biểu mẫu.");
    } finally {
      setIsManualLoadingSubmissions(false);
    }
  }, []);

  // Hàm thủ công tải lại danh sách forms
  const loadForms = useCallback(async () => {
    setIsLoadingForms(true);
    try {
      const res = await getUserCollectingFormsAction();
      if (!res.success || !res.data) {
        toast.error(res.error || "Không thể tải danh sách biểu mẫu.");
        return;
      }
      setForms(res.data);
    } catch {
      toast.error("Lỗi khi tải danh sách biểu mẫu.");
    } finally {
      setIsLoadingForms(false);
    }
  }, []);

  // Đổi form đã chọn
  const handleSelectForm = useCallback(
    (formId: number) => {
      setSelectedFormId(formId);
      const params = new URLSearchParams(window.location.search);
      params.set("formId", String(formId));
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  // Bật / tắt thu thập cho form hiện tại
  const handleToggleCollection = useCallback(async () => {
    if (!selectedFormId || !config || isToggling) return;
    setIsToggling(true);
    try {
      const nextState = !config.isCollecting;
      const res = await toggleFormCollectionAction(selectedFormId, nextState);
      if (!res.success || !res.data) {
        toast.error(res.error || "Không thể thay đổi trạng thái thu thập.");
        return;
      }

      setConfig((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          isCollecting: res.data.isCollecting,
          collectToken: res.data.collectToken,
          collectUrl: res.data.collectUrl,
        };
      });

      // Cập nhật lại list forms
      setForms((prev) =>
        prev.map((f) => {
          if (f.id === selectedFormId) {
            return {
              ...f,
              isCollecting: res.data.isCollecting,
              collectToken: res.data.collectToken,
            };
          }
          return f;
        }),
      );

      if (res.data.isCollecting) {
        toast.success("Đã bật nhận điền biểu mẫu");
      } else {
        toast.success("Đã tạm dừng nhận điền biểu mẫu");
      }
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái thu thập.");
    } finally {
      setIsToggling(false);
    }
  }, [selectedFormId, config, isToggling]);

  // Xóa một bản ghi nộp
  const handleDeleteSubmission = useCallback(
    async (submissionId: number) => {
      if (!selectedFormId || deletingId) return;
      setDeletingId(submissionId);
      try {
        const res = await deleteFormSubmissionAction(
          selectedFormId,
          submissionId,
        );
        if (!res.success) {
          toast.error(res.error || "Không thể xóa bản ghi.");
          return;
        }

        setConfig((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            submissions: prev.submissions.filter(
              (s) => s.id !== submissionId,
            ),
          };
        });

        setForms((prev) =>
          prev.map((f) => {
            if (f.id === selectedFormId) {
              return {
                ...f,
                submissionsCount: Math.max(0, f.submissionsCount - 1),
              };
            }
            return f;
          }),
        );

        toast.success("Đã xóa bản ghi phản hồi thành công.");
      } catch {
        toast.error("Lỗi khi xóa bản ghi phản hồi.");
      } finally {
        setDeletingId(null);
      }
    },
    [selectedFormId, deletingId],
  );

  // Lọc phản hồi theo từ khóa tìm kiếm
  const submissionsList = config?.submissions;
  const filteredSubmissions: FormSubmissionItem[] = useMemo(() => {
    if (!submissionsList) return [];
    if (!submissionSearch.trim()) return submissionsList;

    const term = submissionSearch.toLowerCase().trim();
    return submissionsList.filter((sub) => {
      if (String(sub.id).includes(term)) return true;
      if (sub.formattedCreatedAt.toLowerCase().includes(term)) return true;
      // Tìm trong tất cả các giá trị câu trả lời
      if (sub.submittedData && typeof sub.submittedData === "object") {
        return Object.values(sub.submittedData).some((val) => {
          if (val === null || val === undefined) return false;
          if (typeof val === "string" || typeof val === "number") {
            return String(val).toLowerCase().includes(term);
          }
          if (typeof val === "object") {
            return JSON.stringify(val).toLowerCase().includes(term);
          }
          return false;
        });
      }
      return false;
    });
  }, [submissionsList, submissionSearch]);

  const selectedForm = useMemo(() => {
    return forms.find((f) => f.id === selectedFormId) || null;
  }, [forms, selectedFormId]);

  return {
    forms,
    selectedFormId,
    selectedForm,
    config,
    isLoadingForms,
    isLoadingSubmissions,
    isToggling,
    deletingId,
    submissionSearch,
    setSubmissionSearch,
    filteredSubmissions,
    handleSelectForm,
    handleToggleCollection,
    handleDeleteSubmission,
    refetchSubmissions: () => {
      if (selectedFormId) {
        return loadSubmissions(selectedFormId);
      }
      return Promise.resolve();
    },
    refetchForms: loadForms,
  };
}
