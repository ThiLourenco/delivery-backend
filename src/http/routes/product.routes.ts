import { Router } from 'express'
import ProductController from '../../controllers/ProductController'

const productRoutes = Router()

productRoutes.post('/product/create', ProductController.createProduct)
productRoutes.get('/product/', ProductController.getProductByName)
productRoutes.get('/product/:id', ProductController.getProductById)
productRoutes.get('/products', ProductController.getAllProducts)
productRoutes.put('/product/:id', ProductController.updateProductCategory)

export { productRoutes }
