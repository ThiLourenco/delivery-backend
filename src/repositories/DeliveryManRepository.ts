import { hash } from 'bcrypt'
import { UserRole } from '@prisma/client'
import { prisma } from './../database'
import { DeliveryManTypes } from '../dtos/DeliveryManTypes'
import { AppError } from '../errors/AppError'
import { IDeliveryManRepository } from '../interfaces/IDeliveryManRepository'

class DeliveryManRepository implements IDeliveryManRepository {
  public async createDeliveryMan(
    name: string,
    email: string,
    username: string,
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
  ): Promise<DeliveryManTypes> {
    try {
      const deliveryManExists = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (deliveryManExists) {
        throw new AppError('DeliveryMan already exists', 400)
      }

      const hashPassword = await hash(password, 10)

      const deliveryMan = await prisma.user.create({
        data: {
          name,
          email,
          username,
          password: hashPassword,
          phone,
          role,
          address: {
            create: {
              street: address?.street,
              country: address?.country,
              number: address?.number,
              city: address?.city,
              zipCode: address?.zipCode,
            },
          },
        },
      })

      return deliveryMan
    } catch (error) {
      console.error(error)
      throw new AppError('Failed to create deliveryMan', 500)
    }
  }
}

export default new DeliveryManRepository()
