import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { IProductRepository } from '../interfaces/IProductRepository'
import { ProductsTypes } from '../types/ProductsTypes'

class ProductRepository implements IProductRepository {
  public async create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: string,
    category?: {
      name: string
    },
  ): Promise<ProductsTypes> {
    try {
      if (!name || !description || !image || !price || !situation) {
        throw new AppError('Incomplete product data provided')
      }
      const productExists = await prisma.product.findUnique({
        where: {
          name,
        },
      })

      if (productExists) {
        throw new AppError('Product already exists!')
      }

      const productData = {
        name,
        description,
        image,
        price,
        situation,
      }

      const product = await prisma.product.create({
        data: productData,
      })

      return product
    } catch (error) {
      throw new AppError('Failed to create product', 500)
    }
  }
}

export default new ProductRepository()
