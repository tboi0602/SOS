export { adminUserService } from "./adminUser.service"
export { adminPostService } from "./adminPost.service"
export { adminActivityService } from "./adminActivity.service"
export { adminCustomerVisitService, type CustomerVisitImageAdmin } from "./adminCustomerVisit.service"
export { adminMembershipService } from "./adminMembership.service"
export {
  adminPendingMemberService,
  type PendingMember,
  type PendingMembersResponse,
  type PendingItem,
  type PendingItemsResponse,
} from "./adminPendingMember.service"

import { adminUserService } from "./adminUser.service"
import { adminPostService } from "./adminPost.service"
import { adminActivityService } from "./adminActivity.service"
import { adminCustomerVisitService } from "./adminCustomerVisit.service"
import { adminMembershipService } from "./adminMembership.service"
import { adminPendingMemberService } from "./adminPendingMember.service"

export const adminService = {
  ...adminUserService,
  ...adminPostService,
  ...adminActivityService,
  ...adminCustomerVisitService,
  ...adminMembershipService,
  ...adminPendingMemberService,
}
