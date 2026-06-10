import type {
  NavLink,
  Feature,
  ApproachStep,
  GalleryImage,
} from "@/types/landing";

export const SITE_NAME = "Tinh Hoa Việt";

export const NAV_LINKS: NavLink[] = [{ href: "#hero", label: "Trang chủ" }];

export const HERO = {
  badge: "TỔ CHỨC TINH HOA VIỆT",
  title: "Suy tôn Trí tuệ — Lưu truyền Di sản",
  subtitle:
    "Tổ chức kiến tạo và bảo chứng giá trị nội dung — nơi trí tuệ được tôn vinh, di sản được bảo hộ và thành tựu của Quý vị trở thành Di sản vĩnh cửu của Dân tộc Việt Nam.",
  cta: "Tham gia ngay",
  secondary: "Tìm hiểu thêm",
  tagline: "VINH DANH — LƯU DANH — KINH DOANH — TRAO TRUYỀN",
};

export const MISSION = {
  badge: "HỆ QUY CHIẾU 5T",
  title: "5T — Truth",
  subtitle:
    "Mọi giá trị được suy tôn tại Tinh Hoa Việt đều phải vượt qua lăng kính khắt khe của giới học thuật toàn cầu, hội tụ trọn vẹn 5 cơ sở nền tảng.",
  items: [
    {
      t: "Chân thực",
      desc: "Khởi nguồn từ một 'lẽ sống' chân chính và đam mê tận hiến. Giá trị đích thực chỉ có thể được sinh ra từ sự thật.",
    },
    {
      t: "Minh bạch",
      desc: "Thể hiện sự tự tin vào tính chính trực và sẵn sàng chịu trách nhiệm. Không có gì phải che giấu khi giá trị là thật.",
    },
    {
      t: "Tự chủ",
      desc: "Làm chủ tư duy và tầm nhìn để đạt tự do đích thực trong sáng tạo. Năng lực tự chủ là nền tảng của mọi sự trường tồn.",
    },
    {
      t: "Tinh thông",
      desc: "Theo đuổi sự xuất sắc không ngừng nghỉ, biến tri thức thành một phẩm giá. Tinh thông là đỉnh cao của sự cống hiến.",
    },
    {
      t: "Bền vững",
      desc: "Kiến tạo giá trị hài hòa, tôn trọng con người, cộng đồng và hệ thiên nhiên. Chỉ có bền vững mới xứng đáng trường tồn.",
    },
  ],
};

export const ECOSYSTEM = {
  badge: "HỆ SINH THÁI NỀN TẢNG SỐ",
  title: "Ba cổng Tinh Hoa Việt",
  subtitle:
    "Tất cả Tinh Hoa nội dung được phân bổ và hệ thống hóa, đồng thời được quản trị chặt chẽ trên 3 nền tảng cốt lõi.",
  portals: [
    {
      acronym: "CỔNG 1",
      name: "ĐỀ CỬ & VINH DANH TINH HOA VIỆT",
      subtitle: "VINH DANH",
      desc: "Nơi tìm kiếm, tư vấn Tinh Hoa Việt và công bố mọi thông tin, quy chế, văn bản chính thức về việc Đề cử và Xác lập. Lưu trữ hồ sơ hành chính, pháp lý của toàn bộ các cá nhân, đơn vị, tổ chức đã được Xác lập.",
      url: "tinhhoaviet.org.vn",
      color: "from-primary to-accent",
    },
    {
      acronym: "CỔNG 2",
      name: "SÀN TÀI SẢN TRÍ TUỆ TINH HOA VIỆT",
      subtitle: "KHAI THÁC",
      desc: "Nền tảng hiển thị các thông tin trọng tâm về sản phẩm, dịch vụ hoặc tác phẩm của đối tượng đã Xác lập hoặc đang đề cử. Tích hợp tính năng thương mại điện tử và hệ thống Affiliate dành cho CTV, Đối tác xúc tiến.",
      url: "santaisantritue.com",
      color: "from-primary to-accent",
    },
    {
      acronym: "CỔNG 3",
      name: "BẢN ĐỒ TÀI SẢN TRÍ TUỆ & MXH",
      subtitle: "LƯU DANH & TRAO TRUYỀN",
      desc: "Nền tảng lưu danh và trao truyền các giá trị nội dung, trí tuệ. Giao diện Bản đồ Số Tinh Hoa Việt 3D giúp tra cứu thông tin toàn cầu. Kết nối MXH để chủ sở hữu phát triển cộng đồng, truyền nghề và tương tác với thị trường.",
      url: "congdong.tinhhoaviet.org.vn",
      color: "from-accent to-primary",
    },
  ],
};

export const CONTACT = {
  badge: "Liên hệ",
  title: "Đồng hành cùng Tinh Hoa Việt",
  subtitle:
    "Liên hệ với chúng tôi để được tư vấn về thủ tục Đề cử và Xác lập Tinh Hoa Việt.",
  address: "181 Đề Thám, Phường Bến Thành, TP. Hồ Chí Minh",
  phone: "0834.11.22.88",
  email: "tinhhoanoidung@gmail.com",
  hotline: "0989.55.3535",
};

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
];

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
];

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
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 1, label: "Đào tạo thực chiến Sales & Marketing" },
  { id: 2, label: "Workshop hàng tuần cùng chuyên gia" },
  { id: 3, label: "Hệ thống AI đánh giá 5 chỉ số năng lực" },
  { id: 4, label: "Lễ vinh danh TOP 5 thành viên xuất sắc" },
  { id: 5, label: "Mạng lưới kết nối cộng đồng hiền tài" },
  { id: 6, label: "CLB HITA tại các trường Đại học, Cao đẳng" },
];

export const VISION = {
  badge: "Tầm nhìn",
  quote: "Mỗi thanh thiếu niên Việt Nam là một hiền tài",
  text: "THV hướng tới trở thành Trung tâm Xúc tiến Thương mại & Nhân lực số 1 — nơi ươm mầm và kiến tạo thế hệ trẻ bản lĩnh, trí tuệ, phụng sự. Mở đầu bằng giáo dục, mở rộng ra thế giới.",
};

export const TARGET = {
  badge: "Đối tượng",
  title: "Thanh thiếu niên & Gen Z Việt Nam",
  emphasis: "Đừng đợi tốt nghiệp mới bắt đầu sự nghiệp!",
  text: "Dành cho học sinh, sinh viên và người trẻ mong muốn trang bị kỹ năng Sales & Marketing thực chiến, sở hữu thu nhập vượt trội và định vị bản thân trong kỷ nguyên số. Không giới hạn độ tuổi — chỉ cần bạn khao khát và kỷ luật.",
};

export const STATS_DATA = [
  {
    value: "10.000+",
    suffix: "thành viên",
    label: "gia nhập Hệ sinh thái THV",
    color: "from-primary to-accent",
  },
  {
    value: "85%",
    suffix: "hoàn thành",
    label: "tỷ lệ hoàn thành lộ trình thực chiến",
    color: "from-accent to-primary",
  },
  {
    value: "120%",
    suffix: "tăng trưởng",
    label: "thu nhập trung bình sau 3 tháng",
    color: "from-primary to-accent",
  },
  {
    value: "50+",
    suffix: "đối tác",
    label: "doanh nghiệp & trường học trong hệ sinh thái",
    color: "from-accent to-primary",
  },
];

export const CTA = {
  title: "Sẵn sàng đánh thức tiềm năng?",
  subtitle:
    "Tham gia THV ngay hôm nay để sở hữu kỹ năng — thu nhập — định vị bản thân.",
  button: "Đăng ký ngay",
};

export const EXPERIENCE_SECTION = {
  badge: "Trải nghiệm",
  title: "Câu chuyện",
  subtitle: "Blog chia sẻ hành trình tại Tinh Hoa Việt",
};

export const NEWS_SECTION = {
  badge: "Tin tức",
  title: "Sự kiện & truyền thông",
  subtitle: "Cập nhật tin tức và sự kiện mới nhất từ Tinh Hoa Việt",
};
