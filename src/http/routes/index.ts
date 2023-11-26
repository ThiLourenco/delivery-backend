import { Router } from 'express'
import { usersRoutes } from './users.routes'
import { productRoutes } from './product.routes'
const router = Router()

router.use('/', usersRoutes)
router.use('/', productRoutes)

export { router }
