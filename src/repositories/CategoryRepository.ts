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

      const { createdAt, updatedAt, ...data } = category

      return data;
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
      const categories = await prisma.category.findMany()

      const [ ...data ]  = categories;

      return data;
    } catch (error) {
      throw new AppError('Erro to retrieved category');
    }
  }

  public async findCategoryByName(name: string): Promise<CategoryTypes | null> {
    try {
      const category = await prisma.category.findUnique({
        where: {
          name,
        },
      });

      return category;
    } catch (error) {
      throw new AppError('Error finding category by name');
    }
  }

  public async findCategoriesByProductId(id: string): Promise<CategoryTypes[]> {
    try {
      const categories = await prisma.category.findMany({
        where: {
         id: id
        },include: {
          products: true
        }
      });
      
      const data = categories.map((category) => {
        return {
          id: category.id,
          name: category.name,
          products: category.products.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
          })),
        };
      })

      return data;
    } catch (error) {
      console.error(error);
      throw new AppError('Error finding categories by product');
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
