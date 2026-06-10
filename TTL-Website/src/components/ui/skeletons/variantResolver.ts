export function resolveVariant(name?: string) {
  if (!name) return "row";
  if (name.startsWith("admin-") && name !== "admin-dashboard")
    return "admin-table";
  switch (name) {
    case "home-feed":
      return "post-card";
    case "home-profile":
      return "profile";
    case "post-detail":
      return "post-detail";
    case "top-sales":
      return "top-sales";
    case "admin-dashboard":
      return "dashboard";
    case "members-page":
    case "referred-section":
      return "member-row";
    default:
      return "row";
  }
}
