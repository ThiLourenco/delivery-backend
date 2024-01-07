import { OrderTypes } from 'dtos/OrderTypes'

export interface IOrderRepository {
  createOrder(
    products: {
      productId: string
      quantity: number
    }[],
    userId: string,
    totalAmount: number,
    discount: number,
    status: string,
  ): Promise<OrderTypes>

  findOrderByUser(userId: string): Promise<OrderTypes[]>

  updateEndDate(deliveryManId: string, id: string): Promise<OrderTypes>

  getAllOrdersAvailable(): Promise<OrderTypes[]>
}
