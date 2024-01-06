import { Router } from 'express'
import DeliveryManController from '../../controllers/DeliveryManController'

const deliveryManRoutes = Router()

deliveryManRoutes.post('/create', DeliveryManController.createDeliveryMan)

export { deliveryManRoutes }
