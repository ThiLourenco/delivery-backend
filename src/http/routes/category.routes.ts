import { Router } from 'express'
import CategoryController from '../../controllers/CategoryController'

const categoryRoutes = Router()

categoryRoutes.post('/category', CategoryController.createCategory)
categoryRoutes.get('/category', CategoryController.getCategories)
categoryRoutes.get(
  '/category/products',
  CategoryController.getCategoriesByProduct,
)
categoryRoutes.put('/category/:id', CategoryController.updateCategory)

export { categoryRoutes }
