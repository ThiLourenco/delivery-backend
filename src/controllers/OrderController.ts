import { Response, Request } from 'express'
import OrderRepository from './../repositories/OrderRepository'
import { OrderService } from './../services/OrderService'
import { BadRequestError } from '../errors/AppError'

const createOrder = async (request: Request, response: Response) => {
  try {
    // console.log('createOrder controller triggered')
    // console.log('User ID from request:', request.userId)

    const { products, totalAmount, discount, status } = request.body
    const userId = request.userId

    if (!userId || userId === undefined) {
      throw new BadRequestError('Invalid token received')
    }

    // console.log(userId, 'userID')

    const createOrderService = new OrderService(OrderRepository)
    await createOrderService.create(
      products,
      userId,
      totalAmount,
      discount,
      status,
    )

    return response.status(201).json({
      message: 'Orders created with success!',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create orders',
    })
  }
}

const getOrderByUser = async (request: Request, response: Response) => {
  try {
    // console.log('User ID from request: ' + request.userId)

    const userId = request.userId

    if (userId === undefined) {
      return response.status(401).json({
        message: 'User ID not specified in request',
      })
    }
    // console.log(userId, 'userId')

    const getOrderByUserId = new OrderService(OrderRepository)
    const order = await getOrderByUserId.findOrder(userId)

    return response.status(200).json({
      message: 'get Orders with success!',
      order,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to get order',
    })
  }
}

const getAllOrdersAvailable = async (request: Request, response: Response) => {
  try {
    const getAllOrders = new OrderService(OrderRepository)
    const ordersAvailable = await getAllOrders.getAllOrders()

    return response.status(200).json({
      message: 'get Orders with success!',
      ordersAvailable,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create orders',
    })
  }
}

const getAllOrdersUnavailable = async (
  request: Request,
  response: Response,
) => {
  try {
    const getAllOrders = new OrderService(OrderRepository)
    const ordersUnavailable = await getAllOrders.getAllOrdersUnavailable()

    return response.status(200).json({
      message: 'get Orders with success!',
      ordersUnavailable,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to get orders unavailable!',
    })
  }
}

const getAllOrdersCompleted = async (request: Request, response: Response) => {
  try {
    const getAllOrders = new OrderService(OrderRepository)
    const ordersUnavailable = await getAllOrders.getAllOrdersCompleted()

    return response.status(200).json({
      message: 'get Orders with success!',
      ordersUnavailable,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to received orders completed',
    })
  }
}

const deliveredOrder = async (request: Request, response: Response) => {
  try {
    // console.log('User ID from request:', request.deliveryManId)

    const deliveryManId = request.deliveryManId
    const { id: orderId } = request.params

    // console.log('Order ID:', orderId)
    if (deliveryManId === undefined) {
      return response.status(401).json({
        message: 'DeliveryMan ID not found in request',
      })
    }

    const updateEndDateService = new OrderService(OrderRepository)
    const order = await updateEndDateService.updateEndDate(
      deliveryManId,
      orderId,
    )

    return response.status(200).json({
      message: 'Updated EndDate Order with successfully',
      order,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to update order, verify available order',
    })
  }
}

const getOrderById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    const orderService = new OrderService(OrderRepository)
    const order = await orderService.getOrderById(id)

    return response.status(200).json({
      message: 'get order with success!',
      order,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create orders',
    })
  }
}

export default {
  createOrder,
  getOrderByUser,
  deliveredOrder,
  getAllOrdersAvailable,
  getAllOrdersUnavailable,
  getAllOrdersCompleted,
  getOrderById,
}
