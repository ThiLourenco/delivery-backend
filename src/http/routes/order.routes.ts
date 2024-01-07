import { ensureAuthenticateClient } from './../../middlewares/ensureAuthenticateClient'
import { ensureAuthenticateDeliveryMan } from './../../middlewares/ensureAuthenticateDeliveryMan'
import OrderController from '../../controllers/OrderController'
import { Router } from 'express'

const orderRoutes = Router()

orderRoutes.post(
  '/create',
  ensureAuthenticateClient,
  OrderController.createOrder,
)

orderRoutes.put(
  '/updateEndDate/:id',
  ensureAuthenticateDeliveryMan,
  OrderController.updateEndDate,
)

orderRoutes.get(
  '/user',
  ensureAuthenticateClient,
  OrderController.getOrderByUser,
)

orderRoutes.get('/ordersAvailable', OrderController.getAllOrdersAvailable)

export { orderRoutes }
