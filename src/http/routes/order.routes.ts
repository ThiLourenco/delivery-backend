import { ensureAuthenticateClient } from './../../middlewares/ensureAuthenticateClient'
import OrderController from '../../controllers/OrderController'
import { Router } from 'express'

const orderRoutes = Router()

orderRoutes.post(
  '/create',
  ensureAuthenticateClient,
  OrderController.createOrder,
)

export { orderRoutes }
