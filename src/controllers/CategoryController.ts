import { Request, Response } from 'express'
import CategoryRepository from '../repositories/CategoryRepository'
import { CategoryService } from '../services/CategoryService'

const createCategory = async (request: Request, response: Response) => {
  try {
    const { name } = request.body

    const getCategory = new CategoryService(CategoryRepository)
    const data = await getCategory.findCategoryByName(name)

    if(name === data?.name) {
      return response.status(400).json({
        message: 'Category already exists',
      })
    }

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

    if(!categories || categories.length === 0) {
      return response.status(404).json({
        message: 'No categories were found',
      })
    }
    
    return response.status(200).json({
      categories,
    })
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve categories',
    })
  }
}

const getCategoryByName = async (request: Request, response: Response) => {
  
  try {
    const { name } = request.query

    if (!name || typeof name !== 'string') {
      return response.status(400).json({
        message: 'Invalid or missing parameter: name',
      })
    }

    const getCategory = new CategoryService(CategoryRepository)
    const category = await getCategory.findCategoryByName(name)

    if (category === null) {
      return response.status(404).json({
        message: 'Category not found.',
      })
    }

    return response.status(200).json({
      category,
    })
  } catch (error) {
    return response.status(400).json({
      message: 'Failed to retrieve category',
      error
    })
  }
}

const getCategoriesByProduct = async (request: Request, response: Response) => {
  const { id } = request.params

  try {
    const categoryService = new CategoryService(CategoryRepository)
    const category =
    await categoryService.findAllProductByCategoryId(id)

    if(category.length === 0) {
      return response.status(404).json({
        message: 'No products found for this category',
      })
    }

    return response.status(200).json({
      category,
    })

  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Failed to retrieved Product by category',
    })
  }
}

const updateCategory = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name } = request.body

    const getCategory = new CategoryService(CategoryRepository)
    const categoryNameExists = await getCategory.findCategoryByName(name)

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
    
    if (categoryNameExists) {
      return response.status(400).json({
        message: 'Category name already exists',
      })
    }
    
    await getCategory.updateCategory(id, name)

    return response.status(200).json({
      message: 'Category updated successfully',
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

    const category = new CategoryService(CategoryRepository)
    await category.deleteCategory(id)

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
  getCategoryByName,
  getCategoriesByProduct,
  updateCategory,
  deleteCategory,
}
