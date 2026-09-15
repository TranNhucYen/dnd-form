import { ITemplateRepository } from "./template.repository";
import { Template, TemplateType, TemplatePricingType, TemplateStatus } from "../types/template.type";

const mockData: Template[] = [
  {
    id: 1,
    name: 'Đơn xin nghỉ phép',
    description: 'Mẫu đơn xin nghỉ phép chuẩn dành cho cán bộ, nhân viên văn phòng và người lao động sử dụng khi có nhu cầu xin nghỉ phép năm, nghỉ việc riêng hoặc nghỉ chế độ.',
    categoryId: 1,
    categoryName: 'Hành chính - Nhân sự',
    ownerId: 1,
    ownerName: 'DragForm Team',
    type: TemplateType.STATIC_FILE,
    pricingType: TemplatePricingType.FREE,
    status: TemplateStatus.ACTIVE,
    downloads: 12450,
    guideline: [
      { id: "g1", content: "Điền đầy đủ thông tin cá nhân (Họ tên, bộ phận làm việc)." },
      { id: "g2", content: "Nêu rõ khoảng thời gian nghỉ phép (Từ ngày nào đến ngày nào, tổng số ngày)." },
      { id: "g3", content: "Ghi rõ lý do xin nghỉ phép một cách thuyết phục và chính đáng." },
      { id: "g4", content: "Mô tả chi tiết nội dung bàn giao công việc và người nhận bàn giao." },
      { id: "g5", content: "Ký tên và chuyển cho trưởng bộ phận và bộ phận nhân sự duyệt." }
    ],
    createdAt: new Date('2026-07-03'),
    updatedAt: new Date('2026-07-03'),
  },
  {
    id: 2,
    name: 'Quyết định bổ nhiệm nhân sự',
    description: 'Quyết định bổ nhiệm nhân sự giữ các vị trí quản lý phòng ban, dự án trong doanh nghiệp.',
    categoryId: 1,
    categoryName: 'Hành chính - Nhân sự',
    ownerId: 1,
    ownerName: 'DragForm Team',
    type: TemplateType.STATIC_FILE,
    pricingType: TemplatePricingType.FREE,
    status: TemplateStatus.ACTIVE,
    downloads: 4120,
    guideline: [
      { id: "g1", content: "Điền thông tin ban giám đốc phê duyệt." },
      { id: "g2", content: "Điền thông tin người được bổ nhiệm." }
    ],
    createdAt: new Date('2026-07-01'),
    updatedAt: new Date('2026-07-01'),
  },
  {
    id: 3,
    name: 'Đơn xin thôi việc',
    description: 'Mẫu đơn xin thôi việc chính thức dành cho người lao động muốn chấm dứt hợp đồng lao động theo quy định.',
    categoryId: 1,
    categoryName: 'Hành chính - Nhân sự',
    ownerId: 2,
    ownerName: 'Nguyễn Văn A',
    type: TemplateType.STATIC_FILE,
    pricingType: TemplatePricingType.FREE,
    status: TemplateStatus.ACTIVE,
    downloads: 8750,
    createdAt: new Date('2026-06-28'),
    updatedAt: new Date('2026-06-28'),
  },
  {
    id: 4,
    name: 'Hợp đồng lao động không xác định thời hạn',
    description: 'Mẫu hợp đồng lao động chuẩn pháp lý giữa doanh nghiệp và người lao động.',
    categoryId: 2,
    categoryName: 'Hợp đồng - Pháp lý',
    ownerId: 1,
    ownerName: 'DragForm Team',
    type: TemplateType.DND_TEMPLATE,
    pricingType: TemplatePricingType.FREE,
    status: TemplateStatus.ACTIVE,
    downloads: 2540,
    createdAt: new Date('2026-06-25'),
    updatedAt: new Date('2026-06-25'),
  },
  {
    id: 5,
    name: 'Đơn xin nghỉ phép nâng cao',
    description: 'Mẫu đơn xin nghỉ phép phiên bản nâng cao dành cho cấp quản lý hoặc doanh nghiệp lớn. Tích hợp sẵn quy trình duyệt đa cấp và bảng theo dõi phép năm tự động đi kèm.',
    categoryId: 1,
    categoryName: 'Hành chính - Nhân sự',
    ownerId: 1,
    ownerName: 'DragForm Team',
    type: TemplateType.STATIC_FILE,
    pricingType: TemplatePricingType.PAID,
    status: TemplateStatus.ACTIVE,
    downloads: 1230,
    guideline: [
      { id: "g1", content: "Nhập thông tin cá nhân và số ngày phép năm hiện tại." },
      { id: "g2", content: "Chọn các cấp duyệt tương ứng theo cấu trúc phòng ban." },
      { id: "g3", content: "Điền thông tin người thay thế xử lý công việc khẩn cấp." },
      { id: "g4", content: "Gửi yêu cầu phê duyệt thông qua hệ thống quản lý trực tuyến." }
    ],
    createdAt: new Date('2026-07-01'),
    updatedAt: new Date('2026-07-01'),
  },
  {
    id: 6,
    name: 'Biên bản bàn giao công việc & tài sản',
    description: 'Mẫu biên bản bàn giao chi tiết các công việc, tài liệu và trang thiết bị tài sản khi nhân viên chuyển công tác, nghỉ việc hoặc bàn giao dự án.',
    categoryId: 1,
    categoryName: 'Hành chính - Nhân sự',
    ownerId: 1,
    ownerName: 'DragForm Team',
    type: TemplateType.DND_TEMPLATE,
    pricingType: TemplatePricingType.FREE,
    status: TemplateStatus.ACTIVE,
    downloads: 5630,
    guideline: [
      { id: "g1", content: "Điền thông tin bên giao và bên nhận bàn giao." },
      { id: "g2", content: "Liệt kê danh sách hồ sơ, tài liệu công việc kèm tình trạng xử lý." },
      { id: "g3", content: "Kiểm kê các thiết bị, tài sản công ty được cấp phát và ghi rõ hiện trạng." },
      { id: "g4", content: "Đại diện hai bên và người chứng kiến/quản lý trực tiếp ký xác nhận." }
    ],
    createdAt: new Date('2026-07-05'),
    updatedAt: new Date('2026-07-05'),
  }
];

export const templateMockRepository: ITemplateRepository = {
  async findById(id: number): Promise<Template | null> {
    const template = mockData.find(item => item.id === id);
    return template || null;
  },
  async findAll(): Promise<Template[]> {
    return mockData;
  }
};