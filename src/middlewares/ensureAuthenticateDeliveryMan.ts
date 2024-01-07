import { NextFunction, Response, Request } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  id: string
  iat: number
  exp: number
}

export async function ensureAuthenticateDeliveryMan(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return response.status(401).json({
      message: 'Token missing',
    })
  }

  const [, token] = authHeader.split(' ')

  // verify token
  try {
    // return id for subject
    const decodedToken = verify(
      token,
      process.env.DELIVERY_MAN_SECRET || 'DEFAULT',
    ) as IPayload

    console.log('Decoded Token:', decodedToken)

    // adding userId in request
    request.deliveryManId = decodedToken.id

    console.log('DeliveryManID from Token:', request.deliveryManId)

    return next()
  } catch (err) {
    console.error(err)
    return response.status(401).json({
      message: 'Invalid token!',
    })
  }
}
