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
          status: 'Em preparo',
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

  public async updateEndDate(
    deliveryManId: string,
    orderId: string,
  ): Promise<OrderTypes> {
    try {
      const deliveryManExists = await prisma.user.findUnique({
        where: {
          id: deliveryManId,
        },
      })

      if (!deliveryManExists) {
        throw new AppError('DeliveryMan not exists', 400)
      }

      const updateDeliveryMan = await prisma.order.update({
        where: {
          link_delivery_deliveryman: {
            deliveryManId,
            id: orderId,
          },
        },
        data: {
          status: 'Pedido Entregue',
          endAt: new Date(),
        },
        include: {
          products: true,
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

  public async getAllOrdersAvailable(): Promise<OrderTypes[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          deliveryManId: null,
          endAt: null,
        },
        include: {
          products: true,
        },
        orderBy: {
          createdAt: 'asc',
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
