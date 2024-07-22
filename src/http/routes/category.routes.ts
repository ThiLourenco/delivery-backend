import { Router } from 'express'
import CategoryController from '../../controllers/CategoryController'

const categoryRoutes = Router()

categoryRoutes.post('/category/create', CategoryController.createCategory)
categoryRoutes.get('/categories', CategoryController.getCategories)
categoryRoutes.get('/category/', CategoryController.getCategoryByName)
categoryRoutes.get(
  '/category/:id/product',
  CategoryController.getCategoriesByProduct,
)
categoryRoutes.put('/category/:id/update', CategoryController.updateCategory)
categoryRoutes.delete('/category/:id/remove', CategoryController.deleteCategory)

export { categoryRoutes }
