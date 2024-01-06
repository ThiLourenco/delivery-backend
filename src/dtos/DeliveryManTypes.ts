import { UserRole } from '@prisma/client'

export type DeliveryManTypes = {
  id: string
  name: string
  username: string
  email: string
  password: string
  phone: string
  role: UserRole
  address?: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}
