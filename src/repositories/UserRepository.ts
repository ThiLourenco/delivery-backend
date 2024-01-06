import { prisma } from '../database'
import { AppError, BadRequestError } from '../errors/AppError'
import { IUserRepository } from '../interfaces/IUserRepository'
import { UserTypes, UserWithAddress } from '../dtos/UserTypes'
import { compare, hash } from 'bcrypt'

class UserRepository implements IUserRepository {
  public async createUser(
    id: string,
    username: string,
    name: string,
    email: string,
    password: string,
    phone: string,
    address?: {
      street: string
      number?: string
      city: string
      country: string
      zipCode: string
    },
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

      const hashPassword = await hash(password, 10)

      const user = await prisma.user.create({
        data: {
          id,
          username,
          name,
          email,
          phone,
          password: hashPassword,
          address: {
            create: {
              street: address?.street,
              country: address?.country,
              number: address?.number,
              city: address?.city,
              zipCode: address?.zipCode,
            },
          },
        },
      })

      return user
    } catch (error) {
      throw new AppError('Failed to create user', 500)
    }
  }

  public async getUser(id: string): Promise<UserWithAddress> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        include: {
          address: true,
        },
      })

      if (!user) {
        throw new AppError('User not exists!')
      }

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        address: {
          city: user.address?.city || '',
          country: user.address?.country || '',
          street: user.address?.street || '',
          zipCode: user.address?.zipCode || '',
          number: user.address?.number || '',
        },
      }
    } catch (error) {
      console.error(error)
      throw new AppError('Failed to retrieve user')
    }
  }

  public async getUsers(): Promise<UserTypes[]> {
    try {
      const users = await prisma.user.findMany()

      if (!users || users.length === 0) {
        throw new AppError('Failed to retrieve users.')
      }

      return users
    } catch (error) {
      console.error(error)
      throw new AppError('No users found.')
    }
  }

  public async login(email: string, password: string): Promise<UserTypes> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        throw new BadRequestError('E-mail or password invalid')
      }

      const passwordMatch = await compare(password, user.password)

      if (!passwordMatch) {
        throw new BadRequestError('E-mail or password invalid')
      }

      return user
    } catch (erro) {
      throw new AppError('Failed to login', 400)
    }
  }

  public async updateUser(
    id: string,
    username: string,
    name: string,
    phone: string,
  ): Promise<UserTypes> {
    try {
      const userExists = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (!userExists) {
        throw new AppError('User not exists', 400)
      }

      const updatedUser = await prisma.user.update({
        data: {
          username,
          name,
          phone,
          updatedAt: new Date(),
        },
        where: {
          id,
        },
      })

      return updatedUser
    } catch (error) {
      throw new AppError(
        'Error to update user, verify all fields are valid !',
        400,
      )
    }
  }
}

export default new UserRepository()
