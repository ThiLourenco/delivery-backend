import { NextFunction, Response, Request } from 'express'
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string
}

export async function ensureAuthenticateClient(
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
    const { sub } = verify(
      token,
      process.env.CLIENT_SECRET || 'DEFAULT',
    ) as IPayload

    request.userId = sub

    console.log(sub)

    return next()
  } catch (err) {
    return response.status(401).json({
      message: 'Invalid token!',
    })
  }
}
