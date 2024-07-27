import { UserRole } from '@prisma/client'

export type UserTypes = {
  id: string
  username: string
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
  isAdmin: boolean
  createdAt: Date,
  updatedAt: Date,
  address?: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}

export type UserWithAddress = {
  id: string
  username: string
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
  isAdmin: boolean
  createdAt: Date,
  updatedAt: Date,
  address: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}

export interface CreateUserDTO {
  id: string
  username: string
  name: string
  email: string
  password: string
  role: UserRole
  phone: string
  address?: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}
