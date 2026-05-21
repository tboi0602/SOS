import type { ContactFormData } from "@/types/landing"

export async function submitContact(data: ContactFormData): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  console.log("Contact form submitted:", data)
  return { success: true }
}
