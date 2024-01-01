import { Router } from 'express'
import ProductController from '../../controllers/ProductController'
import { upload } from '../../middlewares/upload'

const productRoutes = Router()

productRoutes.post('/product/create', ProductController.createProduct)
productRoutes.get('/product/', ProductController.getProductByName)
productRoutes.get('/product/:id', ProductController.getProductById)
productRoutes.get('/products', ProductController.getAllProducts)
productRoutes.put(
  '/product/category/:id',
  ProductController.updateProductCategory,
)
productRoutes.put('/product/:id', ProductController.updateProduct)
productRoutes.put(
  '/product/image/:id',
  upload.single('image'),
  ProductController.updateProductImage,
)

export { productRoutes }
