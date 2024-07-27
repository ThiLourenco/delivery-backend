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
  '/delivered/:id',
  ensureAuthenticateDeliveryMan,
  OrderController.deliveredOrder,
)

orderRoutes.get(
  '/user/list',
  ensureAuthenticateClient,
  OrderController.getOrderByUserWithoutProducts,
)

orderRoutes.get(
  '/user/products/list',
  ensureAuthenticateClient,
  OrderController.getOrderByUserWihProducts,
)

orderRoutes.get('/availables', OrderController.getAllOrdersAvailable)

orderRoutes.get('/unavailables', OrderController.getAllOrdersUnavailable)

orderRoutes.get('/completed', OrderController.getAllOrdersCompleted)

orderRoutes.get('/:id', OrderController.getOrderById)

export { orderRoutes }
