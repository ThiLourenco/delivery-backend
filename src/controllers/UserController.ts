import { Request, Response } from 'express'
import { AppError, BadRequestError } from '../errors/AppError'
import { UserTypes } from '../dtos/UserTypes'
import { UserService } from '../services/UserService'
import UserRepository from '../repositories/UserRepository'
import { prisma } from '../database'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const createUser = async (request: Request, response: Response) => {
  try {
    const { id, username, name, email, phone, password } = request.body

    const newUser = new UserService(UserRepository)
    const user = await newUser.execute(
      id,
      username,
      name,
      email,
      password,
      phone,
    )

    return response.status(201).json({
      message: 'User created with success!',
      user,
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
      throw new AppError('User not exist!', 404)
    }

    return response.status(200).json({
      message: 'User retrieved successfully!',
      user,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to retrieve user',
    })
  }
}

const getUserByEmail = async (request: Request, response: Response) => {
  // try {
  //   const { email } = request.body
  //   const getEmail = new UserService(UserRepository)
  //   const user = await getEmail.findUserByEmail(email)
  //   if (!user) {
  //     throw new AppError('Email not exists!')
  //   }
  //   return response.status(200).json({
  //     message: 'User retrieved successfully!',
  //     user,
  //   })
  // } catch (error) {
  //   console.error(error)
  //   return response.status(400).json({
  //     message: 'Failed to retrieve user',
  //   })
  // }
}

const getUsers = async (request: Request, response: Response) => {
  try {
    const getUsers = new UserService(UserRepository)
    const users = await getUsers.findAllUsers()

    if (!users || users.length === 0) {
      return response.status(404).json({
        message: 'No users found.',
      })
    }

    return response.status(200).json({
      message: 'Users retrieved successfully!',
      users,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to retrieve users',
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

    // Update address data
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

    return response.status(200).json({
      message: 'Address updated with success!',
      updateUser,
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

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
      expiresIn: '4h',
    })

    const { password: _, ...userLogin } = user

    return response.status(200).json({
      user: userLogin,
      token,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to login',
    })
  }
}

export default {
  createUser,
  getUser,
  getUsers,
  updateAddress,
  login,
  getUserByEmail,
}
