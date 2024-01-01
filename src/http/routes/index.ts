import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { productRoutes } from './product.routes'
import { categoryRoutes } from './category.routes'
import { orderRoutes } from './order.routes'

const router = Router()

router.use('/', usersRoutes)
router.use('/', productRoutes)
router.use('/', categoryRoutes)
router.use('/order', orderRoutes)

export { router }
