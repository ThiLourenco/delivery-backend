import { IOrderRepository } from '../interfaces/IOrderRepository'

class OrderService {
  constructor(private OrderRepository: IOrderRepository) {
    this.OrderRepository = OrderRepository
  }

  public async execute(
    productId: string,
    userId: string,
    totalAmount: number,
    discount: number,
    status: string,
  ) {
    return await this.OrderRepository.createOrder(
      productId,
      userId,
      totalAmount,
      discount,
      status,
    )
  }
}

export { OrderService }
