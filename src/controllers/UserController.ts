import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { prisma } from '../database'
import { UserRole } from '@prisma/client'
import { AppError, BadRequestError } from '../errors/AppError'
import { CreateUserDTO, UserTypes } from '../dtos/UserTypes'
import { UserService } from '../services/UserService'
import UserRepository from '../repositories/UserRepository'

const createUser = async (request: Request, response: Response) => {
  try {
    const userData: CreateUserDTO = request.body

    userData.role = userData.role || UserRole.CLIENT

    const data = new UserService(UserRepository)
    const user = await data.create(userData)

    const { password, isAdmin, phone, role, ...createdUserWithSucessed } = user

    return response.status(201).json({
      message: 'User created with success!',
      user: createdUserWithSucessed,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create user',
    })
  }
}

const getUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    const getUser = new UserService(UserRepository)
    const user = await getUser.findUserById(id)

    if (!user) {
      throw new AppError('User not exists!', 400)
    }

    const { password, isAdmin, ...userWithPassword } = user

    return response.status(200).json({
      message: 'User retrieved successfully!',
      user: userWithPassword,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to retrieve user',
    })
  }
}

const getUsers = async (request: Request, response: Response) => {
  try {
    const getUsers = new UserService(UserRepository)
    const users = await getUsers.findAllUsers()

    if (!users || users.length === 0) {
      return response.status(404).json({
        message: 'No user found.',
      })
    }

    const userWithoutPasswords = users.map((user) => {
      const { password, isAdmin, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return response.status(200).json({
      message: 'Users retrieved successfully!',
      users: userWithoutPasswords,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to retrieve users',
    })
  }
}

const updateUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { username, name, phone } = request.body

    if (
      !id ||
      !username ||
      !name ||
      !phone ||
      typeof id !== 'string' ||
      typeof username !== 'string' ||
      typeof name !== 'string' ||
      typeof phone !== 'string'
    ) {
      return response.status(400).json({
        message: 'Invalid or missing parameters: id, username, name, phone',
      })
    }

    const updateUserService = new UserService(UserRepository)
    await updateUserService.updateUserById(id, username, name, phone)

    return response.status(200).json({
      message: 'User updated successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Error updating user',
    })
  }
}

const updateAddress = async (request: Request, response: Response) => {
  try {
    const { email, address }: UserTypes = request.body

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!userExists) {
      throw new AppError('User not found', 404)
    }

    await prisma.address.update({
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

    return response.status(200).json({
      message: 'Address updated with success!',
    })
  } catch (error) {
    return response.status(400).json({
      message: 'Failed to update user',
    })
  }
}

const login = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body

    const getUser = new UserService(UserRepository)
    const user = await getUser.login(email, password)

    if (!user) {
      throw new BadRequestError('E-mail or password invalid')
    }

    const verifyPass = await bcrypt.compare(password, user.password)

    if (!verifyPass) {
      throw new BadRequestError('E-mail or password invalid')
    }

    const token = jwt.sign({ id: user.id }, process.env.CLIENT_SECRET ?? '', {
      expiresIn: '1d',
    })

    const { password: _, isAdmin, role, phone, ...userLogin } = user

    return response.status(200).json({
      user: userLogin,
      token,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'E-mail or password invalid',
    })
  }
}

const deleteUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    if (id === undefined || typeof id !== 'string') {
      return response.status(400).json({
        message: 'Invalid or missing parameter: id',
      })
    }

    const userService = new UserService(UserRepository)
    await userService.deleteUser(id)

    return response.status(200).json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error(`Failed to delete user with id ${request.params.id}: `, error)
    return response.status(400).json({
      message: 'Failed to delete user',
    })
  }
}

export default {
  createUser,
  getUser,
  getUsers,
  login,
  updateAddress,
  updateUser,
  deleteUser,
}
