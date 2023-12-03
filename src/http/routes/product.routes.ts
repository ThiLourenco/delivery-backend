import { Router } from 'express'
import ProductController from '../../controllers/ProductController'

const productRoutes = Router()

productRoutes.post('/product/create', ProductController.createProduct)
productRoutes.get('/product', ProductController.getProductByName)
productRoutes.get('/productById', ProductController.getProductById)
productRoutes.get('/products', ProductController.getAllProducts)

export { productRoutes }
