import type { FieldDataMap } from "../types/formBuilder.types";

export const DEFAULT_FIELD_DATA: Readonly<FieldDataMap> = {
  text: {
    label: "Họ và tên",
    value: "",
    showLabel: true,
    showDottedLine: true,
  },
  textarea: {
    html: "<p>Đoạn văn</p>",
    showBorder: true,
  },
  number: {
    label: "Số lượng",
    value: undefined,
    showLabel: true,
    showDottedLine: true,
  },
  date: {
    label: "",
    value: undefined,
    showDateLabels: true,
    showDottedLine: true,
  },
  select: {
    label: "Danh sách",
    options: ["Lựa chọn 1", "Lựa chọn 2"],
    value: undefined,
    showLabel: true,
    showDottedLine: true,
  },
  line: {},
  checkbox: {
    label: "Hộp kiểm",
    checked: false,
    showLabel: true,
    showBorder: true,
  },
  label: {
    value: "Nhãn văn bản",
  },
  signature: {
    label: "Người làm đơn",
    subTitle: "(Ký, ghi rõ họ tên)",
    signerName: "Trần Văn A",
    value: undefined,
    showSignatureLabels: true,
    showSignerName: true,
  },
  qrcode: {
    value: "https://example.com",
  },
  image: {
    value: undefined,
  },
  datatable: {
    html: "<table><tbody><tr><th>Cột 1</th><th>Cột 2</th></tr><tr><td>Hàng 1</td><td>Hàng 2</td></tr></tbody></table>",
  },
};
