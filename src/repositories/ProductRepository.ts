import { prisma } from '../database'
import { AppError, BadRequestError } from '../errors/AppError'
import { IProductRepository } from '../interfaces/IProductRepository'
import { ProductsTypes } from '../dtos/ProductsTypes'
import { 
  createProductSchema,
  updateProductCategorySchema, 
  updateProductImageSchema,
  updateProductSchema } from '../../prisma/schemas/productSchema'
import { z } from 'zod'

class ProductRepository implements IProductRepository {
  public async create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: boolean,
  ): Promise<ProductsTypes> {
    try {
      const validateData = createProductSchema.parse({
        name,
        description,
        image,
        price,
        situation,
      })

      const productExists = await prisma.product.findUnique({
        where: {
          name: validateData.name,
        },
      })

      if (productExists) {
        throw new AppError('Product already exists!', 400)
      }

      const product = await prisma.product.create({
        data: {
          name: validateData.name,
          description: validateData.description || '',
          image: validateData.image || '',
          price: validateData.price,
          situation: validateData.situation,
        },
      })

      return product;
    } catch (error) {
      if(error instanceof z.ZodError) {
        throw new BadRequestError('Validation error')
      }
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
      return product;
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

      return product
    } catch (error) {
      throw new AppError('Failed to create product', 500)
    }
  }

  public async findAllProducts(): Promise<ProductsTypes[]> {
    try {
      const products = await prisma.product.findMany()

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
    name: string,
  ): Promise<ProductsTypes> {
    try {
      const validatedData = updateProductCategorySchema.parse({
        id,
        name
      })

      const productExists = await prisma.product.findUnique({
        where: {
          id: validatedData.id,
        },
      })

      if (!productExists) {
        throw new AppError('Product not exists', 400)
      }

      const category = await prisma.category.findUnique({
        where: {
          name: validatedData.name,
        },
      })

      if (!category) {
        throw new AppError('Category not exists', 400)
      }

      const updatedProduct = await prisma.product.update({
        data: {
          categoryId: category.id,
          updatedAt: new Date(),
        },
        where: {
          id: validatedData.id,
        },
      })

      return updatedProduct
    } catch (error) {
      if(error instanceof z.ZodError) {
        throw new BadRequestError('Validation error')
      }
      throw new AppError(
        'Error to update product', 400)
    }
  }

  public async updateProduct(
    id: string,
    name: string,
    description: string,
    price: number,
    situation: boolean,
  ): Promise<ProductsTypes> {
    try {

      const validateData = updateProductSchema.parse({
        id,
        name,
        description,
        price,
        situation,
      })

      const productExists = await prisma.product.findUnique({
        where: {
          id: validateData.id,
        },
      })

      if (!productExists) {
        throw new AppError('Product not exists', 400)
      }

      const updatedProduct = await prisma.product.update({
        data: {
          ...validateData,
          updatedAt: new Date(),
        },
        where: {
          id: productExists.id,
        },
      });

      return updatedProduct
    } catch (error) {
      if(error instanceof z.ZodError) {
        throw new BadRequestError('Validation error')
      }
      throw new AppError(
        'Error to update product, verify all fields are valid !',
        400,
      )
    }
  }

  public async updateProductImage(
    productId: string,
    imagePath: string,
  ): Promise<ProductsTypes> {
    try {

      const validateData = updateProductImageSchema.parse({
        productId,
        imagePath,
      })

      const productExists = await prisma.product.findUnique({
        where: {
          id: validateData.productId,
        },
      })

      if (!productExists) {
        throw new AppError('Product not exists', 400)
      }

      const updateImage = await prisma.product.update({
        where: {
          id: validateData.productId,
        },
        data: {
          image: validateData.imagePath,
        },
      })

      return updateImage
    } catch (error) {
      if(error instanceof z.ZodError) {
        throw new BadRequestError('Validation error')
      }
      throw new AppError('Error to update image product!', 400)
    }
  }
}

export default new ProductRepository()
