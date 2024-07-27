import { Response, Request } from 'express'
import OrderRepository from './../repositories/OrderRepository'
import { OrderService } from './../services/OrderService'
import { BadRequestError } from '../errors/AppError'
import { OrderTypes } from 'dtos/OrderTypes'

const createOrder = async (request: Request, response: Response) => {
  try {
    // console.log('createOrder controller triggered')
    // console.log('User ID from request:', request.userId)
    const { products, totalAmount, discount, status }: OrderTypes = request.body
    const userId = request.userId

    if (!userId || userId === undefined) {
      throw new BadRequestError('Invalid token received')
    }
    // console.log(userId, 'userID')
    const createOrderService = new OrderService(OrderRepository)
    const order = await createOrderService.create(
      products,
      userId,
      totalAmount,
      discount!,
      status,
    )

    const { id } = order

    return response.status(201).json({
      message: 'Orders created with success!',
      id,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create orders',
    })
  }
}

const getOrderByUserWithoutProducts = async (request: Request, response: Response) => {
  try {
    const userId = request.userId

    if (userId === undefined) {
      return response.status(401).json({
        message: 'User ID not specified in request',
      })
    }

    const getOrderByUserId = new OrderService(OrderRepository)
    const orders = await getOrderByUserId.findOrder(userId)

    if(!orders || orders.length === 0) {
      return response.status(404).json({
        message: 'No orders found for this user',
      })
    }

    const orderData = orders.map((order) => {
      const { products, userId, ...orderData } = order
      return orderData
    })

    return response.status(200).json({
      orders: orderData,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Failed to get order',
    })
  }
}

const getOrderByUserWihProducts = async (request: Request, response: Response) => {
  try {
    const userId = request.userId

    if (userId === undefined) {
      return response.status(401).json({
        message: 'User ID not specified in request',
      })
    }

    const getOrderByUserId = new OrderService(OrderRepository)
    const orders = await getOrderByUserId.findOrder(userId)

    if(!orders || orders.length === 0) {
      return response.status(404).json({
        message: 'No orders found for this user',
      })
    }

    const orderData = orders.map((order) => {
      const { userId, ...orderData } = order
      return orderData
    })

    return response.status(200).json({
      orders: orderData,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Failed to get order',
    })
  }
}

const getAllOrdersAvailable = async (request: Request, response: Response) => {
  try {
    const getAllOrders = new OrderService(OrderRepository)
    const ordersAvailable = await getAllOrders.getAllOrders()

    const orderData = ordersAvailable.map((order) => {
      const { products, ...orderData } = order
      return orderData
    })

    if(!orderData || orderData.length === 0) {
      return response.status(404).json({
        message: 'No Order Available',
      })
    }

    return response.status(200).json({
      orders: orderData,
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

    const orderData = ordersUnavailable.map((order) => {
      const { products, ...orderData } = order
      return orderData
    })

    if(!orderData || orderData.length === 0) {
      return response.status(404).json({
        message: 'No Order Unavailable',
      })
    }

    return response.status(200).json({
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
    const ordersCompleted = await getAllOrders.getAllOrdersCompleted()

    const orderData = ordersCompleted.map((order) => {
      const { products, userId, ...orderData } = order

      return orderData
    })

    if(!orderData || orderData.length === 0) {
      return response.status(404).json({
        message: 'No Order Completed',
      })
    }

    return response.status(200).json({
      orderData,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to received orders completed',
    })
  }
}

const getOrderById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    const orderService = new OrderService(OrderRepository)
    const order = await orderService.getOrderById(id)

    if(!order || order.length === 0) {
      return response.status(404).json({
        message: 'Order not found',
      })
    }

    return response.status(200).json({      
      order,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to get order',
    })
  }
}

const deliveredOrder = async (request: Request, response: Response) => {
  try {
    const deliveryManId = request.deliveryManId
    const { id: orderId } = request.params

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

    const { products, totalAmount, discount, ...orderData } = order

    return response.status(200).json({      
      order: orderData,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to update order, verify available order',
    })
  }
}

export default {
  createOrder,
  getOrderByUserWithoutProducts,
  getOrderByUserWihProducts,
  deliveredOrder,
  getAllOrdersAvailable,
  getAllOrdersUnavailable,
  getAllOrdersCompleted,
  getOrderById,
}
