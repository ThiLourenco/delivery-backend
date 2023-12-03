import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { UserTypes } from '../dtos/UserTypes'
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
  async getUser(request: Request, response: Response) {
    try {
      const { id } = request.params

      const getUser = new CreateUserService(UserRepository)
      const user = await getUser.findUserById(id)
      if (!user) {
        throw new AppError('User not exist!')
      }

      if (user) {
        return response.status(200).json({
          message: 'User retrieved successfully!',
          user,
        })
      }
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to retrieve user',
      })
    }
  },
  async getUsers(request: Request, response: Response) {
    try {
      const getUsers = new CreateUserService(UserRepository)
      const users = await getUsers.findAllUsers()

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
