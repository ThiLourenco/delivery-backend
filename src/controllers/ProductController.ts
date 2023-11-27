import { Request, Response } from 'express'
import { ProductsTypes } from '../types/ProductsTypes'
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
          message: 'User product and Category with success!',
          product,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Product already exists!',
      })
    }
  },
}
