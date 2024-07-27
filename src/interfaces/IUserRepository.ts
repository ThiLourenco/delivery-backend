import { UserRole } from '@prisma/client'
import { UserTypes } from '../dtos/UserTypes'

export interface IUserRepository {
  create(
    id: string,
    username: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    role: UserRole,
    address?: {
      street: string
      number?: string
      city: string
      country: string
      zipCode: string
    },
  ): Promise<UserTypes>

  getUser(id: string): Promise<UserTypes | null>

  getAllUsers(): Promise<UserTypes[]>

  login(email: string, password: string): Promise<UserTypes>

  update(
    id: string,
    username: string,
    name: string,
    phone: string,
  ): Promise<UserTypes>

  updateAddress(email: string, address: UserTypes['address']): Promise<UserTypes['address']>

  delete(id: string): Promise<void>
}
