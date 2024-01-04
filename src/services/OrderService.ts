import { IOrderRepository } from '../interfaces/IOrderRepository'

class OrderService {
  constructor(private OrderRepository: IOrderRepository) {
    this.OrderRepository = OrderRepository
  }

  public async execute(
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
}

export { OrderService }
