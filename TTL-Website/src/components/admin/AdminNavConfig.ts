import { ComponentType } from "react";
import {
  LayoutDashboard,
  Users,
  Video,
  BookOpen,
  FileText,
  Edit3,
  Key,
  ClipboardList,
  Bell,
  GraduationCap,
  Camera,
  MessageSquare,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  permission: string | null;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        href: "/admin",
        label: "Bảng điều khiển",
        icon: LayoutDashboard,
        permission: null,
      },
      {
        href: "/admin/membership-flow",
        label: "Thành viên đăng ký",
        icon: GraduationCap,
        permission: "manage_users",
      },
      {
        href: "/admin/membership-documents",
        label: "Hồ sơ thành viên",
        icon: FileText,
        permission: "manage_users",
      },
    ],
  },
  {
    label: "Người dùng",
    items: [
      {
        href: "/admin/users",
        label: "Danh sách",
        icon: Users,
        permission: "manage_users",
      },
      {
        href: "/admin/permissions",
        label: "Phân quyền",
        icon: Key,
        permission: "manage_users",
      },
    ],
  },
  {
    label: "Nội dung",
    items: [
      {
        href: "/admin/posts/manage",
        label: "Bài đăng",
        icon: Edit3,
        permission: "manage_content",
      },
      {
        href: "/admin/posts",
        label: "Duyệt bài viết",
        icon: FileText,
        permission: "manage_content",
      },
      {
        href: "/admin/submissions",
        label: "Duyệt tác phẩm",
        icon: Video,
        permission: "manage_content",
      },
      {
        href: "/admin/journals",
        label: "Duyệt nhật ký",
        icon: BookOpen,
        permission: "manage_content",
      },
      {
        href: "/admin/customer-visits",
        label: "Gặp khách hàng",
        icon: Camera,
        permission: "manage_content",
      },
    ],
  },
  {
    label: "Truyền thông & Học tập",
    items: [
      {
        href: "/admin/notifications",
        label: "Thông báo",
        icon: Bell,
        permission: "manage_notifications",
      },
      {
        href: "/admin/elearning",
        label: "E-learning",
        icon: GraduationCap,
        permission: "manage_lessons",
      },
    ],
  },
  {
    label: "Giám sát",
    items: [
      {
        href: "/admin/activity-log",
        label: "Hoạt động",
        icon: ClipboardList,
        permission: "admin",
      },
    ],
  },
  {
    label: "Hỗ trợ",
    items: [
      {
        href: "/admin/contact",
        label: "Hỗ Trợ",
        icon: MessageSquare,
        permission: "admin",
      },
    ],
  },
];

export function getNavGroups(role: string, permissions: string[]) {
  const isAdmin = role === "admin";
  return NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (!item.permission) return true;
      if (item.permission === "admin") return isAdmin;
      return isAdmin || permissions.includes(item.permission);
    }),
  })).filter((group) => group.items.length > 0);
}
