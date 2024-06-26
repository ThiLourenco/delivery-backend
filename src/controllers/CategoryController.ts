import { Request, Response } from 'express'
import CategoryRepository from '../repositories/CategoryRepository'
import { CategoryService } from '../services/CategoryService'

const createCategory = async (request: Request, response: Response) => {
  try {
    const { name } = request.body

    const newCategory = new CategoryService(CategoryRepository)
    const category = await newCategory.create(name)

    return response.status(201).json({
      message: 'Category created with success!',
      category,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to create category',
    })
  }
}

const getCategories = async (request: Request, response: Response) => {
  try {
    const getCategory = new CategoryService(CategoryRepository)
    const categories = await getCategory.findAllCategory()
    if (!categories || categories.length === 0) {
      return response.status(404).json({
        message: 'No categories found.',
      })
    }
    return response.status(200).json({
      message: 'Categories retrieved successfully!',
      categories,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to retrieve categories',
    })
  }
}

const getCategoriesByProduct = async (request: Request, response: Response) => {
  const { id } = request.params

  try {
    const categoryService = new CategoryService(CategoryRepository)
    const allCategoryByProduct =
      await categoryService.findAllProductByCategoryId(id)

    return response.status(200).json({
      message: 'Product by category retrieved successfully',
      allCategoryByProduct,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed to retrieved Product by category',
    })
  }
}

const updateCategory = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name } = request.body

    if (
      id === undefined ||
      name === undefined ||
      typeof id !== 'string' ||
      typeof name !== 'string'
    ) {
      return response.status(400).json({
        message: 'Invalid or missing parameter: id, name',
      })
    }

    const updateCategoryService = new CategoryService(CategoryRepository)
    await updateCategoryService.updateCategory(id, name)

    return response.status(200).json({
      message: 'Category Updated successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Error updating category',
    })
  }
}

const deleteCategory = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    if (id === undefined || typeof id !== 'string') {
      return response.status(400).json({
        message: 'Invalid or missing parameter: id',
      })
    }

    const deleteCategoryService = new CategoryService(CategoryRepository)
    await deleteCategoryService.deleteCategory(id)

    return response.status(200).json({
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Error deleting category',
    })
  }
}

export default {
  createCategory,
  getCategories,
  getCategoriesByProduct,
  updateCategory,
  deleteCategory,
}
