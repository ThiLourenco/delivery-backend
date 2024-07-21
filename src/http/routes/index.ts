import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { productRoutes } from './product.routes'
import { categoryRoutes } from './category.routes'
import { orderRoutes } from './order.routes'
import { deliveryManRoutes } from './deliveryMan.routes'

const router = Router()

router.use('/api/v1/deliveryman', deliveryManRoutes)
router.use('/api/v1/', usersRoutes)
router.use('/api/v1/', productRoutes)
router.use('/api/v1/', categoryRoutes)
router.use('/api/v1/order', orderRoutes)

export { router }
