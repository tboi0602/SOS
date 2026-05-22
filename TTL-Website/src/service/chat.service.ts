import { request } from "./client"

export const chatService = {
  send(messages: { role: string; text: string }[]) {
    return request<{ text: string }>("/api/v1/chat", {
      method: "POST",
      body: { messages },
    })
  },
}
