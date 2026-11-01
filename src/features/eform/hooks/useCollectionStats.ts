"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

const FORMS_KEY = ["collection-stats", "forms"] as const;

function configKey(formId: number) {
  return ["collection-stats", "config", formId] as const;
}

export function useCollectionStats() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const initialFormIdParam = searchParams.get("formId");

  const [selectedFormIdState, setSelectedFormId] = useState<number | null>(
    initialFormIdParam ? Number(initialFormIdParam) : null,
  );
  const [isManualLoadingSubmissions, setIsManualLoadingSubmissions] =
    useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [submissionSearch, setSubmissionSearch] = useState("");

  const formsQuery = useQuery({
    queryKey: FORMS_KEY,
    queryFn: async (): Promise<CollectingFormSummary[]> => {
      const res = await getUserCollectingFormsAction();
      if (!res.success || !res.data) {
        throw new Error(res.error || "Không thể tải danh sách biểu mẫu.");
      }
      return res.data;
    },
    // Số phản hồi thay đổi liên tục: luôn fetch mới, giữ data cũ để tránh nháy skeleton.
    staleTime: 0,
  });

  useEffect(() => {
    if (formsQuery.error) {
      toast.error(formsQuery.error.message);
    }
  }, [formsQuery.error]);

  const forms = useMemo(() => formsQuery.data ?? [], [formsQuery.data]);

  // Giữ lựa chọn hiện tại nếu còn trong danh sách; fallback: form đang thu thập, rồi form đầu tiên.
  const selectedFormId = useMemo<number | null>(() => {
    if (selectedFormIdState && forms.some((f) => f.id === selectedFormIdState)) {
      return selectedFormIdState;
    }
    if (forms.length === 0) return selectedFormIdState;

    const firstActive = forms.find((f) => f.isCollecting);
    return firstActive?.id ?? forms[0]?.id ?? null;
  }, [selectedFormIdState, forms]);

  const configQuery = useQuery({
    queryKey: selectedFormId
      ? configKey(selectedFormId)
      : (["collection-stats", "config", "none"] as const),
    queryFn: async (): Promise<FormCollectionConfig> => {
      if (!selectedFormId) {
        throw new Error("Chưa chọn biểu mẫu.");
      }

      const res = await getFormCollectionConfigAction(selectedFormId);
      if (!res.success || !res.data) {
        throw new Error(res.error || "Không thể tải danh sách phản hồi.");
      }
      return res.data;
    },
    enabled: Boolean(selectedFormId),
    // Phản hồi gửi bất cứ lúc nào, luôn fetch mới khi mở lại.
    staleTime: 0,
  });

  useEffect(() => {
    if (configQuery.error) {
      toast.error(configQuery.error.message);
    }
  }, [configQuery.error]);

  const config = configQuery.data ?? null;
  const isLoadingForms = formsQuery.isLoading;

  // Đang tải bản nộp
  const isLoadingSubmissions =
    Boolean(selectedFormId && configQuery.isPending) ||
    isManualLoadingSubmissions;

  const { refetch: refetchConfig } = configQuery

  // Tải lại phản hồi của form đang chọn
  const loadSubmissions = useCallback(async () => {
    if (!selectedFormId) return;

    setIsManualLoadingSubmissions(true);
    try {
      await refetchConfig();
    } finally {
      setIsManualLoadingSubmissions(false);
    }
  }, [selectedFormId, refetchConfig]);

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

      queryClient.setQueryData<FormCollectionConfig>(
        configKey(selectedFormId),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            isCollecting: res.data.isCollecting,
            collectToken: res.data.collectToken,
            collectUrl: res.data.collectUrl,
          };
        },
      );

      // Cập nhật lại list forms
      queryClient.setQueryData<CollectingFormSummary[]>(FORMS_KEY, (prev) =>
        (prev ?? []).map((f) => {
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
  }, [selectedFormId, config, isToggling, queryClient]);

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

        queryClient.setQueryData<FormCollectionConfig>(
          configKey(selectedFormId),
          (prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              submissions: prev.submissions.filter(
                (s) => s.id !== submissionId,
              ),
            };
          },
        );

        queryClient.setQueryData<CollectingFormSummary[]>(FORMS_KEY, (prev) =>
          (prev ?? []).map((f) => {
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
    [selectedFormId, deletingId, queryClient],
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
        return loadSubmissions();
      }
      return Promise.resolve();
    },
    refetchForms: formsQuery.refetch,
  };
}
