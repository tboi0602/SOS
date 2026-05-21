import type { NavLink, Feature, ApproachStep, GalleryImage } from "@/types/landing"

export const SITE_NAME = "SOS"
export const SITE_DESC = "Sales Omni System — Hệ thống bán hàng toàn diện"

export const NAV_LINKS: NavLink[] = [
  { href: "#hero", label: "Trang chủ" },
  { href: "#values", label: "Triết lý" },
  { href: "#features", label: "Năng lực" },
  { href: "#approach", label: "Lộ trình" },
  { href: "#contact", label: "Liên hệ" },
]

export const HERO = {
  badge: "SOS — Hệ thống bán hàng toàn diện",
  title: "Đánh thức tiềm năng\nKiến tạo tương lai",
  subtitle:
    "Trang bị hành trang Sales & Marketing thực chiến, biến thanh thiếu niên Việt Nam thành đội ngũ thương mại tinh nhuệ — sẵn sàng cho kỷ nguyên số.",
  cta: "Tham gia ngay",
  secondary: "Khám phá thêm",
}

export const VALUES_DATA = [
  {
    number: "01",
    quote: "Kiến thức nền — Marketing, Bán hàng, Tech",
    text: "Nền tảng kiến thức vững chắc về Marketing, Bán hàng và Công nghệ — bộ ba sức mạnh cho mọi nhà sáng nghiệp trong thời đại số.",
  },
  {
    number: "02",
    quote: "Kỹ năng — Viết Brief, Content & Giao tiếp AI",
    text: "Làm chủ nghệ thuật viết Brief, sáng tạo nội dung và tương tác với AI — những kỹ năng không thể thiếu để dẫn đầu trong kỷ nguyên thương mại thông minh.",
  },
  {
    number: "03",
    quote: "Phẩm chất — Kỷ luật, Trung thực, Nhiệt tình",
    text: "Kỷ luật là tài chính của thành công. Trung thực tạo dựng niềm tin. Nhiệt tình thắp lửa đam mê — ba phẩm chất kiến tạo nên những cá nhân kiệt xuất.",
  },
]

export const FEATURES_DATA: Feature[] = [
  {
    title: "Digital Marketing Chuyên gia",
    description:
      "Làm chủ toàn bộ hệ thống Digital Marketing — từ SEO, Social Media, Email Marketing đến Performance Ads. Chiến lược bài bản, thực chiến 100%, đo lường bằng KPI thực tế.",
  },
  {
    title: "Đạo diễn AI — Sáng tạo nội dung",
    description:
      "Sử dụng AI để viết Brief, sản xuất nội dung, thiết kế hình ảnh và quay dựng video. AI không thay thế bạn — AI là vũ khí lợi hại nhất để bạn bứt phá.",
  },
  {
    title: "Automation Tools — Công cụ bán hàng",
    description:
      "Tự động hóa quy trình bán hàng với các công cụ hiện đại. CRM thông minh, chatbot AI, email automation — bán hàng 24/7, không bỏ lỡ bất kỳ khách hàng nào.",
  },
  {
    title: "Sales Mindset — Tư duy làm chủ",
    description:
      "Tư duy của người làm chủ — không đi xin việc, mà kiến tạo giá trị. Kỷ luật thép, khát vọng lớn, hành động hôm nay, tự do ngày mai.",
  },
]

export const APPROACH_DATA: ApproachStep[] = [
  {
    step: "01",
    title: "Quét mã QR — Đăng ký đầu vào",
    desc: "Quét mã QR để truy cập hệ thống, điền thông tin và bắt đầu hành trình. Tốc độ & Công nghệ tối ưu hóa trải nghiệm đầu vào — nhanh chóng, bảo mật, hiệu quả.",
  },
  {
    step: "02",
    title: "Chờ xét duyệt hồ sơ",
    desc: "Hệ thống AI tự động phân tích năng lực và xét duyệt hồ sơ. Tiêu chuẩn khắt khe để tạo nên những cá nhân kiệt xuất — chỉ những người thực sự khao khát mới ở lại.",
  },
  {
    step: "03",
    title: "Nhận tài khoản & Sales Kit",
    desc: "Kích hoạt tài khoản cá nhân trên hệ thống SOS. Nhận bộ Sales Kit đầy đủ — công cụ, tài liệu, kịch bản bán hàng — trang bị 'Vũ khí' cho mọi trận đánh.",
  },
  {
    step: "04",
    title: "Tham gia tập huấn thực chiến",
    desc: "Workshop hàng tuần cập nhật kiến thức & kỹ năng. Đào tạo trực tiếp từ chuyên gia, thực hành ngay trên các dự án thật — học phải đi đôi với hành.",
  },
  {
    step: "05",
    title: "Bắt đầu thương mại — Tạo doanh thu",
    desc: "Chính thức tham gia thị trường với sự hỗ trợ toàn diện. Doanh thu đột phá lên đến 50%, học bổng hấp dẫn tổng giá trị 4.200 TRIỆU — kết quả là thước đo duy nhất.",
  },
]

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, label: "Đào tạo thực chiến Sales & Marketing" },
  { id: 2, label: "Workshop hàng tuần cùng chuyên gia" },
  { id: 3, label: "Hệ thống AI đánh giá 5 chỉ số năng lực" },
  { id: 4, label: "Lễ vinh danh TOP 5 thành viên xuất sắc" },
  { id: 5, label: "Mạng lưới kết nối cộng đồng hiền tài" },
  { id: 6, label: "CLB HITA tại các trường Đại học, Cao đẳng" },
]

export const VISION = {
  badge: "Tầm nhìn",
  quote: "Mỗi thanh thiếu niên Việt Nam là một hiền tài",
  text: "SOS hướng tới trở thành Trung tâm Xúc tiến Thương mại & Nhân lực số 1 — nơi ươm mầm và kiến tạo thế hệ trẻ bản lĩnh, trí tuệ, phụng sự. Mở đầu bằng giáo dục, mở rộng ra thế giới.",
}

export const TARGET = {
  badge: "Đối tượng",
  title: "Thanh thiếu niên & Gen Z Việt Nam",
  emphasis: "Đừng đợi tốt nghiệp mới bắt đầu sự nghiệp!",
  text: "Dành cho học sinh, sinh viên và người trẻ mong muốn trang bị kỹ năng Sales & Marketing thực chiến, sở hữu thu nhập vượt trội và định vị bản thân trong kỷ nguyên số. Không giới hạn độ tuổi — chỉ cần bạn khao khát và kỷ luật.",
}

export const STATS_DATA = [
  { value: "10.000+", suffix: "thành viên", label: "gia nhập Hệ sinh thái SOS", color: "from-cyan to-primary" },
  { value: "85%", suffix: "hoàn thành", label: "tỷ lệ hoàn thành lộ trình thực chiến", color: "from-primary to-cyan" },
  { value: "120%", suffix: "tăng trưởng", label: "thu nhập trung bình sau 3 tháng", color: "from-cyan to-primary" },
  { value: "50+", suffix: "đối tác", label: "doanh nghiệp & trường học trong hệ sinh thái", color: "from-primary to-cyan" },
]

export const CTA = {
  title: "Sẵn sàng đánh thức tiềm năng?",
  subtitle: "Tham gia SOS ngay hôm nay để sở hữu kỹ năng — thu nhập — định vị bản thân.",
  button: "Đăng ký ngay",
}

export const CONTACT = {
  badge: "Liên hệ",
  title: "Đồng hành cùng SOS",
  subtitle: "Để lại thông tin, đội ngũ SOS sẽ liên hệ tư vấn lộ trình phù hợp nhất cho bạn.",
}
