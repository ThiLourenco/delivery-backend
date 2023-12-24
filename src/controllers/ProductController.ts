import { Request, Response } from 'express'
import { ProductsTypes } from '../dtos/ProductsTypes'
import { ProductService } from '../services/ProductService'
import ProductRepository from '../repositories/ProductRepository'

const createProduct = async (request: Request, response: Response) => {
  try {
    const {
      name,
      description,
      image,
      price,
      situation,
      category,
    }: ProductsTypes = request.body

    const createProduct = new ProductService(ProductRepository)
    const product = await createProduct.create(
      name,
      description,
      image,
      price,
      situation,
      category,
    )

    return response.status(201).json({
      message: 'Product created with success!',
      product,
    })
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Error creating a new product, verify all fields are valid!',
    })
  }
}

const getProductByName = async (request: Request, response: Response) => {
  try {
    const { name } = request.query

    if (!name || typeof name !== 'string') {
      return response.status(400).json({
        message: 'Invalid or missing parameter: name',
      })
    }

    const getProduct = new ProductService(ProductRepository)
    const product = await getProduct.findProductByName(name)

    if (product) {
      return response.status(200).json({
        message: 'Get product with success!',
        product,
      })
    }

    return response.status(404).json({
      message: 'Product not found!',
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Error finding products',
    })
  }
}

const getProductById = async (request: Request, response: Response) => {
  try {
    const { id } = request.params

    const getProduct = new ProductService(ProductRepository)
    const product = await getProduct.findProductById(id)

    if (product) {
      return response.status(200).json({
        message: 'Get product with success!',
        product,
      })
    }

    return response.status(404).json({
      message: 'Product not found!',
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Error finding products',
    })
  }
}

const getAllProducts = async (request: Request, response: Response) => {
  try {
    const getProducts = new ProductService(ProductRepository)
    const products = await getProducts.getAllProducts()

    if (!products || products.length === 0) {
      return response.status(404).json({
        message: 'No products found',
      })
    }

    return response.status(200).json({
      message: 'Products found with success',
      products,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Failed to find products',
    })
  }
}

const updateProductCategory = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name: newCategoryName } = request.body

    if (
      !id ||
      !newCategoryName ||
      typeof id !== 'string' ||
      typeof newCategoryName !== 'string'
    ) {
      return response.status(400).json({
        message: 'Invalid or missing parameters: id, category',
      })
    }

    const updateProduct = new ProductService(ProductRepository)
    const updatedProduct = await updateProduct.updateCategory(
      id,
      newCategoryName,
    )

    return response.status(200).json({
      message: 'Product category updated with success!',
      updatedProduct,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Error updating product category',
    })
  }
}

export default {
  createProduct,
  getProductByName,
  getProductById,
  getAllProducts,
  updateProductCategory,
}
