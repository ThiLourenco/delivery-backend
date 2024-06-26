import { prisma } from '../database'
import { AppError, BadRequestError } from '../errors/AppError'
import { ICategoryRepository } from '../interfaces/ICategoryRepository'
import { CategoryTypes } from '../dtos/CategoryTypes'

class CategoryRepository implements ICategoryRepository {
  public async createCategory(name: string): Promise<CategoryTypes> {
    try {
      if (!name) {
        throw new AppError('Category name is required.', 400)
      }

      const categoryExist = await prisma.category.findUnique({
        where: {
          name,
        },
      })

      if (categoryExist) {
        throw new AppError('Category already exists!', 400)
      }

      const category = await prisma.category.create({
        data: {
          name,
        },
      })

      return category
    } catch (error) {
      throw new AppError('Category already exists!', 400)
    }
  }

  public async getCategories(): Promise<CategoryTypes[]> {
    try {
      const categories = await prisma.category.findMany()

      if (!categories || categories.length === 0) {
        throw new BadRequestError('No categories found.')
      }

      return categories
    } catch (error) {
      console.error(error)
      throw new BadRequestError('Failed to retrieve categories.')
    }
  }

  public async findCategoriesByProductId(id: string): Promise<CategoryTypes[]> {
    try {
      const categoriesByProduct = await prisma.product.findMany({
        where: {
          categoryId: id,
        },
      })

      return categoriesByProduct
    } catch (error) {
      console.error(error)
      throw new BadRequestError('No categories with products found.')
    }
  }

  public async updateCategory(
    id: string,
    name: string,
  ): Promise<CategoryTypes> {
    try {
      const categoryExists = await prisma.category.findUnique({
        where: {
          id,
        },
      })

      if (!categoryExists) {
        throw new BadRequestError('Category not exists')
      }

      const updateCategory = await prisma.category.update({
        data: {
          name,
          updatedAt: new Date(),
        },
        where: {
          id,
        },
      })

      return updateCategory
    } catch (error) {
      throw new BadRequestError('Error to update category')
    }
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      const categoryExists = await prisma.category.findUnique({
        where: {
          id,
        },
      })

      if (!categoryExists) {
        throw new BadRequestError('Category not exists')
      }

      await prisma.category.delete({
        where: {
          id,
        },
      })
    } catch (error) {
      throw new AppError('Failed deleting category')
    }
  }
}

export default new CategoryRepository()
