import { ITemplateRepository } from './template.repository'
import {
  AdminTemplate,
  TemplateStatus,
  UpdateTemplateInput,
} from '../types/template.type'
import { Category } from '../../category/types/category.type'
import { mockCategories } from '../../category/repositories/category.mock.repository'
export { mockCategories }

export let mockAdminTemplates: AdminTemplate[] = [
  {
    id: 1,
    title: 'Đơn xin nghỉ phép trực tuyến',
    creatorName: 'Nguyễn Văn An',
    creatorEmail: 'vanan.nguyen@example.com',
    categoryId: 3,
    category: mockCategories[2],
    isPaid: false,
    description:
      'Quy trình nộp đơn nghỉ phép tiêu chuẩn dành cho nhân sự doanh nghiệp, tự động chuyển duyệt quản lý trực tiếp.',
    guidelines: [
      'Chọn loại nghỉ phép: phép năm, nghỉ ốm hoặc việc riêng.',
      'Đính kèm giấy tờ chứng minh nếu nghỉ ốm trên 2 ngày.',
      'Nộp trước ít nhất 3 ngày đối với phép năm.',
    ],
    review_status: TemplateStatus.APPROVED,
    status: 'active',
    approvedBy: 'Trần Nhực Yên',
    downloads: 980,
    createdAt: '15/08/2026',
  },
  {
    id: 2,
    title: 'Đăng ký tham gia Hội thảo Công nghệ AI 2026',
    creatorName: 'Lê Thị Thu',
    creatorEmail: 'thule.design@gmail.com',
    categoryId: 6,
    category: mockCategories[5],
    isPaid: true,
    description:
      'Form đăng ký vé tham dự hội thảo công nghệ cao cấp, tích hợp chọn phiên hội thảo và mã ưu đãi vé VIP.',
    guidelines: [
      'Điền đầy đủ họ tên, chức danh và công ty công tác.',
      'Chọn các phiên chuyên đề mong muốn tham gia trong ngày.',
      'Kiểm tra email xác nhận và mã vé QR sau khi hoàn tất.',
    ],
    review_status: TemplateStatus.PENDING,
    status: null,
    downloads: 215,
    createdAt: '22/08/2026',
  },
  {
    id: 3,
    title: 'Biểu mẫu thu thập ý kiến ứng viên tuyển dụng',
    creatorName: 'Phạm Minh Tuấn',
    creatorEmail: 'tuanpham@techcorp.vn',
    categoryId: 4,
    category: mockCategories[3],
    isPaid: false,
    description:
      'Thu thập phản hồi về trải nghiệm phỏng vấn từ ứng viên nhằm cải thiện quy trình tuyển dụng của phòng HR.',
    guidelines: [
      'Gửi ẩn danh để ứng viên thoải mái chia sẻ thật.',
      'Đánh giá thái độ của hội đồng phỏng vấn và độ khó bài test.',
    ],
    review_status: TemplateStatus.REJECTED,
    status: 'block',
    rejectReason:
      'Nội dung câu hỏi chưa đầy đủ điều khoản bảo mật thông tin ứng viên. Cần bổ sung mục đồng ý xử lý dữ liệu cá nhân theo quy định của pháp luật hiện hành trước khi được xuất bản lên thư viện biểu mẫu dùng chung.',
    downloads: 45,
    createdAt: '25/08/2026',
  },
  {
    id: 4,
    title: 'Đơn đặt hàng sản phẩm B2B cao cấp',
    creatorName: 'Hoàng Quốc Bảo',
    creatorEmail: 'bao.hoang@startup.io',
    categoryId: 3,
    category: mockCategories[2],
    isPaid: true,
    description:
      'Mẫu đặt hàng doanh nghiệp chuyên sâu với bảng chọn danh mục thiết bị, số lượng, hợp đồng và điều khoản giao dịch.',
    guidelines: [
      'Điền mã số thuế và thông tin xuất hóa đơn VAT chính xác.',
      'Chọn phương thức giao hàng và thời gian dự kiến nhận.',
      'Tải lên file đính kèm nếu có yêu cầu tùy biến thiết bị.',
    ],
    review_status: TemplateStatus.APPROVED,
    status: 'active',
    approvedBy: 'Trần Nhực Yên',
    downloads: 630,
    createdAt: '28/08/2026',
  },
  {
    id: 5,
    title: 'Phiếu liên hệ và tư vấn giải pháp',
    creatorName: 'Đặng Mai Phương',
    creatorEmail: 'phuong.dang@agency.com',
    categoryId: 5,
    category: mockCategories[4],
    isPaid: false,
    description:
      'Biểu mẫu tiếp nhận thông tin khách hàng tiềm năng cần tư vấn triển khai phần mềm CRM và tự động hóa quy trình.',
    guidelines: [
      'Nhập số điện thoại và email có thể liên hệ trong giờ hành chính.',
      'Tóm tắt ngắn gọn nhu cầu giải pháp cần triển khai.',
    ],
    review_status: TemplateStatus.PENDING,
    status: null,
    downloads: 110,
    createdAt: '01/09/2026',
  },
  {
    id: 6,
    title: 'Khảo sát nghiên cứu thị trường tiêu dùng',
    creatorName: 'Đỗ Hoàng Nam',
    creatorEmail: 'nam.do@fintech.vn',
    categoryId: 1,
    category: mockCategories[0],
    isPaid: true,
    description:
      'Mẫu khảo sát đa lựa chọn và thang đo Likert chuẩn quốc tế giúp nghiên cứu thói quen tiêu dùng ngành F&B.',
    guidelines: [
      'Thời lượng hoàn thành khảo sát dự kiến từ 5 đến 7 phút.',
      'Người tham gia cần trả lời đầy đủ tất cả câu hỏi bắt buộc.',
      'Tặng mã voucher giảm giá tại trang cảm ơn cuối biểu mẫu.',
    ],
    review_status: TemplateStatus.APPROVED,
    status: 'block',
    approvedBy: 'Nguyễn Văn An',
    downloads: 870,
    createdAt: '05/09/2026',
  },
  {
    id: 7,
    title: 'Đăng ký thành viên câu lạc bộ thể thao',
    creatorName: 'Bùi Thảo Linh',
    creatorEmail: 'linh.bui@creative.com',
    categoryId: 2,
    category: mockCategories[1],
    isPaid: false,
    description:
      'Mẫu tiếp nhận hội viên tham gia các câu lạc bộ thể thao, lựa chọn bộ môn và khung giờ tập luyện phù hợp.',
    guidelines: [
      'Chọn bộ môn đăng ký chính và bộ môn phụ trợ.',
      'Xác nhận tình trạng sức khỏe cá nhân trước khi tham gia.',
    ],
    review_status: TemplateStatus.PENDING,
    status: null,
    downloads: 340,
    createdAt: '08/09/2026',
  },
  {
    id: 8,
    title: 'Phiếu báo cáo sự cố hạ tầng CNTT',
    creatorName: 'Nguyễn Minh Châu',
    creatorEmail: 'chau.nguyen@enterprise.io',
    categoryId: 3,
    category: mockCategories[2],
    isPaid: false,
    description:
      'Quy trình ghi nhận sự cố mạng, máy chủ và thiết bị văn phòng, tự động gán mức độ ưu tiên theo chuẩn ITIL.',
    guidelines: [
      'Mô tả chi tiết triệu chứng sự cố và thời điểm xảy ra.',
      'Chụp ảnh màn hình báo lỗi đính kèm nếu có.',
      'Đánh giá mức độ ảnh hưởng đến công việc hàng ngày.',
    ],
    review_status: TemplateStatus.APPROVED,
    status: 'active',
    approvedBy: 'Trần Nhực Yên',
    downloads: 750,
    createdAt: '10/09/2026',
  },
  {
    id: 9,
    title: 'Khảo sát nội bộ về phúc lợi nhân viên',
    creatorName: 'Trịnh Kim Chi',
    creatorEmail: 'chi.trinh@edu-survey.org',
    categoryId: 1,
    category: mockCategories[0],
    isPaid: false,
    description:
      'Biểu mẫu thu thập ý kiến nhân viên về chính sách bảo hiểm, du lịch năm và môi trường làm việc tại văn phòng.',
    guidelines: [
      'Khảo sát hoàn toàn ẩn danh, nhân viên không cần đăng nhập.',
      'Góp ý thẳng thắn để công ty hoàn thiện chính sách.',
    ],
    review_status: TemplateStatus.REJECTED,
    status: null,
    rejectReason:
      'Trùng lặp với biểu mẫu đánh giá nhân sự quý 3 đã được duyệt trước đó.',
    downloads: 18,
    createdAt: '11/09/2026',
  },
  {
    id: 10,
    title: 'Đăng ký khóa học kỹ năng quản lý cấp trung',
    creatorName: 'Huỳnh Nhật Quang',
    creatorEmail: 'quang.huynh@logistics.vn',
    categoryId: 2,
    category: mockCategories[1],
    isPaid: true,
    description:
      'Khóa đào tạo chuyên sâu về kỹ năng lãnh đạo, giao việc và giải quyết xung đột trong môi trường Agile.',
    guidelines: [
      'Cung cấp thông tin người quản lý trực tiếp duyệt kinh phí học.',
      'Lựa chọn hình thức học: Offline cuối tuần hoặc Online buổi tối.',
    ],
    review_status: TemplateStatus.PENDING,
    status: null,
    downloads: 85,
    createdAt: '12/09/2026',
  },
  {
    id: 11,
    title: 'Đánh giá chất lượng dịch vụ bảo hành',
    creatorName: 'Đinh Bích Ngọc',
    creatorEmail: 'ngoc.dinh@marketing-pro.com',
    categoryId: 4,
    category: mockCategories[3],
    isPaid: false,
    description:
      'Mẫu đánh giá thái độ phục vụ của kỹ thuật viên bảo hành và thời gian xử lý sự cố thiết bị tại nhà khách hàng.',
    guidelines: [
      'Nhập mã biên nhận bảo hành để đối chiếu dữ liệu.',
      'Chấm điểm từ 1 đến 10 theo tiêu chí nhiệt tình và hiệu quả.',
    ],
    review_status: TemplateStatus.APPROVED,
    status: 'active',
    approvedBy: 'Trần Nhực Yên',
    downloads: 490,
    createdAt: '14/09/2026',
  },
]

export const templateMockRepository: ITemplateRepository = {
  async getTemplates(): Promise<AdminTemplate[]> {
    return [...mockAdminTemplates]
  },

  async getTemplateById(id: number): Promise<AdminTemplate | null> {
    const found = mockAdminTemplates.find((t) => t.id === id)
    return found ? { ...found } : null
  },

  async updateTemplate(id: number, data: UpdateTemplateInput): Promise<AdminTemplate | null> {
    const index = mockAdminTemplates.findIndex((t) => t.id === id)
    if (index === -1) return null

    let updatedCategory = data.category
    if (data.categoryId && !updatedCategory) {
      updatedCategory = mockCategories.find((c) => c.id === data.categoryId)
    }

    mockAdminTemplates[index] = {
      ...mockAdminTemplates[index],
      ...data,
      ...(updatedCategory ? { category: updatedCategory, categoryId: updatedCategory.id } : {}),
    }
    return { ...mockAdminTemplates[index] }
  },

  async getCategories(): Promise<Category[]> {
    return [...mockCategories]
  },
}
