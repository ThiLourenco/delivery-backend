import { Request, Response } from 'express'
import CategoryRepository from '../repositories/CategoryRepository'
import { CreateCategoryService } from '../service/CreateCategoryService'

const createCategory = async (request: Request, response: Response) => {
  try {
    const { name } = request.body

    const newCategory = new CreateCategoryService(CategoryRepository)
    const category = await newCategory.execute(name)

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
    const getCategory = new CreateCategoryService(CategoryRepository)
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

export default {
  createCategory,
  getCategories,
}
