import { hash, compare } from 'bcrypt'
import { UserRole } from '@prisma/client'
import { prisma } from './../database'
import { DeliveryManTypes } from '../dtos/DeliveryManTypes'
import { AppError, BadRequestError } from '../errors/AppError'
import { IDeliveryManRepository } from '../interfaces/IDeliveryManRepository'
import { OrderTypes } from 'dtos/OrderTypes'

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

  public async updateDeliveryMan(
    id: string,
    name: string,
    phone: string,
  ): Promise<DeliveryManTypes> {
    try {
      const deliveryManExists = await prisma.user.findUnique({
        where: {
          id,
          role: 'DELIVERY_MAN',
        },
      })

      if (!deliveryManExists) {
        throw new AppError('DeliveryMan not exists', 400)
      }

      const updateDeliveryMan = await prisma.user.update({
        data: {
          name,
          phone,
          updatedAt: new Date(),
        },
        where: {
          id: deliveryManExists.id,
          role: (deliveryManExists.role = 'DELIVERY_MAN'),
        },
      })
      return updateDeliveryMan
    } catch (error) {
      throw new AppError(
        'Error to update user, verify all fields are valid !',
        400,
      )
    }
  }

  public async loginDeliveryMan(
    email: string,
    password: string,
  ): Promise<DeliveryManTypes> {
    try {
      const deliveryManUser = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!deliveryManUser) {
        throw new BadRequestError('E-mail or password invalid')
      }

      const passwordMatch = await compare(password, deliveryManUser.password)

      if (!passwordMatch) {
        throw new BadRequestError('E-mail or password incorrect')
      }

      return deliveryManUser
    } catch (error) {
      throw new AppError('Failed to login', 400)
    }
  }

  public async updateOrderDeliveryMan(
    deliveryManId: string,
    orderId: string,
  ): Promise<DeliveryManTypes | OrderTypes> {
    try {
      const orderExists = await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      })

      if (!orderExists) {
        throw new AppError('Order not exists', 400)
      }

      const updateOrderDeliveryMan = await prisma.order.update({
        data: {
          deliveryManId,
          status: 'Em rota de entrega',
        },
        where: {
          id: orderId,
        },
        include: {
          products: true,
        },
      })

      return updateOrderDeliveryMan
    } catch (error) {
      throw new AppError(
        'Error to update order, verify all fields are valid !',
        500,
      )
    }
  }

  public async getOrdersDeliveryMan(
    deliveryManId: string,
  ): Promise<DeliveryManTypes | OrderTypes[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          deliveryManId,
        },
        include: {
          _count: true,
          products: true,
        },
      })

      if (!orders || orders.length === 0) {
        throw new AppError('Orders is empty')
      }

      return orders
    } catch (error) {
      console.log(error)
      throw new AppError('Not found orders for deliveryManId: ')
    }
  }
}

export default new DeliveryManRepository()
