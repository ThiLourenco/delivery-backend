import { prisma } from '../database';
import { AppError, BadRequestError } from '../errors/AppError';
import { ICategoryRepository } from '../interfaces/ICategoryRepository';
import { CategoryTypes } from '../dtos/CategoryTypes';
import { createCategorySchema, updateCategorySchema } from '../../prisma/schemas/categorySchema';
import { z } from 'zod';

class CategoryRepository implements ICategoryRepository {
  public async createCategory(name: string): Promise<CategoryTypes> {
    try {
      const validatedData = createCategorySchema.parse({ name });

      const categoryExist = await prisma.category.findUnique({
        where: {
          name: validatedData.name,
        },
      });

      if (categoryExist) {
        throw new AppError('Category already exists!', 400);
      }

      const category = await prisma.category.create({
        data: {
          name: validatedData.name,
        },
      });

      return category;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new BadRequestError('Validation error');
      }
      throw new AppError('Failed to create category', 500);
    }
  }

  public async getCategories(): Promise<CategoryTypes[]> {
    try {
      const categories = await prisma.category.findMany();

      if (!categories || categories.length === 0) {
        throw new BadRequestError('No categories found.');
      }

      return categories;
    } catch (error) {
      console.error(error);
      throw new BadRequestError('Failed to retrieve categories.');
    }
  }

  public async findCategoriesByProductId(id: string): Promise<CategoryTypes[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
          products: {
            some: {
              id,
            },
          },
        },
      });

      return categories;
    } catch (error) {
      console.error(error);
      throw new BadRequestError('No categories with products found.');
    }
  }

  public async updateCategory(id: string, name: string): Promise<CategoryTypes> {
    try {
      const validatedData = updateCategorySchema.parse({ name });

      const categoryExists = await prisma.category.findUnique({
        where: {
          id,
        },
      });

      if (!categoryExists) {
        throw new BadRequestError('Category not exists');
      }

      const updateCategory = await prisma.category.update({
        data: {
          name: validatedData.name,
          updatedAt: new Date(),
        },
        where: {
          id,
        },
      });

      return updateCategory;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error', error.issues);
        throw new BadRequestError('Validation error');
      }
      throw new BadRequestError('Error to update category');
    }
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      const categoryExists = await prisma.category.findUnique({
        where: {
          id,
        },
      });

      if (!categoryExists) {
        throw new BadRequestError('Category not exists');
      }

      await prisma.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new AppError('Failed deleting category');
    }
  }
}

export default new CategoryRepository();
