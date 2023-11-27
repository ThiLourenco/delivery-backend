import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { UserTypes } from '../types/UserTypes'
import { CreateUserService } from '../service/CreateUserService'
import UserRepository from '../repositories/UserRepository'

export default {
  async createUser(request: Request, response: Response) {
    try {
      const { id, username, name, email, phone, password } = request.body

      const newUser = new CreateUserService(UserRepository)
      const user = await newUser.execute(
        id,
        username,
        name,
        email,
        password,
        phone,
      )

      // If the user was created successfully, create the associated address
      // if (user) {
      //   const createdAddress = await prisma.address.create({
      //     data: {
      //       street: address?.street,
      //       number: address?.number,
      //       city: address?.city,
      //       state: address?.state,
      //       zipCode: address?.zipCode,
      //       userId: user.id,
      //     },
      //   })

      // if (user && createdAddress) {
      //   return response.status(201).json({
      //     message: 'User create and Address with success!',
      //     user,
      //     createdAddress,
      //   })
      // }

      if (user) {
        return response.status(201).json({
          message: 'User create with success!',
          user,
        })
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
      const users = await prisma.user.findMany({
        include: {
          address: true,
        },
      })

      if (!users || users.length === 0) {
        return response.status(404).json({
          message: 'No users found.',
        })
      }

      if (users) {
        return response.status(200).json({
          message: 'Users retrieved successfully!',
          users,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to retrieve users',
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
          message: 'User retrieved successfully!',
          user,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to retrieve user',
      })
    }
  },
  async updateAddress(request: Request, response: Response) {
    try {
      const { email, address }: UserTypes = request.body

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
