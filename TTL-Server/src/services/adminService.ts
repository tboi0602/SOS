export { adminUserService } from "./admin/adminUserService";
export { adminActivityService } from "./admin/adminActivityService";

import { adminUserService } from "./admin/adminUserService";
import { adminActivityService } from "./admin/adminActivityService";
import { getDb } from "../db";

export const adminService = {
  ...adminUserService,
  ...adminActivityService,

  async getPendingCounts() {
    const [posts, journals, submissions, visits, messages] = await Promise.all([
      getDb().post.count({ where: { status: "pending" } }),
      getDb().journal.count({ where: { status: "pending" } }),
      getDb().submission.count({ where: { status: "pending" } }),
      getDb().customerVisitImage.count({ where: { status: "PENDING" } }),
      getDb().contactMessage.count({ where: { isRead: false } }),
    ])
    return { posts, journals, submissions, customerVisits: visits, contactMessages: messages }
  },
};
