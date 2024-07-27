import { prisma } from '../database'
import { UserRole } from '@prisma/client';
import { AppError, BadRequestError } from '../errors/AppError'
import { IUserRepository } from '../interfaces/IUserRepository'
import { UserTypes, UserWithAddress } from '../dtos/UserTypes'
import { compare, hash } from 'bcrypt'
import { createUserSchema, loginUserSchema, updateUserSchema } from '../../prisma/schemas/userSchema'
import { z } from 'zod';

class UserRepository implements IUserRepository {
  public async create(
    id: string,
    username: string,
    name: string,
    email: string,
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
  ): Promise<UserTypes> {
    try {
      const validateData = createUserSchema.parse({
        id,
        username,
        name,
        email,
        password,
        phone,
        role,
        address,
      })

      const userExist = await prisma.user.findUnique({
        where: {
          email: validateData.email,
        },
      })

      if (userExist) {
        throw new AppError('User already exists!')
      }

      const hashPassword = await hash(validateData.password, 10)

      const user = await prisma.user.create({
        data: {
          ...validateData,
          password: hashPassword,
          address: validateData.address ? {
            create: validateData.address,
          }: undefined
        },
      })

      return user;
    } catch (error) {

      if(error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new BadRequestError('Validation error')
      }

      throw new AppError('Failed to create user', 400)
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
        throw new AppError('User not found')
      }
      
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        password: user.password,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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

  public async getAllUsers(): Promise<UserTypes[]> {
    try {
      const users = await prisma.user.findMany()

      if (!users) {
        throw new AppError('Failed to retrieve users.', 400)
      }

      return users
    } catch (error) {
      console.error(error)
      throw new AppError('Failed to retrieve users.')
    }
  }

  public async login(email: string, password: string): Promise<UserTypes> {
    try {
      const validateData = loginUserSchema.parse({
        email,
        password,
      })

      const user = await prisma.user.findUnique({
        where: {
          email: validateData.email,
        },
      })

      if (!user) {
        throw new BadRequestError('E-mail or password invalid')
      }

      const passwordMatch = await compare(validateData.password, user.password)

      if (!passwordMatch) {
        throw new BadRequestError('E-mail or password invalid')
      }

      return user;

    } catch (error) {
      if(error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new BadRequestError('Validation error')
      }

      throw new BadRequestError('E-mail or password invalid')
    }
  }

  public async update(
    id: string,
    username: string,
    name: string,
    phone: string,
  ): Promise<UserTypes> {
    try {
      const validateData = updateUserSchema.parse({
        id,
        username,
        name,
        phone,
      })

      const userExists = await prisma.user.findUnique({
        where: {
          id: validateData.id,
        },
      })

      if (!userExists) {
        throw new AppError('User not exists', 400)
      }

      const updatedUser = await prisma.user.update({
        data: {
          username: validateData.username,
          name: validateData.name,
          phone: validateData.phone,
          updatedAt: new Date(),
        },
        where: {
          id: validateData.id,
        },
      })

      return updatedUser;

    } catch (error) {
      if(error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new BadRequestError('Validation error')
      }
      throw new AppError('Failed to update user', 400)
    }
  }

  public async updateAddress(email: string, address: UserTypes['address']): Promise<UserTypes['address']>  {
    try {
      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      })
  
      if (!userExists) {
        throw new AppError('User not found', 404)
      }
  
      const addressExists = await prisma.address.findUnique({
        where: {
          userId: userExists.id,
        },
      })

      let updatedAddress;
  
      if (addressExists) {
        updatedAddress = await prisma.address.update({
          where: {
            userId: userExists.id,
          },
          data: {
            street: address?.street,
            number: address?.number,
            city: address?.city,
            country: address?.country,
            zipCode: address?.zipCode,
          },
        })
      } else {
        updatedAddress = await prisma.address.create({
          data: {
            userId: userExists.id,
            street: address?.street,
            number: address?.number,
            city: address?.city,
            country: address?.country,
            zipCode: address?.zipCode,
          },
        })
      }
      return {
        street: updatedAddress.street!,
        number: updatedAddress.number!,
        city: updatedAddress.city!,
        country: updatedAddress.country!,
        zipCode: updatedAddress.zipCode!,
      };

    } catch (error) {
      console.error(error)
      throw new AppError('Failed to update or create address', 400)
    }
  }
  
  public async delete(id: string): Promise<void> {
    try {
      const userExists = await prisma.user.findUnique({
        where: { id },
      })

      if (!userExists) {
        console.log(`User with id ${id} does not exist`)
        throw new AppError('User does not exist', 400)
      }

      await prisma.orderProduct.deleteMany({
        where: {
          order: {
            userId: id,
          },
        },
      })

      await prisma.order.deleteMany({
        where: { userId: id },
      })

      await prisma.address.deleteMany({
        where: { userId: id },
      })

      await prisma.user.delete({
        where: { id },
      })

      console.log(`User with id ${id} deleted successfully`)
    } catch (error) {
      console.error(`Error deleting user with id ${id}: `, error)
      throw new AppError('Failed to delete user', 500)
    }
  }
}

export default new UserRepository()
