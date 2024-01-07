import { Router } from 'express'
import DeliveryManController from '../../controllers/DeliveryManController'
import { ensureAuthenticateDeliveryMan } from './../../middlewares/ensureAuthenticateDeliveryMan'

const deliveryManRoutes = Router()

deliveryManRoutes.post('/create', DeliveryManController.createDeliveryMan)
deliveryManRoutes.post('/login', DeliveryManController.loginDeliveryMan)
deliveryManRoutes.put('/update/:id', DeliveryManController.updateDeliveryMan)
deliveryManRoutes.put(
  '/orderDeliveryMan/:id',
  ensureAuthenticateDeliveryMan,
  DeliveryManController.updateOrderDeliveryMan,
)

deliveryManRoutes.get(
  '/getOrders',
  ensureAuthenticateDeliveryMan,
  DeliveryManController.getOrderByDeliveryMan,
)

export { deliveryManRoutes }
