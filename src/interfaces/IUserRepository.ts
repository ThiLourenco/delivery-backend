import { UserTypes } from '../types/UserTypes'

export interface IUserRepository {
  create(
    id: string,
    username: string,
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<UserTypes>
}
