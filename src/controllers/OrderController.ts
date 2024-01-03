import { Response, Request } from 'express'
import OrderRepository from './../repositories/OrderRepository'
import { OrderService } from './../services/OrderService'

const createOrder = async (request: Request, response: Response) => {
  try {
    console.log('createOrder controller triggered')
    console.log('User ID from request:', request.userId)

    const { products, totalAmount, discount, status } = request.body
    const userId = request.userId

    if (userId === undefined) {
      return response.status(401).json({
        message: 'User ID not found in request',
      })
    }

    console.log(userId, 'userID')
    console.log(products, totalAmount, discount, status, 'Req.Body')

    const createOrderService = new OrderService(OrderRepository)
    const order = await createOrderService.execute(
      products,
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
