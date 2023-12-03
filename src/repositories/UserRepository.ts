import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { IUserRepository } from '../interfaces/IUserRepository'
import { UserTypes } from '../dtos/UserTypes'

class UserRepository implements IUserRepository {
  public async createUser(
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

  public async getUser(id: string): Promise<UserTypes | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        // include: {
        //   address: true,
        // },
      })

      if (!user) {
        throw new AppError('User not exists!')
      }

      return user
    } catch (error) {
      console.error(error)
      throw new AppError('Failed to retrieve user')
    }
  }

  public async getUsers(): Promise<UserTypes[]> {
    try {
      const users = await prisma.user.findMany({
        include: {
          // address: true,
        },
      })

      if (!users || users.length === 0) {
        throw new AppError('Failed to retrieve users.')
      }

      return users
    } catch (error) {
      console.error(error)
      throw new AppError('No users found.')
    }
  }
}

export default new UserRepository()
