import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'

export default {
  async createUser(request: Request, response: Response) {
    try {
      const { name, email, phone, password } = request.body

      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userExist) {
        throw new AppError('User already exists!')
      }

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password,
        },
      })

      return response.json({
        error: false,
        message: 'User create with success!',
        status: 201,
        user: newUser,
      })
    } catch (error) {
      console.error('Error creating user:', error)

      return response.status(400).json({
        error: true,
        message:
          error instanceof AppError ? error.message : 'Failed to create user.',
        status: 400,
      })
    }
  },
}
