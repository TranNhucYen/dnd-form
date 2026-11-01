import type { PDFDocumentProxy } from "pdfjs-dist";

function ensurePdfWorker(pdfjsLib: typeof import("pdfjs-dist")) {
  if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }
}

export async function renderPdfPageToBlobUrl(
  pdf: PDFDocumentProxy,
  pageNum: number,
): Promise<string> {
  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 2.0 }); // Phóng to 2x để ảnh nền sắc nét

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  if (!context) {
    throw new Error("Trình duyệt không hỗ trợ Canvas 2D");
  }

  const renderContext = {
    canvas,
    canvasContext: context,
    viewport: viewport,
  };
  await page.render(renderContext).promise;

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/png"),
  );

  if (!blob) {
    throw new Error(`Không thể tạo hình ảnh cho trang ${pageNum}`);
  }

  return URL.createObjectURL(blob);
}

export async function extractPdfPagesToBlobUrls(file: File): Promise<string[]> {
  // Nếu là file ảnh thông thường
  if (file.type.startsWith("image/")) {
    const blobUrl = URL.createObjectURL(file);
    return [blobUrl];
  }

  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      ensurePdfWorker(pdfjsLib);

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const blobUrls: string[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const blobUrl = await renderPdfPageToBlobUrl(pdf, pageNum);
        blobUrls.push(blobUrl);
      }

      return blobUrls;
    } catch (err) {
      console.error("Lỗi trích xuất PDF client-side:", err);
      throw new Error(
        "Không thể đọc file PDF. Vui lòng kiểm tra lại file của bạn.",
      );
    }
  }

  throw new Error("Định dạng file không được hỗ trợ. Vui lòng chọn file .pdf hoặc ảnh.");
}

export async function loadPdfDocument(url: string): Promise<PDFDocumentProxy> {
  const pdfjsLib = await import("pdfjs-dist");
  ensurePdfWorker(pdfjsLib);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Tải tài liệu PDF thất bại (${res.status} ${res.statusText})`);
  }

  const arrayBuffer = await res.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
  });
  return await loadingTask.promise;
}
