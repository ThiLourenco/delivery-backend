export type UserTypes = {
  id?: string
  username: string
  name: string
  email: string
  phone: string
  password: string
  isAdmin: boolean
  address?: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}

export type UserWithAddress = {
  id?: string
  username: string
  name: string
  email: string
  phone: string
  password: string
  isAdmin: boolean
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
  phone: string
  address?: {
    street: string
    number?: string
    city: string
    country: string
    zipCode: string
  }
}
