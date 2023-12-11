import { UserTypes } from '../dtos/UserTypes'

export interface IUserRepository {
  createUser(
    id: string,
    username: string,
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<UserTypes>
  getUser(id: string): Promise<UserTypes | null>
  getByEmail(email: string): Promise<UserTypes | null>
  getUsers(): Promise<UserTypes[]>
  login(email: string, password: string): Promise<UserTypes>
}
