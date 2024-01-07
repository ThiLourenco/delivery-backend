import { Router } from 'express'
import DeliveryManController from '../../controllers/DeliveryManController'

const deliveryManRoutes = Router()

deliveryManRoutes.post('/create', DeliveryManController.createDeliveryMan)
deliveryManRoutes.put('/update/:id', DeliveryManController.updateDeliveryMan)
deliveryManRoutes.post('/login', DeliveryManController.loginDeliveryMan)

export { deliveryManRoutes }
