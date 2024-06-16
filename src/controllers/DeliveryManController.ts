import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { DeliveryManService } from './../services/DeliveryManService'
import DeliveryManRepository from './../repositories/DeliveryManRepository'
import { DeliveryManTypes } from './../dtos/DeliveryManTypes'
import { BadRequestError } from '../errors/AppError'
import { UserRole } from '@prisma/client'

const createDeliveryMan = async (request: Request, response: Response) => {
  try {
    const deliveryManData: DeliveryManTypes = request.body

    deliveryManData.role = UserRole.DELIVERY_MAN

    const deliveryMan = new DeliveryManService(DeliveryManRepository)
    const createDeliveryMan = await deliveryMan.execute(deliveryManData)

    const { password, role, phone, email, ...userWithPassword } =
      createDeliveryMan

    return response.status(201).json({
      message: 'User created with success!',
      user: userWithPassword,
    })
  } catch (error) {
    console.log(error)
    return response.status(400).json({
      message: 'Failed to create deliveryMan',
    })
  }
}

const updateDeliveryMan = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name, phone } = request.body

    const deliveryManData: DeliveryManTypes = request.body
    deliveryManData.role = UserRole.DELIVERY_MAN

    if (
      !id ||
      !name ||
      !phone ||
      typeof id !== 'string' ||
      typeof name !== 'string' ||
      typeof phone !== 'string'
    ) {
      return response.status(400).json({
        message: 'Invalid or missing parameters: id, name, phone',
      })
    }

    const deliveryMan = new DeliveryManService(DeliveryManRepository)
    const updateDeliveryMan = await deliveryMan.update(id, name, phone)

    return response.status(200).json({
      message: 'DeliveryMan updated successfully',
      updateDeliveryMan,
    })
  } catch (error) {
    console.log(error)
    return response.status(400).json({
      message: 'Failed to update deliveryMan',
    })
  }
}

const loginDeliveryMan = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body

    const getUser = new DeliveryManService(DeliveryManRepository)
    const deliveryManUser = await getUser.login(email, password)

    if (!deliveryManUser) {
      throw new BadRequestError('E-mail or password invalid')
    }

    const verifyPass = await bcrypt.compare(password, deliveryManUser.password)

    if (!verifyPass) {
      throw new BadRequestError('E-mail or password invalid')
    }

    const token = jwt.sign(
      { id: deliveryManUser.id },
      process.env.DELIVERY_MAN_SECRET ?? '',
      {
        expiresIn: '1d',
      },
    )

    const {
      password: _,
      role,
      phone,
      ...deliveryManUserLogin
    } = deliveryManUser

    return response.status(200).json({
      user: deliveryManUserLogin,
      token,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to login',
    })
  }
}

const updateOrderDeliveryMan = async (request: Request, response: Response) => {
  try {
    const { id: orderId } = request.params
    console.log('User ID from request: ' + request.deliveryManId)

    const deliveryManId = request.deliveryManId

    const deliveryManData: DeliveryManTypes = request.body
    deliveryManData.role = UserRole.DELIVERY_MAN

    if (!deliveryManId || deliveryManId === undefined) {
      return response.status(401).json({
        message: 'User ID not specified in request',
      })
    }
    console.log(deliveryManId, 'userId')

    const updateOrderDeliveryService = new DeliveryManService(
      DeliveryManRepository,
    )
    await updateOrderDeliveryService.updateDeliveryOrder(deliveryManId, orderId)

    return response.status(200).json({
      message: 'DeliveryMan Order accepted with successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Error updating order delivery man',
    })
  }
}

const getOrderByDeliveryMan = async (request: Request, response: Response) => {
  try {
    console.log('DeliveryManID from request:' + request.deliveryManId)

    const deliveryManId = request.deliveryManId

    if (deliveryManId === undefined) {
      return response.status(401).json({
        message: 'DeliveryManId not specified in request',
      })
    }

    const getOrders = new DeliveryManService(DeliveryManRepository)
    const orders = await getOrders.getOrdersDelivery(deliveryManId)

    return response.status(200).json({
      message: 'get Orders with success!',
      orders,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to get order',
    })
  }
}

export default {
  createDeliveryMan,
  updateDeliveryMan,
  loginDeliveryMan,
  updateOrderDeliveryMan,
  getOrderByDeliveryMan,
}
