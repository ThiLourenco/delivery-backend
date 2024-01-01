import { Response, Request } from 'express'
import OrderRepository from './../repositories/OrderRepository'
import { OrderService } from './../services/OrderService'

const createOrder = async (request: Request, response: Response) => {
  try {
    const { productId, totalAmount, discount, status } = request.body
    const { userId } = request

    console.log(userId, 'userID')
    console.log(productId, totalAmount, discount, status, 'Req.Body')

    const createOrderService = new OrderService(OrderRepository)
    const order = await createOrderService.execute(
      productId,
      userId,
      totalAmount,
      discount,
      status,
    )

    return response.status(201).json({
      message: 'Orders created with success!',
      order,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create orders',
    })
  }
}

export default { createOrder }
