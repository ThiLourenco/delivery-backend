import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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

    const { password, isAdmin, phone, role, createdAt, updatedAt, ...createdUserWithSucessed } = user
    
    return response.status(201).json({
      success: true,
      data: createdUserWithSucessed,
      message: 'User created with success!',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'User already exists',
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

    const { password: _, isAdmin, role, phone, createdAt, updatedAt, ...userLogin } = user

    return response.status(200).json({
      success: true,
      data: userLogin,
      token,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'E-mail or password invalid',
    })
  }
}

const getUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    const getUser = new UserService(UserRepository)
    const user = await getUser.findUserById(id)

    if (!user) {
      throw new AppError('User not exists', 400)
    }

    const { password, isAdmin, createdAt, updatedAt, ...userWithPassword } = user

    return response.status(200).json({
      success: true,
      data: userWithPassword,
      message: 'User retrieved successfully',
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
        message: 'No user found',
      })
    }

    const userWithoutPasswords = users.map((user) => {
      const { password, isAdmin, createdAt, updatedAt, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return response.status(200).json({
      success: true,
      data: userWithoutPasswords,
      message: 'Users retrieved successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Failed to retrieve users',
    })
  }
}

const updateUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { username, name, phone }: UserTypes = request.body

    if ( !id || !username || !name || !phone ) {
      return response.status(400).json({
        message: 'Invalid or missing parameters: id, username, name, phone',
      })
    }

    const updateUserService = new UserService(UserRepository)
    const updateUser = await updateUserService.updateUserById(id, username, name, phone)

    const { role, email, password, isAdmin, createdAt, updatedAt, ...UserData} = updateUser

    return response.status(200).json({
      success: true,
      data: UserData,
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

    const userService = new UserService(UserRepository)
    await userService.updateAddress(email, address)

    return response.status(200).json({
      success: true,
      message: 'Address updated or created successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to update or create address',
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
      success: true,
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
