import { Request, Response } from 'express'
import { ProductsTypes } from '../dtos/ProductsTypes'
import { CreateProductService } from '../service/CreateProductService'
import ProductRepository from '../repositories/ProductRepository'

export default {
  async createProduct(request: Request, response: Response) {
    try {
      const { name, description, image, price, situation }: ProductsTypes =
        request.body

      const createProduct = new CreateProductService(ProductRepository)
      const product = await createProduct.create(
        name,
        description,
        image,
        price,
        situation,
      )

      if (product) {
        return response.status(201).json({
          message: 'Product created with success!',
          product,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Error to create new product, verify all fields are valid!',
      })
    }
  },

  async getProductByName(request: Request, response: Response) {
    try {
      const { name }: ProductsTypes = request.body

      const getProduct = new CreateProductService(ProductRepository)
      const product = await getProduct.findProductByName(name)

      if (product) {
        return response.status(201).json({
          message: 'Get product with success!',
          product,
        })
      }

      if (!product) {
        return response.status(400).json({
          message: 'Product not found !',
          product,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        message: 'Error finding products',
      })
    }
  },

  async getProductById(request: Request, response: Response) {
    try {
      const { id }: ProductsTypes = request.body

      const getProduct = new CreateProductService(ProductRepository)
      const product = await getProduct.findProductById(id)

      if (product) {
        return response.status(201).json({
          message: 'Get product with successfully',
          product,
        })
      }

      if (!product) {
        return response.status(400).json({
          message: 'Product not found, verify!',
          product,
        })
      }
    } catch (error) {
      return response.status(500).json({
        message: 'Error finding products',
        error,
      })
    }
  },

  async getAllProducts(request: Request, response: Response) {
    try {
      const getProducts = new CreateProductService(ProductRepository)
      const products = await getProducts.getAllProducts()

      if (!products || products.length === 0) {
        return response.status(400).json({
          message: 'No products found',
        })
      }

      if (products.length > 0) {
        return response.status(200).json({
          message: 'Products found with success',
          products,
        })
      }
    } catch (error) {
      return response.status(400).json({
        message: 'Failed to find products',
      })
    }
  },
}
