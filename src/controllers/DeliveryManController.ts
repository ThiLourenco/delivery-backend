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

    const data = new DeliveryManService(DeliveryManRepository)
    const deliveryMan = await data.create(deliveryManData)
    const { 
        password, 
        role, 
        phone, 
        email, 
        isAdmin, 
        name, 
        username, 
        createdAt,
        updatedAt, 
        ...delivery } = deliveryMan

    return response.status(201).json({
      success: true,
      data: delivery,
      message: 'Delivery man created with success',
    })
  } catch (error) {
    console.log(error)
    return response.status(400).json({
      message: 'User already exists with this email',
    })
  }
}

const loginDeliveryMan = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body

    const data = new DeliveryManService(DeliveryManRepository)
    const deliveryManUser = await data.login(email, password)

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
      isAdmin,
      createdAt,
      updatedAt,
      username,
      ...deliveryManUserLogin
    } = deliveryManUser

    return response.status(200).json({
      success: true,
      token,
      user: deliveryManUserLogin,
      message: 'User logged in successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(401).json({
      success: false,
      message: 'Invalid email or password',
    })
  }
}

const updateDeliveryMan = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name, phone } = request.body

    const deliveryManData: DeliveryManTypes = request.body
    deliveryManData.role = UserRole.DELIVERY_MAN

    const deliveryMan = new DeliveryManService(DeliveryManRepository)
    await deliveryMan.update(id, name, phone)

    return response.status(200).json({
      success: true,
      data: deliveryManData,
      message: 'DeliveryMan updated successfully',
    })
  } catch (error) {
    console.log(error)
    return response.status(400).json({
      message: 'Invalid or missing parameters: id, name, phone',
    })
  }
}

const acceptOrderDeliveryService = async (request: Request, response: Response) => {
  try {
    const { id: orderId } = request.params

    const deliveryManId = request.deliveryManId

    const deliveryManData: DeliveryManTypes = request.body
    deliveryManData.role = UserRole.DELIVERY_MAN

    if (!deliveryManId || deliveryManId === undefined) {
      return response.status(401).json({
        message: 'User ID not specified in request',
      })
    }

    const orderDeliveryService = new DeliveryManService(
      DeliveryManRepository,
    )
    await orderDeliveryService.updateDeliveryOrder(deliveryManId, orderId)

    return response.status(200).json({
      success: true,
      data: orderId,
      message: 'DeliveryMan accepted with successfully',
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
    const deliveryManId = request.deliveryManId

    if (!deliveryManId || deliveryManId === undefined) {
      return response.status(401).json({
        message: 'DeliveryManId not specified in request',
      })
    }

    const data = new DeliveryManService(DeliveryManRepository)
    const orders = await data.getOrdersDelivery(deliveryManId)

    return response.status(200).json({
      success: true,
      data: orders,
      messsage: 'Orders retrieved successfully'
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
  acceptOrderDeliveryService,
  getOrderByDeliveryMan,
}
