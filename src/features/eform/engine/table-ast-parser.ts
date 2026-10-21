import type { EFormTableCell, EFormTableData, EFormTableRow } from "../types/eform.types";

/**
 * Phân tích cú pháp chuỗi HTML của bảng bằng Native DOMParser của trình duyệt
 */
export function getEFormTableData(html?: string): EFormTableData | null {
  if (typeof window === "undefined" || !html) return null;

  try {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const rowEls = doc.querySelectorAll("tr");
    if (rowEls.length === 0) return null;

    let maxCols = 1;
    const rows: EFormTableRow[] = [];

    rowEls.forEach((tr, rIdx) => {
      let colCount = 0;
      const cells: EFormTableCell[] = Array.from(tr.querySelectorAll("th, td")).map((el, cIdx) => {
        const isHeader = el.tagName === "TH";
        const colSpan = Math.max(1, Number(el.getAttribute("colspan")) || 1);
        const rowSpan = Math.max(1, Number(el.getAttribute("rowspan")) || 1);
        colCount += colSpan;

        const htmlEl = el as HTMLElement;
        const align = (htmlEl.style?.textAlign || el.getAttribute("align") || undefined) as
          | "left"
          | "center"
          | "right"
          | "justify"
          | undefined;

        return {
          id: `c_${rIdx}_${cIdx}`,
          isHeader,
          colSpan,
          rowSpan,
          text: (el.textContent || "").trim(),
          style: {
            bold: isHeader || !!el.querySelector("strong, b"),
            italic: !!el.querySelector("em, i"),
            textAlign: align,
          },
        };
      });

      if (cells.length > 0) {
        maxCols = Math.max(maxCols, colCount);
        rows.push({ id: `r_${rIdx}`, cells });
      }
    });

    return rows.length > 0 ? { totalColumns: maxCols, rows } : null;
  } catch (error) {
    console.warn("[TableParser] Không thể phân tích HTML table:", error);
    return null;
  }
}
