import { Request, Response } from 'express'
import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { ProductsCreateInputs } from '../types/ProductsCreateInput'

export default {
  async createProduct(request: Request, response: Response) {
    try {
      const {
        name,
        description,
        image,
        price,
        situation,
      }: ProductsCreateInputs = request.body

      const productExist = await prisma.product.findUnique({
        where: {
          name,
        },
      })

      if (productExist) {
        throw new AppError('Product already exists!')
      }

      const createProduct = await prisma.product.create({
        data: {
          name,
          description,
          image,
          price,
          situation,
        },
      })

      // if (createProduct) {
      //   const createCategory = await prisma.category.create({
      //     data: {
      //       category: category?.name,
      //     },
      //   })

      if (createProduct) {
        return response.status(201).json({
          message: 'User product and Category with success!',
          createProduct,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(400).json({
        message: 'Failed to create product',
      })
    }
  },
}
