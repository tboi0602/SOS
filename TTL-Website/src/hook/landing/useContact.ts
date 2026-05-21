"use client"

import { useState } from "react"
import type { ContactFormData } from "@/types/landing"
import { submitContact } from "@/service/contact.service"

const initialForm: ContactFormData = { name: "", email: "", phone: "", message: "" }

export function useContact() {
  const [form, setForm] = useState<ContactFormData>(initialForm)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const updateField = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setStatus("loading")
    try {
      await submitContact(form)
      setStatus("success")
      setForm(initialForm)
    } catch {
      setStatus("error")
    }
  }

  return { form, status, updateField, handleSubmit }
}
