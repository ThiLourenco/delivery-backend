import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { UserCreateInput } from '../types/UserCreateInput'

export default {
  async createUser(request: Request, response: Response) {
    try {
      const {
        username,
        name,
        email,
        phone,
        password,
        address,
      }: UserCreateInput = request.body

      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userExist) {
        throw new AppError('User already exists!')
      }

      // create the user first
      const createdUser = await prisma.user.create({
        data: {
          username,
          name,
          email,
          phone,
          password,
        },
      })

      // If the user was created successfully, create the associated address
      if (createdUser) {
        const createdAddress = await prisma.address.create({
          data: {
            street: address?.street,
            number: address?.number,
            city: address?.city,
            state: address?.state,
            zipCode: address?.zipCode,
            userId: createdUser.id,
          },
        })

        if (createdUser && createdAddress) {
          return response.status(201).json({
            message: 'User create and Address with success!',
            createdUser,
            createdAddress,
          })
        }
        if (createdUser) {
          return response.status(201).json({
            message: 'User create with success!',
            createdUser,
          })
        }
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to create user',
      })
    }
  },
  async getUsers(request: Request, response: Response) {
    try {
      const userExists = await prisma.user.findMany({
        include: {
          address: true,
        },
      })

      if (userExists) {
        return response.status(200).json({
          message: 'Users get with success!',
          userExists,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to get all user',
      })
    }
  },
  async getUser(request: Request, response: Response) {
    try {
      const { id } = request.params

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

      if (user) {
        return response.status(200).json({
          message: 'User get with success!',
          user,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to get user',
      })
    }
  },
  async updateAddress(request: Request, response: Response) {
    try {
      const { email, address }: UserCreateInput = request.body

      const userExists = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userExists) {
        throw new AppError('User not found')
      }

      // update address data
      const updateUser = await prisma.address.update({
        where: {
          userId: userExists.id,
        },
        data: {
          street: address?.street,
          number: address?.number,
          city: address?.city,
          state: address?.state,
          zipCode: address?.zipCode,
        },
      })

      if (updateUser) {
        return response.status(200).json({
          message: 'Address updated with success!',
          updateUser,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to update user',
      })
    }
  },
}
