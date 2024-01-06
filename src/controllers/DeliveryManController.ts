import { Request, Response } from 'express'

import { DeliveryManService } from './../services/DeliveryManService'
import DeliveryManRepository from './../repositories/DeliveryManRepository'
import { DeliveryManTypes } from './../dtos/DeliveryManTypes'
import { UserRole } from '@prisma/client'

const createDeliveryMan = async (request: Request, response: Response) => {
  try {
    const deliveryManData: DeliveryManTypes = request.body

    deliveryManData.role = UserRole.DELIVERY_MAN

    const deliveryMan = new DeliveryManService(DeliveryManRepository)
    const createDeliveryMan = await deliveryMan.execute(deliveryManData)

    return response.status(201).json({
      message: 'User created with success!',
      user: createDeliveryMan,
    })
  } catch (error) {
    console.log(error)
    return response.status(400).json({
      message: 'Failed to create deliveryMan',
    })
  }
}

export default { createDeliveryMan }
