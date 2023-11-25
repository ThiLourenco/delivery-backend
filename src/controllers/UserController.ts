import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'

export default {
  async createUser(request: Request, response: Response) {
    try {
      const { username, name, email, phone, password } = request.body

      const userExist = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (userExist) {
        throw new AppError('User already exists!')
      }

      const user = await prisma.user.create({
        data: {
          username,
          name,
          email,
          phone,
          password,
        },
      })

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
}
