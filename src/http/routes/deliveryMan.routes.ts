import { Router } from 'express'
import DeliveryManController from '../../controllers/DeliveryManController'

const deliveryManRoutes = Router()

deliveryManRoutes.post('/create', DeliveryManController.createDeliveryMan)
deliveryManRoutes.post('/login', DeliveryManController.loginDeliveryMan)
deliveryManRoutes.put('/update/:id', DeliveryManController.updateDeliveryMan)

export { deliveryManRoutes }
