export interface Feature {
  title: string
  description: string
}

export interface NavLink {
  href: string
  label: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface ApproachStep {
  step: string
  title: string
  desc: string
}

export interface GalleryImage {
  id: number
  label: string
}
