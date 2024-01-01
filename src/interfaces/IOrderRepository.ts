import { OrderTypes } from 'dtos/OrderTypes'

export interface IOrderRepository {
  createOrder(
    productId: string,
    userId: string,
    totalAmount: number,
    discount: number,
    status: string,
  ): Promise<OrderTypes>
}
