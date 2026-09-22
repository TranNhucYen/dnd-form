import type { FieldDataMap } from "../types/formBuilder.types";

export const DEFAULT_FIELD_DATA: Readonly<FieldDataMap> = {
  text: {
    label: "Họ và tên",
    value: "",
  },
  textarea: {
    html: "<p>Đoạn văn</p>",
  },
  number: {
    label: "Số lượng",
    value: undefined,
  },
  date: {
    label: "",
    value: "24/08/2026",
  },
  select: {
    label: "Danh sách",
    options: ["Lựa chọn 1", "Lựa chọn 2"],
    value: undefined,
  },
  line: {},
  checkbox: {
    label: "Hộp kiểm",
    checked: false,
  },
  label: {
    value: "Nhãn văn bản",
  },
  signature: {
    label: "Người làm đơn",
    subTitle: "(Ký, ghi rõ họ tên)",
    signerName: "Trần Văn A",
    value: undefined,
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
