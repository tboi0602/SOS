export { adminUserService } from "./admin/adminUserService";
export { adminActivityService } from "./admin/adminActivityService";
export { adminPendingMemberService } from "./admin/adminPendingMemberService";

import { adminUserService } from "./admin/adminUserService";
import { adminActivityService } from "./admin/adminActivityService";
import { adminPendingMemberService } from "./admin/adminPendingMemberService";

export const adminService = {
  ...adminUserService,
  ...adminActivityService,
  ...adminPendingMemberService,
};
