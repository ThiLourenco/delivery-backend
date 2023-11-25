import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'

export default {
  async createUser(request: Request, response: Response) {
    try {
      const { name, email, phone, password } = request.body

      const userExist = await prisma.users.findUnique({
        where: {
          email,
        },
      })

      if (userExist) {
        throw new AppError('User already exists!')
      }

      const user = await prisma.users.create({
        data: {
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
      return response.status(400).json({
        message: 'Error: User already exists!',
      })
    }
  },
}
