/**
 * Trích xuất 1-2 chữ cái đầu của tên người dùng để làm ký tự đại diện cho Avatar
 * @param name Họ và tên người dùng
 * @returns Ký tự in hoa (mặc định 'U' nếu chuỗi rỗng)
 */
export function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'U'
  return (
    name
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  )
}
