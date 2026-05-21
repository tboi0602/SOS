import { type Request, type Response, type NextFunction } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config";
import { logger } from "../lib/logger";

interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

const SYSTEM_PROMPT = `Bạn là trợ lý AI của **SOS (Sales Omni System)** — một hệ thống đào tạo bán hàng và marketing toàn diện dành cho giới trẻ Việt Nam.

Thông tin về SOS:
- **Tên đầy đủ:** Sales Omni System
- **Chủ đề:** Đào tạo Sales & Marketing thực chiến
- **Đối tượng:** Học sinh, sinh viên, người đi làm muốn phát triển kỹ năng bán hàng
- **Chương trình:** Đào tạo kỹ năng bán hàng, marketing online, xây dựng thương hiệu cá nhân
- **Hotline:** 0904 373 123

Hướng dẫn:
- Trả lời bằng tiếng Việt, thân thiện, nhiệt tình
- Sử dụng **markdown** để làm nổi bật thông tin quan trọng
- Nếu không biết câu trả lời, hãy đề nghị người dùng liên hệ hotline
- Giữ câu trả lời ngắn gọn, dễ hiểu, phù hợp với giới trẻ`;

export const chatController = {
  async send(req: Request, res: Response, next: NextFunction) {
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
      console.log("Gemini API error:", error.message);
      if (error.message?.includes("API key")) {
        logger.warn("Gemini API key invalid or missing", {
          error: error.message,
        });
        res.json({
          text: "Cấu hình API chưa đúng. Vui lòng liên hệ quản trị viên.",
        });
      } else if (
        error.message?.includes("SAFETY") ||
        error.message?.includes("blocked")
      ) {
        logger.warn("Gemini content blocked by safety filter");
        res.json({
          text: "Nội dung không thể hiển thị do vi phạm chính sách an toàn.",
        });
      } else if (
        error.message?.includes("quota") ||
        error.message?.includes("rate")
      ) {
        logger.warn("Gemini rate limit exceeded");
        res.json({
          text: "Hệ thống đang quá tải. Vui lòng thử lại sau vài phút.",
        });
      } else if (
        error.message?.includes("timeout") ||
        error.message?.includes("network")
      ) {
        logger.warn("Gemini network timeout", { error: error.message });
        res.json({ text: "Kết nối đến AI gặp sự cố. Vui lòng thử lại." });
      } else {
        logger.error("Gemini API error", { error: error.message });
        res.json({
          text: " Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau!",
        });
      }
    }
  },
};
