import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { IProductRepository } from '../interfaces/IProductRepository'
import { ProductsTypes } from '../dtos/ProductsTypes'

class ProductRepository implements IProductRepository {
  public async create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: boolean,
  ): Promise<ProductsTypes> {
    try {
      const productExists = await prisma.product.findUnique({
        where: {
          name,
        },
      })

      if (productExists) {
        throw new AppError('Product already exists!', 400)
      }

      const product = await prisma.product.create({
        data: {
          name,
          description,
          image,
          price,
          situation,
        },
      })

      return product
    } catch (error) {
      throw new AppError(
        'Error to create new product, verify all fields are valid !',
        400,
      )
    }
  }

  public async findByName(name: string): Promise<ProductsTypes | null> {
    try {
      const product = await prisma.product.findUnique({
        where: {
          name,
        },
      })

      if (product) {
        return product
      } else {
        return null
      }
    } catch (error) {
      throw new AppError('Failed to create product', 500)
    }
  }

  public async findById(id: string): Promise<ProductsTypes | null> {
    try {
      const product = await prisma.product.findUnique({
        where: {
          id,
        },
      })

      if (product) {
        return product
      } else {
        return null
      }
    } catch (error) {
      throw new AppError('Failed to create product', 500)
    }
  }

  public async findAllProducts(): Promise<ProductsTypes[]> {
    try {
      const products = await prisma.product.findMany({
        include: {
          // category: true
        },
      })

      if (!products || products.length === 0) {
        throw new AppError('Products not found')
      }

      return products
    } catch (error) {
      console.error(error)
      throw new AppError('No products found.')
    }
  }

  public async updateProductCategory(
    id: string,
    categoryName: string,
  ): Promise<ProductsTypes> {
    try {
      const productExists = await prisma.product.findUnique({
        where: {
          id,
        },
      })

      if (!productExists) {
        throw new AppError('Product not exists', 400)
      }

      const category = await prisma.category.findUnique({
        where: {
          name: categoryName,
        },
      })

      if (!category) {
        throw new AppError('Category not found', 404)
      }

      const updatedProduct = await prisma.product.update({
        data: {
          categoryId: category.id,
        },
        where: {
          id: productExists.id,
        },
      })

      return updatedProduct
    } catch (error) {
      throw new AppError(
        'Error to create new product, verify all fields are valid !',
        400,
      )
    }
  }
}

export default new ProductRepository()
