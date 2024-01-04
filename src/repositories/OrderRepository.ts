import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { IOrderRepository } from '../interfaces/IOrderRepository'
import { OrderTypes } from '../dtos/OrderTypes'

class OrderRepository implements IOrderRepository {
  public async createOrder(
    products: {
      productId: string
      quantity: number
    }[],
    userId: string,
    totalAmount: number,
    discount: number,
    status: string,
  ): Promise<OrderTypes> {
    try {
      // verify that the product exists
      const productIds = products.map((product) => product.productId)
      const productExists = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      })

      if (productExists.length !== productIds.length) {
        throw new AppError('Product not exist', 400)
      }

      const order = await prisma.order.create({
        data: {
          userId,
          totalAmount,
          discount,
          status,
          products: {
            create: products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          },
        },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      })

      return order
    } catch (error) {
      console.error(error)

      throw new AppError('Failed to create order', 400)
    }
  }

  public async findOrderByUser(userId: string): Promise<OrderTypes[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          products: true,
        },
      })

      if (!orders || orders.length === 0) {
        throw new AppError('Orders is empty')
      }
      return orders
    } catch (error) {
      console.log(error)
      throw new AppError('Orders not found')
    }
  }
}

export default new OrderRepository()
