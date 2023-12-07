import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { productRoutes } from './product.routes'
import { categoryRoutes } from './category.routes'
const router = Router()

router.use('/', usersRoutes)
router.use('/', productRoutes)
router.use('/', categoryRoutes)

export { router }
