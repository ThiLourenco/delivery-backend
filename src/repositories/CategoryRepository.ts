import { prisma } from '../database'
import { AppError } from '../errors/AppError'
import { ICategoryRepository } from '../interfaces/ICategoryRepository'
import { CategoryTypes } from '../dtos/CategoryTypes'
import { ProductsTypes } from 'dtos/ProductsTypes'

class CategoryRepository implements ICategoryRepository {
  public async createCategory(name: string): Promise<CategoryTypes> {
    try {
      const categoryExist = await prisma.category.findUnique({
        where: {
          name,
        },
      })

      if (categoryExist) {
        throw new AppError('Category already exists!')
      }

      const category = await prisma.category.create({
        data: {
          name,
        },
      })

      return category
    } catch (error) {
      throw new AppError('Failed to create category', 500)
    }
  }

  public async getCategories(): Promise<CategoryTypes[]> {
    try {
      const categories = await prisma.category.findMany()

      if (!categories || categories.length === 0) {
        throw new AppError('Failed to retrieve categories.')
      }

      return categories
    } catch (error) {
      console.error(error)
      throw new AppError('No categories found.')
    }
  }

  findCategoriesByProductId(id: string): Promise<ProductsTypes[]> {
    throw new Error('Method not implemented.')
  }
}

export default new CategoryRepository()
