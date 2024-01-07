import { UserRole } from '@prisma/client'
import { DeliveryManTypes } from '../dtos/DeliveryManTypes'

export interface IDeliveryManRepository {
  createDeliveryMan(
    name: string,
    email: string,
    username: string,
    password: string,
    phone: string,
    role: UserRole,
    address?: {
      street: string
      number?: string
      city: string
      country: string
      zipCode: string
    },
  ): Promise<DeliveryManTypes>

  updateDeliveryMan(
    id: string,
    name: string,
    phone: string,
  ): Promise<DeliveryManTypes>

  loginDeliveryMan(email: string, password: string): Promise<DeliveryManTypes>
}
