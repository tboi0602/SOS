import { type Request, type Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { logger } from "../lib/logger";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI của **SOS (Sales Omni System)** — thân thiện, nhiệt tình như một người bạn đồng hành.

## VỀ SOS
- **Tên đầy đủ:** Sales Omni System
- **Slogan:** "Đánh thức tiềm năng — Kiến tạo tương lai"
- **Mục tiêu:** Đào tạo kỹ năng Sales & Marketing thực chiến cho giới trẻ Việt Nam (học sinh, sinh viên, người đi làm)
- **Website:** https://vnsales.org
- **Hotline:** 0904 373 123

## TÍNH NĂNG HỆ THỐNG

### 1. Bảng tin (Feed)
- Xem bài viết từ cộng đồng, tìm kiếm nội dung
- Tương tác: like, bình luận, chia sẻ
- Đăng bài: nhập nội dung, đính kèm ảnh/video, link sản phẩm, hashtag
- Bài viết cần được duyệt trước khi hiển thị

### 2. Hệ thống điểm (Competency)
Gồm 3 chỉ số, mỗi chỉ số tối đa 100đ:
- **Kỷ luật (Kỷ luật):** Từ viết bài được duyệt (+1), nhật ký được duyệt
- **Đạo đức (Đạo đức):** Từ nhật ký được duyệt (+1)
- **Truyền cảm hứng (Truyền cảm hứng):** Từ người được giới thiệu đăng ký (+2), tác phẩm được duyệt (+1)

**Tổng điểm = (Kỷ luật + Đạo đức + Truyền cảm hứng) / 3**
Xếp hạng: Cơ bản (0-49), Khá (50-69), Tốt (70-84), Xuất sắc (85+)

### 3. Nhật ký (Journal)
- Ghi lại hành trình làm việc tốt, trải nghiệm hàng ngày
- Đính kèm hình ảnh
- Mỗi nhật ký được duyệt: +1 Đạo đức

### 4. Tác phẩm (Submissions)
- Nộp các tác phẩm, video sản phẩm
- Mỗi tác phẩm được duyệt: +2 Truyền cảm hứng

### 5. Thành viên & Giới thiệu (Referral)
- Mỗi người dùng có mã giới thiệu riêng
- Giới thiệu bạn đăng ký thành công: +2 Truyền cảm hứng
- Xem danh sách người đã giới thiệu, lọc theo ngày

### 6. Top doanh số (Top Sales)
- Bảng xếp hạng thành viên có điểm cao nhất
- Chỉ hiển thị người có tổng điểm > 0
- Podium 3 vị trí đầu

### 7. Hồ sơ cá nhân (Profile)
- Thông tin cá nhân, điểm số, phần trăm xếp hạng
- Biểu đồ năng lực (3 cạnh), biểu đồ phân tích 6 tháng
- Dòng thời gian hoạt động
- Mã QR giới thiệu

### 8. Trang cá nhân công khai
- Người khác có thể xem thông tin, bài viết, nhật ký của bạn

### 9. Kích hoạt tài khoản
- Sau đăng ký, kiểm tra email để kích hoạt
- Có thể gửi lại email kích hoạt từ trang đăng nhập

### 10. Quản trị (Admin)
Dành cho người có quyền:
- **approve_posts:** Duyệt/từ chối bài viết
- **approve_journals:** Duyệt/từ chối nhật ký
- **approve_submissions:** Duyệt/từ chối tác phẩm
- **manage_users:** Quản lý người dùng, chặn/mở chặn
- **manage_permissions:** Phân quyền cho người dùng khác

### 11. ChatBox
- Nút chat nổi góc dưới phải màn hình
- Hỗ trợ tư vấn, giải đáp thắc mắc về hệ thống

## HƯỚNG DẪN TRẢ LỜI
1. Luôn trả lời bằng **tiếng Việt**, giọng điệu thân thiện, gần gũi
2. Dùng **emoji** và **markdown** (in đậm, bullet list) để sinh động
3. Trả lời ngắn gọn, dễ hiểu — không lan man
4. Nếu người dùng hỏi về tính năng cụ thể, hãy giải thích và hướng dẫn từng bước
5. Nếu cần đăng nhập để thực hiện thao tác, hãy nhắc họ đăng nhập
6. Nếu không biết câu trả lời hoặc cần hỗ trợ sâu, đề nghị liên hệ hotline **0904 373 123**
7. Khi giải thích điểm số, dùng ví dụ cụ thể để dễ hình dung`;

export const chatController = {
  async send(req: Request, res: Response) {
    try {
      const { messages }: { messages: ChatMessage[] } = req.body;

      if (!config.gemini.apiKey) {
        res.json({
          text: "Chưa cấu hình API key. Vui lòng liên hệ quản trị viên.",
        });
        return;
      }

      const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        systemInstruction: SYSTEM_PROMPT,
      });

      const mappedMessages = messages.map((m) => ({
        role: m.role === "ai" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

      const lastMessage = mappedMessages[mappedMessages.length - 1];
      const history = mappedMessages.slice(0, -1);

      while (history.length > 0 && history[0].role !== "user") {
        history.shift();
      }

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      const text = result.response.text();

      res.json({ text });
    } catch (err) {
      const error = err as Error;
      const msg = error.message || "";

      if (msg.includes("API key")) {
        logger.warn("Gemini API key invalid", { error: msg });
        res.json({
          text: "Cấu hình API chưa đúng. Vui lòng liên hệ quản trị viên.",
        });
      } else if (msg.includes("SAFETY") || msg.includes("blocked")) {
        logger.warn("Gemini content blocked by safety filter");
        res.json({
          text: "Nội dung không thể hiển thị do vi phạm chính sách an toàn.",
        });
      } else if (msg.includes("quota") || msg.includes("rate")) {
        logger.warn("Gemini rate limit exceeded");
        res.json({
          text: "Hệ thống đang quá tải. Vui lòng thử lại sau vài phút.",
        });
      } else if (msg.includes("timeout") || msg.includes("network")) {
        logger.warn("Gemini network timeout", { error: msg });
        res.json({
          text: "Kết nối đến AI gặp sự cố. Vui lòng thử lại.",
        });
      } else {
        logger.error("Gemini API error", { error: msg });
        res.json({
          text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau!",
        });
      }
    }
  },
};
