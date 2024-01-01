import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { IOrderRepository } from '../interfaces/IOrderRepository'
import { OrderTypes } from '../dtos/OrderTypes'

class OrderRepository implements IOrderRepository {
  public async createOrder(
    productId: string,
    userId: string,
    totalAmount: number,
    discount: number,
    status: string,
  ): Promise<OrderTypes> {
    try {
      const order = await prisma.order.create({
        data: {
          productId,
          userId,
          totalAmount,
          discount,
          status,
        },
        include: {
          product: true,
        },
      })

      return order
    } catch (error) {
      console.error(error)

      throw new AppError('Failed to create order', 400)
    }
  }
}

export default new OrderRepository()
