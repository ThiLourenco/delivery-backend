export type UserTypes = {
  id?: string
  username: string
  name: string
  email: string
  phone: string
  password: string
  address?: {
    street: string
    number?: string
    city: string
    state: string
    zipCode: string
    userId: string
  }
}