"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Compass,
  HelpCircle,
  Lightbulb,
  Shield,
  XCircle,
  CheckCircle,
  Target,
  Award,
  UserCheck,
  Layers,
  Landmark,
  AlertTriangle,
  Scroll,
  Menu,
  X,
  ChevronRight,
  BookmarkCheck,
  Check,
  Info,
} from "lucide-react";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";

export default function ThongTinSuGiaPage() {
  const [activeSection, setActiveSection] = useState("sec-1");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const menuItems = [
    { id: "sec-1", label: "Khởi động hành trình", icon: Compass },
    { id: "sec-3", label: "Lý do ra đời", icon: HelpCircle },
    { id: "sec-5", label: "Định nghĩa Tinh Hoa", icon: Lightbulb },
    { id: "sec-6", label: "Tiêu chí phân định", icon: Shield },
    { id: "sec-8", label: "Lợi ích Sứ giả", icon: Target },
    { id: "sec-9", label: "Học thuyết 5T", icon: Layers },
    { id: "sec-11", label: "Chân dung & Quyền lợi", icon: UserCheck },
    { id: "sec-17", label: "Điều kiện tham gia", icon: Scroll },
    { id: "sec-19", label: "Tài chính & KPI", icon: Landmark },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of menuItems) {
        const el = document.getElementById(item.id);
        if (
          el &&
          el.offsetTop <= scrollPosition &&
          el.offsetTop + el.offsetHeight > scrollPosition
        ) {
          setActiveSection(item.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileNavOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] font-sans antialiased selection:bg-[color-mix(in_srgb,var(--clr-accent)_30%,transparent)] flex flex-col lg:flex-row relative">
      {/* MOBILE HEADER BUTTON */}
      <div className="lg:hidden sticky top-0 z-50 bg-[var(--surface-base)] border-b border-[var(--border-base)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-tight text-gradient-gold text-sm uppercase">
            Sứ Giả Tinh Hoa Việt
          </span>
        </div>
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="p-2 rounded-xl bg-[var(--surface-glass)] border border-[var(--border-base)] text-[var(--text-primary)]"
        >
          {isMobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <Header />
      {/* NAVBAR TRÁI NỔI BẬT */}
      <aside
        className={`
    fixed right-4 top-1/2 z-40 w-16 hover:w-72
    -translate-y-1/2  max-h-[85vh] p-3

    backdrop-blur-xl border border-[var(--border-strong)] 
    rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]
    flex flex-col justify-between items-center hover:items-stretch
    transition-all duration-300 ease-in-out group
    lg:translate-x-0
    ${isMobileNavOpen ? "translate-x-0" : "-translate-x-20 lg:translate-x-0"}
  `}
      >
        <div className="space-y-4 overflow-y-auto overflow-x-hidden pr-0.5 flex-1 w-full scrollbar-none py-2">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-4 px-2 py-3 text-xs font-semibold tracking-wider uppercase rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? "bg-[color-mix(in_srgb,var(--clr-accent)_15%,transparent)] border border-[var(--clr-primary)] text-[var(--clr-primary)] shadow-md font-bold"
                      : "text-[var(--text-secondary)] border border-transparent hover:bg-[var(--glass-hover)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {/* Icon giữ cố định vị trí ở giữa khi thu gọn */}
                  <div className="w-5 h-5 flex items-center justify-center shrink-0 mx-auto group-hover:mx-0">
                    <IconComponent
                      size={16}
                      className={
                        isActive
                          ? "text-[var(--clr-primary)]"
                          : "text-[var(--text-tertiary)]"
                      }
                    />
                  </div>

                  {/* Chữ tự động ẩn và mượt mà hiện ra khi mở rộng */}
                  <span className="truncate opacity-0 group-hover:opacity-100 transition-opacity duration-200 min-w-0">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* BACKGROUND DI ĐỘNG KHI MỞ MENU */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* MAIN CONTENT CONTAINER */}
      <div className="flex-1 min-w-0">
        {/* SECTION 1 */}
        <section
          id="sec-1"
          className="relative min-h-screen flex justify-center items-center overflow-hidden gradient-mesh border-b border-[var(--border-base)]"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--hero-gradient-from)] to-[var(--surface-base)]" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-bold tracking-tight text-gradient-gold heading-xl uppercase py-10"
            >
              Trở Thành Sứ Giả Tinh Hoa Việt
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xs font-semibold text-[var(--clr-primary)] tracking-[0.25em] uppercase bg-[color-mix(in_srgb,var(--clr-accent)_10%,transparent)] rounded-full px-6 py-2.5 inline-block ios-highlight"
            >
              Hành trình gìn giữ và lan tỏa giá trị thật
            </motion.p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="py-30 max-w-5xl mx-auto px-6 -mt-12 relative z-10">
          <div className="glass-card p-6 md:p-8 border border-[var(--glass-border)] shadow-xl rounded-2xl">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--clr-primary)] mb-6 flex items-center gap-3">
              <Compass className="text-[var(--clr-primary)]" size={16} />
              Danh Mục Nội Dung Thấu Hiểu
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Hiểu rõ Tinh Hoa Việt là gì và không phải là gì",
                "Hiểu sứ mệnh, tầm nhìn và giá trị của Tinh Hoa Việt",
                "Hiểu vai trò của Sứ giả Tinh Hoa Việt",
                "Hiểu rõ những giá trị nhận được khi tham gia chính thức",
                "Nhận thức được trách nhiệm, chuẩn mực và đạo đức 5T",
                "Sẵn sàng bước vào chương trình đào tạo Sứ giả Tinh Hoa Việt",
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-5 rounded-xl bg-[var(--surface-glass)] border border-[var(--border-base)] hover:border-[var(--clr-primary)]/40 hover:bg-[var(--glass-hover)] transition-all duration-300 group"
                >
                  <div className="font-mono text-xs text-[var(--text-dim)] group-hover:text-[var(--clr-primary)] transition-colors mb-3">
                    0{idx + 1}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 */}
        <section id="sec-3" className="py-16 max-w-5xl mx-auto px-6">
          <div className="card p-8 md:p-10 relative overflow-hidden bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-strong)] rounded-2xl shadow-lg">
            <h2 className="text-base font-bold tracking-tight mb-8 text-[var(--text-primary)] flex items-center gap-3">
              <HelpCircle className="text-[var(--clr-primary)]" size={20} />
              VÌ SAO TINH HOA VIỆT RA ĐỜI?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--clr-primary-light)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--clr-primary)]" />
                  Thực trạng hiện nay
                </h3>
                <ul className="space-y-3 pl-1">
                  {[
                    "Xã hội nhiều thông tin nhưng thiếu niềm tin",
                    "Người giỏi thật chưa được nhận diện đúng",
                    "Danh hiệu và truyền thông nhiều khi bị thương mại hóa",
                    "Giá trị thật dễ bị lẫn với giá trị ảo",
                  ].map((text, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-xs text-[var(--text-secondary)] leading-relaxed"
                    >
                      <ChevronRight
                        size={14}
                        className="text-[var(--clr-primary)] shrink-0 mt-0.5"
                      />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-xl bg-[color-mix(in_srgb,var(--clr-accent)_4%,transparent)] border border-[var(--border-base)] flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-warning)] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
                    Câu hỏi lớn đặt ra
                  </h3>
                  <ul className="space-y-3 pl-1 mt-4">
                    {[
                      "Ai sẽ bảo vệ giá trị thật?",
                      "Ai sẽ phát hiện những đóa sen ngát hương giữa đời thường?",
                      "Ai sẽ lan tỏa những điều tốt đẹp?",
                    ].map((text, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-xs text-[var(--text-secondary)] italic leading-relaxed"
                      >
                        <span className="text-[var(--color-warning)] font-bold mt-0.5">
                          ?
                        </span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="py-8 max-w-4xl mx-auto px-6 text-center">
          <div className="glass-card p-6 bg-gradient-to-r from-transparent via-[color-mix(in_srgb,var(--clr-accent)_6%,transparent)] to-transparent rounded-2xl border-x-0 border-y border-[var(--border-strong)]">
            <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[var(--clr-primary)] block mb-2">
              Thông điệp cốt lõi
            </span>
            <p className="text-xs text-[var(--text-tertiary)] italic mb-1">
              Tinh Hoa Việt không tạo ra giá trị
            </p>
            <p className="text-sm font-bold text-[var(--text-primary)] tracking-wide">
              "Tinh Hoa Việt đi tìm, xác lập, bảo chứng và lan tỏa những giá trị
              đã tồn tại"
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section id="sec-5" className="py-12 max-w-4xl mx-auto px-6">
          <div className="card p-6 md:p-8 border-l-4 border-l-[var(--clr-primary)] bg-[var(--surface-elevated)] shadow-lg rounded-r-2xl rounded-l-none">
            <h2 className="text-xs font-bold tracking-widest text-[var(--clr-primary)] uppercase mb-4 flex items-center gap-2">
              <Lightbulb size={15} />
              Định nghĩa TINH HOA VIỆT
            </h2>
            <p className="text-sm md:text-base font-medium leading-relaxed text-[var(--text-primary)] text-justify">
             &quot;Tinh Hoa Việt là hệ thống thẩm định và bảo chứng các giá trị đặc
              biệt của con người, tổ chức, sản phẩm, di sản và sáng kiến Việt
              Nam; dựa trên giá trị thật, tác động tích cực, bản sắc dân tộc,
              tinh thần sáng tạo và cống hiến cho cộng đồng, nhằm lan tỏa những
              hình mẫu tốt đẹp cho xã hội&quot;
            </p>
          </div>
        </section>

        {/* SECTION 6 */}
        <section
          id="sec-6"
          className="py-16 bg-[color-mix(in_srgb,var(--surface-elevated)_50%,transparent)] border-y border-[var(--border-base)]"
        >
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xs font-bold tracking-widest text-center uppercase mb-10 flex items-center justify-center gap-2">
              <Shield className="text-[var(--clr-primary)]" size={16} />
              TINH HOA VIỆT LÀ GÌ VÀ KHÔNG PHẢI LÀ GÌ?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="p-6 rounded-2xl border border-[var(--color-danger)]/20 bg-[color-mix(in_srgb,var(--color-danger)_4%,transparent)] shadow-sm">
                <h3 className="text-xs font-bold text-[var(--color-danger)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <XCircle size={15} /> Tinh Hoa Việt không phải
                </h3>
                <div className="space-y-2">
                  {[
                    "Danh hiệu để bán",
                    "Sân chơi của người nổi tiếng",
                    "Nơi tạo hào quang",
                    "Công cụ đánh bóng tên tuổi",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[var(--surface-base)] rounded-xl border border-[var(--border-base)] text-xs text-[var(--text-secondary)] font-medium flex items-center gap-2.5"
                    >
                      <X size={12} className="text-[var(--color-danger)]/70" />{" "}
                      {text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--color-success)]/20 bg-[color-mix(in_srgb,var(--color-success)_4%,transparent)] shadow-sm">
                <h3 className="text-xs font-bold text-[var(--color-success)] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle size={15} /> Tinh Hoa Việt là
                </h3>
                <div className="space-y-2">
                  {[
                    "Hệ thống phát hiện giá trị thật",
                    "Hệ thống xác lập giá trị",
                    "Hệ thống bảo chứng uy tín",
                    "Hệ sinh thái kết nối những người tử tế",
                    "Nơi tôn vinh những con người tạo giá trị cho cộng đồng",
                  ].map((text, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[var(--surface-base)] rounded-xl border border-[var(--border-base)] text-xs text-[var(--text-secondary)] font-medium flex items-center gap-2.5"
                    >
                      <Check
                        size={14}
                        className="text-[var(--color-success)]"
                      />{" "}
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 */}
        <section className="py-10 max-w-3xl mx-auto px-6 text-center">
          <div className="bg-[var(--surface-glass)] border border-[var(--border-base)] rounded-2xl p-6 backdrop-blur-sm shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-[var(--text-dim)] uppercase block mb-1">
              Triết lý hành động
            </span>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              Không cố tình tạo ra Tinh Hoa
            </p>
            <p className="text-xs text-[var(--clr-primary)] font-bold mt-0.5">
              Chỉ phát hiện và lan tỏa Tinh Hoa đã tồn tại
            </p>
          </div>
        </section>

        {/* SECTION 8 */}
        <section id="sec-8" className="py-16 max-w-5xl mx-auto px-6">
          <h2 className="text-sm font-bold text-gradient-gold uppercase tracking-wider text-center mb-12 flex items-center justify-center gap-2">
            <Target size={16} /> TẠI SAO NÊN TRỞ THÀNH SỨ GIẢ TINH HOA VIỆT?
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            <div className="card p-6 border border-[var(--border-strong)] rounded-2xl bg-[var(--surface-elevated)] flex flex-col justify-between hover:border-[var(--clr-primary)] transition-all duration-300 shadow-md">
              <div>
                <div className="w-8 h-8 rounded-xl bg-[color-mix(in_srgb,var(--clr-accent)_8%,transparent)] flex items-center justify-center text-[var(--clr-primary)] font-mono text-xs font-bold mb-4">
                  01
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Gìn giữ giá trị thực
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Không chạy theo danh vọng phô trương và góp phần bảo vệ cái
                  đúng, giá trị thật
                </p>
              </div>
            </div>
            <div className="card p-6 border border-[var(--border-strong)] rounded-2xl bg-[var(--surface-elevated)] flex flex-col justify-between hover:border-[var(--clr-primary)] transition-all duration-300 shadow-md">
              <div>
                <div className="w-8 h-8 rounded-xl bg-[color-mix(in_srgb,var(--clr-accent)_8%,transparent)] flex items-center justify-center text-[var(--clr-primary)] font-mono text-xs font-bold mb-4">
                  02
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Cộng đồng chung giá trị
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Kết nối người tử tế, đồng hành cùng những ai làm thật và sống
                  trách nhiệm
                </p>
              </div>
            </div>
            <div className="card p-6 border border-[var(--border-strong)] rounded-2xl bg-[var(--surface-elevated)] flex flex-col justify-between hover:border-[var(--clr-primary)] transition-all duration-300 shadow-md">
              <div>
                <div className="w-8 h-8 rounded-xl bg-[color-mix(in_srgb,var(--clr-accent)_8%,transparent)] flex items-center justify-center text-[var(--clr-primary)] font-mono text-xs font-bold mb-4">
                  03
                </div>
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                  Đào tạo nâng tầm
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Học tập Tư duy hệ thống 5T kết hợp rèn luyện kỹ năng đánh giá
                  chuyên sâu
                </p>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-5 mt-5 max-w-4xl mx-auto">
            <div className="glass-card p-6 border border-[var(--border-base)] rounded-2xl shadow-sm">
              <div className="font-mono text-xs text-[var(--clr-primary)] font-bold mb-2">
                04
              </div>
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                Ghi nhận uy tín xứng đáng
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-2">
                Sứ giả Tinh Hoa Việt là hình mẫu đại diện cho
              </p>
              <p className="text-xs text-[var(--text-secondary)] font-semibold">
                Chuẩn mực cao, trách nhiệm lớn và tinh thần phụng sự vô điều
                kiện
              </p>
            </div>
            <div className="glass-card p-6 bg-gradient-to-br from-[color-mix(in_srgb,var(--clr-accent)_5%,transparent)] to-transparent border border-[var(--border-base)] rounded-2xl flex flex-col justify-center shadow-sm">
              <div className="font-mono text-xs text-[var(--clr-primary)] font-bold mb-2">
                05
              </div>
              <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">
                Làm đẹp cho xã hội
              </h3>
              <p className="text-xs text-[var(--text-secondary)] italic">
                Một người tốt được phát hiện và lan tỏa sẽ tạo ra động lực
                chuyển hóa cho hàng vạn người tốt tiếp theo
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 9 */}
        <section
          id="sec-9"
          className="py-16 bg-[color-mix(in_srgb,var(--surface-strong)_30%,transparent)] border-y border-[var(--border-base)]"
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-10">
              <h2 className="text-xs font-bold tracking-widest text-[var(--clr-primary)] uppercase">
                HỌC THUYẾT 5T – NỀN TẢNG CỦA SỨ GIẢ TINH Hoa VIỆT
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {[
                { title: "THẬT", desc: "Sống thật, làm thật và nói thật" },
                { title: "MINH", desc: "Minh bạch, rõ ràng và có bằng chứng" },
                {
                  title: "CHỦ",
                  desc: "Chủ động, chịu trách nhiệm và không đổ lỗi",
                },
                {
                  title: "CHUYÊN",
                  desc: "Không ngừng học hỏi và nâng cao năng lực",
                },
                {
                  title: "TÔN",
                  desc: "Tôn trọng con người, văn hóa và giá trị",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="card p-5 text-center flex flex-col justify-between items-center bg-[var(--surface-base)] border border-[var(--border-strong)] hover:border-[var(--clr-primary)] transition-all duration-300 rounded-2xl shadow-sm group"
                >
                  <span className="text-xl font-black text-[var(--clr-primary)] tracking-wider block mb-3 group-hover:scale-110 transition-transform">
                    {item.title}
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10 */}
        <section className="py-10 max-w-3xl mx-auto px-6 text-center">
          <div className="glass-card p-5 border-t-2 border-t-[var(--clr-primary)] bg-[color-mix(in_srgb,var(--clr-accent)_3%,transparent)] rounded-b-2xl rounded-t-none">
            <span className="text-[10px] font-bold tracking-widest text-[var(--clr-primary)] uppercase block mb-1">
              Nguyên lý cốt tủy
            </span>
            <p className="text-xs font-semibold text-[var(--text-primary)] italic">
              &quot;Before spreading value to others, live by that value <br /> Trước khi
              lan tỏa giá trị cho người khác, hãy sống theo giá trị đó&quot;
            </p>
          </div>
        </section>

        {/* SECTION 11 & 12 */}
        <section
          id="sec-11"
          className="py-12 max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-6"
        >
          <div className="card p-6 relative overflow-hidden bg-gradient-to-tr from-[color-mix(in_srgb,var(--clr-accent)_5%,transparent)] to-[var(--surface-elevated)] border border-[var(--border-strong)] rounded-2xl shadow-md">
            <h2 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-1 flex items-center gap-2">
              <UserCheck className="text-[var(--clr-primary)]" size={16} /> SỨ
              GIẢ TINH HOA VIỆT LÀ AI?
            </h2>
            <p className="text-[10px] font-bold text-[var(--color-warning)] uppercase tracking-widest mb-5">
              Sứ giả không phải người có quyền lực
            </p>
            <div className="space-y-3">
              {[
                "Biết nhìn thấy điều tốt đẹp",
                "Biết ghi nhận và lan tỏa điều tốt đẹp",
                "Biết kết nối những người tạo giá trị",
                "Sống theo chuẩn mực đạo đức 5T",
                "Là đại diện hình ảnh chuẩn mực của Tinh Hoa Việt",
              ].map((text, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-xs text-[var(--text-secondary)] font-medium"
                >
                  <BookmarkCheck
                    size={14}
                    className="text-[var(--clr-primary)] shrink-0"
                  />
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border border-[var(--glass-border)] rounded-2xl shadow-md">
            <h2 className="text-xs font-bold tracking-wider text-[var(--clr-primary)] uppercase mb-5 flex items-center gap-2">
              <Layers size={16} /> GIÁ TRỊ NHẬN ĐƯỢC KHI THAM GIA CHÍNH THỨC
            </h2>
            <div className="grid gap-2.5">
              {[
                "Đào tạo bài bản theo lộ trình chuyên sâu độc quyền",
                "Chứng nhận thương hiệu cá nhân Sứ giả Tinh Hoa Việt",
                "Gia nhập quần thể sinh hoạt cộng đồng tinh hoa toàn quốc",
                "Mở rộng mạng lưới quan hệ với chuyên gia và doanh nhân",
                "Phát triển thương hiệu dựa trên nền tảng giá trị thật",
                "Đặc quyền tham gia đề cử và định danh các giá trị xã hội",
              ].map((text, i) => (
                <div
                  key={i}
                  className="p-3 bg-[var(--surface-glass)] rounded-xl border border-[var(--border-base)] text-xs text-[var(--text-secondary)] font-semibold flex items-center gap-3 hover:bg-[var(--glass-hover)] transition-colors"
                >
                  <Check
                    size={14}
                    className="text-[var(--clr-primary)] shrink-0"
                  />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 13 */}
        <section className="py-12 max-w-4xl mx-auto px-6">
          <div className="card p-6 md:p-8 bg-[var(--surface-elevated)] border border-[var(--border-strong)] relative rounded-2xl shadow-lg">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-[var(--clr-primary)]" />
            <h2 className="text-xs font-bold tracking-widest uppercase mb-6 text-center text-[var(--text-primary)]">
              CAM KẾT CỦA SỨ GIẢ TINH HOA VIỆT
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              {[
                "Sống theo học thuyết đạo đức 5T",
                "Kiên định bảo vệ sự thật",
                "Không ngừng lan tỏa điều tốt đẹp",
                "Không lợi dụng tổ chức vì lợi ích cá nhân",
                "Không đánh đổi giá trị lấy danh lợi cá nhân",
                "Trở thành người truyền cảm hứng tích cực",
              ].map((text, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-[color-mix(in_srgb,var(--clr-accent)_3%,transparent)] border border-[var(--border-base)] text-xs text-[var(--text-secondary)] font-medium flex items-center gap-3"
                >
                  <Check
                    size={14}
                    className="text-[var(--clr-primary)] shrink-0"
                  />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 14 */}
        <section className="py-12 bg-[color-mix(in_srgb,var(--surface-strong)_40%,transparent)] border-y border-[var(--border-base)]">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-center text-[var(--clr-primary)]">
              KÊU GỌI THAM GIA CHÍNH THỨC
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mt-6">
              <div className="p-5 rounded-2xl bg-[var(--surface-base)] border border-[var(--border-base)] shadow-sm">
                <h3 className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3">
                  Tinh Hoa Việt không đặt nặng việc bạn
                </h3>
                <ul className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                  <li className="flex items-center gap-2">
                    {" "}
                    Phải nổi tiếng rầm rộ
                  </li>
                  <li className="flex items-center gap-2">
                    {" "}
                    Phải giàu có hay tài chính lớn
                  </li>
                  <li className="flex items-center gap-2">
                    {" "}
                    Phải nắm giữ chức vụ cao quyền thế
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-2xl bg-[color-mix(in_srgb,var(--clr-accent)_5%,transparent)] border border-[var(--clr-primary)]/20 shadow-sm">
                <h3 className="text-xs font-bold text-[var(--clr-primary)] uppercase tracking-wider mb-3">
                  Nhưng chúng tôi đặc biệt cần người
                </h3>
                <ul className="space-y-2 text-xs text-[var(--text-primary)] font-semibold">
                  <li className="flex items-center gap-2 text-[var(--clr-primary)]">
                    {" "}
                    Có một trái tim tử tế chân thành
                  </li>
                  <li className="flex items-center gap-2 text-[var(--clr-primary)]">
                    {" "}
                    Có tinh thần sẵn sàng phụng sự
                  </li>
                  <li className="flex items-center gap-2 text-[var(--clr-primary)]">
                    {" "}
                    Muốn để lại giá trị lâu dài cho đời
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 15 & 16 */}
        <section className="py-12 max-w-3xl mx-auto px-6 text-center space-y-4">
          <div className="p-6 bg-[var(--surface-glass)] border border-[var(--border-base)] rounded-2xl shadow-sm">
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              If you want to be famous, there are many paths out there. But if
              you wish to be trusted and build true value for society, accompany
              the mission of the Tinh Hoa Viet Emissary.
            </p>
          </div>
          <div className="p-6 border border-[var(--clr-primary)]/20 bg-[color-mix(in_srgb,var(--clr-accent)_5%,transparent)] rounded-2xl italic font-semibold text-xs md:text-sm text-[var(--text-primary)] shadow-sm">
            “Tinh Hoa Việt không đi tìm những ngôi sao sáng nhất. Tinh Hoa Việt
            đi tìm những ngọn đèn không ngừng tỏa sáng để soi đường cho cộng
            đồng.”
          </div>
        </section>

        {/* SECTION 17 */}
        <section id="sec-17" className="relative py-16 max-w-4xl mx-auto px-6">
          <div className="card p-6 md:p-8 border border-[var(--border-strong)] shadow-lg bg-[var(--surface-elevated)] rounded-2xl">
            <h2 className="text-xs font-bold text-gradient-gold uppercase tracking-wider mb-1 flex items-center gap-2">
              <Scroll className="text-[var(--clr-primary)]" size={16} /> ĐIỀU
              KIỆN ĐỂ TRỞ THÀNH THÀNH VIÊN CHÍNH THỨC
            </h2>
            <p className="text-[11px] text-[var(--text-tertiary)] italic font-medium mb-6">
              Để được cấp thẻ định danh minh bạch trên hệ thống Cổng thông tin
              Tinh Hoa Việt, ứng viên cần đáp ứng đầy đủ
            </p>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-5 bg-[var(--surface-base)] rounded-xl border border-[var(--border-base)] hover:border-[var(--clr-primary)]/30 transition-colors">
                <span className="text-xs font-bold text-[var(--clr-primary)] uppercase tracking-wider block mb-3">
                  Hồ sơ pháp lý
                </span>
                <ul className="space-y-2 text-[11px] text-[var(--text-secondary)] font-medium">
                  <li className="flex items-center gap-1.5">
                    {" "}
                    Lý lịch khoa học chuẩn Bộ KH&CN
                  </li>
                  <li className="flex items-center gap-1.5">
                    {" "}
                    Sơ yếu lý lịch tự thuật chi tiết
                  </li>
                  <li className="flex items-center gap-1.5">
                    {" "}
                    Căn cước công dân sao y bản chính
                  </li>
                  <li className="flex items-center gap-1.5">
                    {" "}
                    Bằng cấp và chứng chỉ thành tích
                  </li>
                </ul>
              </div>

              <div className="p-5 bg-[var(--surface-base)] rounded-xl border border-[var(--border-base)] hover:border-[var(--clr-primary)]/30 transition-colors">
                <span className="text-xs font-bold text-[var(--clr-primary)] uppercase tracking-wider block mb-3">
                  Đào tạo bắt buộc
                </span>
                <p className="text-[11px] text-[var(--text-secondary)] font-medium leading-relaxed">
                  Hoàn thành trọn vẹn Khóa đào tạo tập huấn chuyên sâu chuẩn hóa
                  của Hội đồng, bao gồm buổi chuyên sâu trực tiếp và các buổi
                  tham gia tập huấn trực tuyến.
                </p>
              </div>

              <div className="p-5 bg-[var(--surface-base)] rounded-xl border border-[var(--border-base)] hover:border-[var(--clr-primary)]/30 transition-colors">
                <span className="text-xs font-bold text-[var(--clr-primary)] uppercase tracking-wider block mb-3">
                  Khảo sát sát hạch
                </span>
                <div className="space-y-2 text-[11px] text-[var(--text-secondary)] font-medium">
                  <p>
                    <strong className="text-[var(--text-primary)]">
                      Kiến thức:
                    </strong>{" "}
                    Trắc nghiệm hệ sinh thái gồm Vinh danh, Lưu danh, Kinh doanh
                    và Trao truyền.
                  </p>
                  <p>
                    <strong className="text-[var(--text-primary)]">
                      Thực tế:
                    </strong>{" "}
                    Kiểm tra năng lực xử lý tình huống phát sinh.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-[var(--surface-base)] rounded-xl border border-[var(--border-base)] text-[11px] text-[var(--text-secondary)] font-medium text-center flex items-center justify-center gap-2">
              <Info size={14} className="text-[var(--clr-primary)] shrink-0" />
              <span>
                Ký kết hợp đồng ràng buộc nghĩa vụ bảo mật thông tin nội bộ và
                cam kết tuân thủ đạo đức nghề nghiệp vô điều kiện.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 18 */}
        <section className="py-6 max-w-4xl mx-auto px-6">
          <div className="glass-card p-6 border border-[var(--glass-border)] rounded-2xl shadow-md">
            <h2 className="text-xs font-bold text-[var(--clr-primary)] uppercase tracking-wider mb-5 flex items-center gap-2">
              <Award className="text-[var(--clr-primary)]" size={16} /> QUYỀN
              LỢI CỦA THÀNH VIÊN CHÍNH THỨC
            </h2>
            <div className="grid md:grid-cols-2 gap-3 text-xs text-[var(--text-secondary)] font-medium">
              <p className="p-4 bg-[var(--surface-glass)] rounded-xl border border-[var(--border-base)] flex items-start gap-2">
                <Check
                  size={14}
                  className="text-[var(--clr-primary)] shrink-0 mt-0.5"
                />
                <span>
                  Áp dụng chính sách chuẩn hóa theo quy định chung của Tổ chức.
                </span>
              </p>
              <p className="p-4 bg-[var(--surface-glass)] rounded-xl border border-[var(--border-base)] flex items-start gap-2">
                <Check
                  size={14}
                  className="text-[var(--clr-primary)] shrink-0 mt-0.5"
                />
                <span>
                  Định danh minh bạch: Được niêm yết hồ sơ cá nhân trên Cổng
                  thông tin chính thức của Tổ chức Tinh Hoa Việt.
                </span>
              </p>
              <p className="p-4 bg-[var(--surface-glass)] rounded-xl border border-[var(--border-base)] flex items-start gap-2">
                <Check
                  size={14}
                  className="text-[var(--clr-primary)] shrink-0 mt-0.5"
                />
                <span>
                  Phát hành thẻ vật lý chứng nhận Thành viên chính thức của Hệ
                  thống toàn quốc.
                </span>
              </p>
              <p className="p-4 bg-[var(--surface-glass)] rounded-xl border border-[var(--border-base)] flex items-start gap-2">
                <Check
                  size={14}
                  className="text-[var(--clr-primary)] shrink-0 mt-0.5"
                />
                <span>
                  Cung cấp giải pháp, ấn phẩm truyền thông độc quyền và tư cách
                  pháp nhân hợp pháp khi thực thi công việc.
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 19 */}
        <section
          id="sec-19"
          className="py-16 max-w-5xl mx-auto px-6 border-t border-[var(--border-base)]"
        >
          <div className="rounded-2xl border border-[var(--border-strong)] overflow-hidden shadow-xl bg-[var(--surface-base)]">
            <div className="p-5 bg-[color-mix(in_srgb,var(--surface-strong)_80%,transparent)] border-b border-[var(--border-strong)] flex items-center gap-3">
              <Landmark className="text-[var(--clr-primary)]" size={18} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                QUY ĐỊNH VỀ THU PHÍ TẬP HUẤN VÀ CHỈ TIÊU KPI
              </h2>
            </div>

            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--border-strong)]">
              <div className="p-6 space-y-4">
                <span className="text-xs font-bold text-[var(--clr-primary)] uppercase tracking-widest block">
                  Phí tập huấn và Lưu trữ tài khoản: 6.000.000vnđ
                </span>
                <div className="space-y-2 text-xs text-[var(--text-secondary)] font-medium">
                  <p className="flex items-center gap-2">
                    {" "}
                    Bao gồm chi phí đào tạo thực tế các buổi chuyên sâu
                  </p>
                  <p className="flex items-center gap-2">
                    {" "}
                    Phí vận hành hệ thống dữ liệu định danh trên Cổng thông tin
                  </p>
                  <p className="flex items-center gap-2">
                    {" "}
                    Chi phí in ấn và phát hành thẻ Thành viên Tổ chức
                  </p>
                </div>
                <div className="pt-4 border-t border-[var(--border-base)] text-[11px] font-semibold text-[var(--color-warning)] italic flex items-start gap-2">
                  <Info
                    size={14}
                    className="text-[var(--color-warning)] shrink-0 mt-0.5"
                  />
                  <span>
                    Thẻ dữ liệu có hiệu lực trong vòng 12 tháng kể từ ngày cấp.
                    Sau khi hết hiệu lực, Thành viên thực hiện thủ tục nộp phí
                    gia hạn định kỳ theo quy định.
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-4 bg-[color-mix(in_srgb,var(--surface-elevated)_30%,transparent)]">
                <span className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-widest block">
                  Chỉ tiêu đo lường hiệu quả hành động
                </span>
                <p className="text-xs text-[var(--text-secondary)] font-medium">
                  Đảm bảo hạn ngạch số lượng hồ sơ đề cử hoặc giới thiệu chất
                  lượng hàng tháng áp dụng theo định mức quy định cụ thể của Ban
                  Thẩm Định Tổ chức.
                </p>
                <div className="p-4 rounded-xl bg-[color-mix(in_srgb,var(--color-danger)_6%,transparent)] border border-[var(--color-danger)]/20 flex gap-3 items-start shadow-sm">
                  <AlertTriangle
                    size={15}
                    className="text-[var(--color-danger)] shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-[var(--text-muted)] font-medium leading-relaxed">
                    <strong className="text-[var(--color-danger)]">
                      Lưu ý đặc biệt:
                    </strong>{" "}
                    Nếu không phát sinh hoạt động đóng góp hoặc không đạt hiệu
                    quả liên tục từ 3 đến 6 tháng, Tổ chức có toàn quyền xem xét
                    thu hồi chức danh chính thức.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}
