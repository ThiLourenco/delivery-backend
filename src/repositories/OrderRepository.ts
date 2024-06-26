import { prisma } from '../database'
import { AppError, BadRequestError } from '../errors/AppError'
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

      return order as OrderTypes
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

  public async getAllOrdersUnavailable(): Promise<OrderTypes[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          NOT: {
            deliveryManId: null,
          },
          AND: {
            status: 'Em rota de entrega',
          },
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

  public async getAllOrdersCompleted(): Promise<OrderTypes[]> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          NOT: {
            deliveryManId: null,
          },
          AND: {
            status: 'Pedido Entregue',
          },
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

  public async getOrderById(id: string): Promise<OrderTypes[]> {
    try {
      const order = await prisma.order.findMany({
        where: {
          id,
        },
        include: {
          products: true,
        },
      })

      if (!order) {
        throw new BadRequestError('Order not found')
      }

      return order
    } catch (error) {
      console.error(error)
      throw new AppError('Failed to get order')
    }
  }
}

export default new OrderRepository()
