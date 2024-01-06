import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { productRoutes } from './product.routes'
import { categoryRoutes } from './category.routes'
import { orderRoutes } from './order.routes'
import { deliveryManRoutes } from './deliveryMan.routes'

const router = Router()

router.use('/deliveryMan', deliveryManRoutes)
router.use('/', usersRoutes)
router.use('/', productRoutes)
router.use('/', categoryRoutes)
router.use('/order', orderRoutes)

export { router }
