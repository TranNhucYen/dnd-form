"use client";

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  createDefaultBlankPage,
  useFormBuilderStore,
} from "@/features/form-builder/store/useFormBuilderStore";
import { exportFormSchema } from "@/features/form-builder/domain/transformers";
import type { FormSchemaJson } from "@/features/form-builder/types/formBuilder.types";
import {
  clearFormDraft,
  createFormSnapshot,
  getFormDraft,
  saveFormDraft,
} from "../utils/draft-storage";

export interface UseEditorDraftOptions {
  formId: number | null;
  title: string;
  isReadOnly: boolean;
  isLoading: boolean;
  setTitle: (title: string) => void;
  titleInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface ServerFormPayload {
  id: number;
  name: string;
  schemaContent: FormSchemaJson;
  updatedAt?: string | null;
  currentUserPermission?: "owner" | "edit" | "view";
}

/**
 * Hook quản lý bản nháp, phát hiện thay đổi chưa lưu (Dirty Check),
 * Auto-save vào localStorage 
 */
export function useEditorDraft({
  formId,
  title,
  isReadOnly,
  isLoading,
  setTitle,
  titleInputRef,
}: UseEditorDraftOptions) {
  const pages = useFormBuilderStore((state) => state.pages);
  const getFormSchema = useFormBuilderStore((state) => state.getFormSchema);
  const loadFormSchema = useFormBuilderStore((state) => state.loadFormSchema);
  const resetForm = useFormBuilderStore((state) => state.resetForm);
  const setIsDirty = useFormBuilderStore((state) => state.setIsDirty);

  // Snapshot cho bản lưu chính thức gần nhất (từ server hoặc blank form)
  const lastSavedSnapshotRef = useRef<string>("");
  // Cờ chống trùng lặp Toast khi khôi phục nháp form mới
  const hasAlertedNewDraftToastRef = useRef<boolean>(false);

  // Quản lý vòng đời phiên khởi tạo form và chờ đo đạc Canvas ổn định
  const sessionRef = useRef<{
    isInitialLoadDone: boolean;
    isDraftRestored: boolean;
    settleTimer: NodeJS.Timeout | null;
  }>({
    isInitialLoadDone: false,
    isDraftRestored: false,
    settleTimer: null,
  });

  const clearSettleTimer = useCallback(() => {
    if (sessionRef.current.settleTimer) {
      clearTimeout(sessionRef.current.settleTimer);
      sessionRef.current.settleTimer = null;
    }
  }, []);

  /** Khởi tạo bản nháp cho Form mới (/editor) */
  const initNewFormDraft = useCallback(() => {
    clearSettleTimer();
    sessionRef.current.isInitialLoadDone = false;
    sessionRef.current.isDraftRestored = false;

    const defaultBlankSchema = exportFormSchema([createDefaultBlankPage(1, "page_initial")]);
    const emptySnapshot = createFormSnapshot("Biểu mẫu chưa đặt tên", defaultBlankSchema);

    const draft = getFormDraft(null);
    if (draft) {
      const draftSnapshot = createFormSnapshot(draft.title, draft.schema);
      if (draftSnapshot !== emptySnapshot) {
        sessionRef.current.isDraftRestored = true;
        loadFormSchema(draft.schema);
        setTitle(draft.title);
        if (titleInputRef.current) {
          titleInputRef.current.value = draft.title;
        }
        lastSavedSnapshotRef.current = emptySnapshot;
        setIsDirty(true);

        if (!hasAlertedNewDraftToastRef.current) {
          hasAlertedNewDraftToastRef.current = true;
          toast.info("Đã khôi phục bản nháp chưa lưu", {
            id: "restore-draft-new-toast",
          });
        }
      } else {
        clearFormDraft(null);
        resetForm();
        lastSavedSnapshotRef.current = emptySnapshot;
        setIsDirty(false);
      }
    } else {
      resetForm();
      lastSavedSnapshotRef.current = emptySnapshot;
      setIsDirty(false);
    }

    // Đợi Canvas mount và ổn định layout trước khi mở cờ auto-save
    sessionRef.current.settleTimer = setTimeout(() => {
      if (!sessionRef.current.isDraftRestored) {
        lastSavedSnapshotRef.current = createFormSnapshot(
          "Biểu mẫu chưa đặt tên",
          useFormBuilderStore.getState().getFormSchema(),
        );
        setIsDirty(false);
      }
      sessionRef.current.isInitialLoadDone = true;
    }, 250);
  }, [clearSettleTimer, loadFormSchema, resetForm, setIsDirty, setTitle, titleInputRef]);

  /** Xử lý nạp dữ liệu form từ server và kiểm tra bản nháp cũ */
  const handleServerFormLoaded = useCallback(
    (serverData: ServerFormPayload) => {
      clearSettleTimer();
      sessionRef.current.isInitialLoadDone = false;
      sessionRef.current.isDraftRestored = false;

      const serverTitle = serverData.name;
      const serverSchema = serverData.schemaContent;
      const serverUpdatedAt = serverData.updatedAt ? new Date(serverData.updatedAt).getTime() : 0;
      const isViewOnly = serverData.currentUserPermission === "view";

      // Kiểm tra bản nháp cũ trong localStorage
      const draft = !isViewOnly ? getFormDraft(serverData.id) : null;
      const isDraftNewer = Boolean(
        draft &&
        draft.savedAt &&
        draft.savedAt > serverUpdatedAt,
      );

      if (draft && isDraftNewer) {
        sessionRef.current.isDraftRestored = true;
        // Nạp server trước để lấy canonical snapshot mốc
        loadFormSchema(serverSchema);
        const canonicalServerSnapshot = createFormSnapshot(
          serverTitle,
          useFormBuilderStore.getState().getFormSchema(),
        );

        // Nạp bản nháp mới hơn của người dùng
        loadFormSchema(draft.schema);
        setTitle(draft.title);
        if (titleInputRef.current) {
          titleInputRef.current.value = draft.title;
        }

        lastSavedSnapshotRef.current = canonicalServerSnapshot;
        setIsDirty(true);
        toast.info("Đã khôi phục bản nháp chưa lưu từ phiên trước", {
          id: "restore-draft-saved-toast",
        });
      } else {
        // Dọn nháp cũ nếu server đã mới hơn
        if (draft && !isDraftNewer) {
          clearFormDraft(serverData.id);
        }

        loadFormSchema(serverSchema);
        setTitle(serverTitle);
        if (titleInputRef.current) {
          titleInputRef.current.value = serverTitle;
        }

        setIsDirty(false);
      }

      // Đợi Canvas mount và hoàn tất đo đạc tự nhiên các field (measureField)
      sessionRef.current.settleTimer = setTimeout(() => {
        if (!sessionRef.current.isDraftRestored) {
          const postMountSnapshot = createFormSnapshot(
            titleInputRef.current?.value || serverTitle,
            useFormBuilderStore.getState().getFormSchema(),
          );
          lastSavedSnapshotRef.current = postMountSnapshot;
          setIsDirty(false);
          clearFormDraft(serverData.id);
        }
        sessionRef.current.isInitialLoadDone = true;
      }, 300);
    },
    [clearSettleTimer, loadFormSchema, setIsDirty, setTitle, titleInputRef],
  );

  /** Cập nhật snapshot khi lưu form lên server thành công */
  const handleSaveSuccess = useCallback(
    (savedSnapshot: string) => {
      lastSavedSnapshotRef.current = savedSnapshot;
      setIsDirty(false);
    },
    [setIsDirty],
  );

  /** Dọn dẹp bản nháp khi reset hoặc tạo form mới */
  const clearDraft = useCallback((targetFormId?: number | null) => {
    hasAlertedNewDraftToastRef.current = false;
    clearFormDraft(targetFormId ?? null);
  }, []);

  // Tự động kiểm tra dirty state và debounce lưu nháp vào localStorage
  useEffect(() => {
    if (isLoading || isReadOnly || !sessionRef.current.isInitialLoadDone) return;
    if (!lastSavedSnapshotRef.current) return;

    const currentSnapshot = createFormSnapshot(title, getFormSchema());
    const isDifferent = currentSnapshot !== lastSavedSnapshotRef.current;

    setIsDirty(isDifferent);

    if (!isDifferent) {
      clearFormDraft(formId);
      return;
    }

    // Debounce 600ms lưu vào localStorage khi có thay đổi
    const timer = setTimeout(() => {
      saveFormDraft(formId, title, getFormSchema());
    }, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [pages, title, formId, isLoading, isReadOnly, getFormSchema, setIsDirty]);

  useEffect(() => {
    return () => {
      clearSettleTimer();
    };
  }, [clearSettleTimer]);

  return {
    initNewFormDraft,
    handleServerFormLoaded,
    handleSaveSuccess,
    clearDraft,
    clearSettleTimer,
    lastSavedSnapshotRef,
  };
}
