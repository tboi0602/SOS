import { api } from "@/service/api"

export const chatService = {
  send(messages: { role: string; text: string }[]) {
    return api.chat.send(messages)
  },
}
