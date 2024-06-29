import { IOrderRepository } from '../interfaces/IOrderRepository'

class OrderService {
  constructor(private OrderRepository: IOrderRepository) {
    this.OrderRepository = OrderRepository
  }

  public async create(
    products: {
      productId: string
      quantity: number
    }[],
    userId: string,
    totalAmount: number,
    discount: number,
    status: string,
  ) {
    return await this.OrderRepository.createOrder(
      products,
      userId,
      totalAmount,
      discount,
      status,
    )
  }

  public async findOrder(userId: string) {
    const orders = await this.OrderRepository.findOrderByUser(userId)

    return orders
  }

  public async updateEndDate(deliveryManId: string, orderId: string) {
    return await this.OrderRepository.updateEndDate(deliveryManId, orderId)
  }

  public async getAllOrders() {
    return await this.OrderRepository.getAllOrdersAvailable()
  }

  public async getAllOrdersUnavailable() {
    return await this.OrderRepository.getAllOrdersUnavailable()
  }

  public async getAllOrdersCompleted() {
    return await this.OrderRepository.getAllOrdersCompleted()
  }
}

export { OrderService }
