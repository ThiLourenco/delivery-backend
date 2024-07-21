import { UserRole } from '@prisma/client'

export type DeliveryManTypes = {
  id?: string
  name: string
  username: string
  email: string
  password: string
  phone: string
  isAdmin: Boolean
  role: UserRole
  createdAt: Date
  updatedAt: Date
  address?: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}
