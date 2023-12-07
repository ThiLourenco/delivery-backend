import { Router } from 'express'
import CategoryController from '../../controllers/CategoryController'

const categoryRoutes = Router()

categoryRoutes.post('/category', CategoryController.createCategory)
categoryRoutes.get('/category', CategoryController.getCategories)

export { categoryRoutes }
