import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { IUserRepository } from '../interfaces/IUserRepository'
import { UserTypes } from '../types/UserTypes'

class UserRepository implements IUserRepository {
  public async create(
    id: string,
    username: string,
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<UserTypes> {
    try {
      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userExist) {
        throw new AppError('User already exists!')
      }
      const userData = {
        id,
        username,
        name,
        email,
        phone,
        password,
      }

      const user = await prisma.user.create({
        data: userData,
      })

      return user
    } catch (error) {
      throw new AppError('Failed to create user', 500)
    }
  }
}

export default new UserRepository()
