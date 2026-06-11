import {
  LayoutGrid,
  TrendingUp,
  Users,
  Newspaper,
  BookOpen,
  User,
  Gift,
  LayoutList,
  Settings,
} from "lucide-react";

export const PERSONAL_PATHS = [
  "/home/profile",
  "/home/referral",
  "/home/members/referred",
  "/home/content",
  "/home/settings",
];

export const NAV_ITEMS = [
  { href: "/home/members", label: "Thành viên", icon: Users },
  { href: "/home", label: "Bảng tin cộng đồng", icon: LayoutGrid },
  { href: "/home/news", label: "Bảng tin - BQT", icon: Newspaper },
  { href: "/home/top-sales", label: "Top doanh số", icon: TrendingUp },
];

export const BOTTOM_NAV_ITEMS = [
  { href: "/home/membership", label: "Đăng ký thành viên", icon: BookOpen },
];

export const PERSONAL_SUB_ITEMS = [
  { href: "/home/profile", label: "Hồ sơ", icon: User },
  { href: "/home/referral", label: "Mã giới thiệu", icon: Gift },
  { href: "/home/members/referred", label: "Đã giới thiệu", icon: Gift },
  { href: "/home/content", label: "Quản lý nội dung", icon: LayoutList },
  { href: "/home/settings", label: "Cài đặt", icon: Settings },
];
