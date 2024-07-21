import { Router } from 'express'
import DeliveryManController from '../../controllers/DeliveryManController'
import { ensureAuthenticateDeliveryMan } from './../../middlewares/ensureAuthenticateDeliveryMan'

const deliveryManRoutes = Router()

deliveryManRoutes.post('/create', DeliveryManController.createDeliveryMan)
deliveryManRoutes.post('/login/user', DeliveryManController.loginDeliveryMan)
deliveryManRoutes.put('/update/:id/user', DeliveryManController.updateDeliveryMan)
deliveryManRoutes.put(
  '/order-accept/:id',
  ensureAuthenticateDeliveryMan,
  DeliveryManController.acceptOrderDeliveryService,
)

deliveryManRoutes.get(
  '/orders',
  ensureAuthenticateDeliveryMan,
  DeliveryManController.getOrderByDeliveryMan,
)

export { deliveryManRoutes }
