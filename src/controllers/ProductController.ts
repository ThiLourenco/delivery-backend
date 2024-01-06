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
    const { name } = request.body

    if (!id || !name || typeof id !== 'string' || typeof name !== 'string') {
      return response.status(400).json({
        message: 'Invalid or missing parameters: id, name',
      })
    }

    const updateProduct = new ProductService(ProductRepository)
    const updatedProduct = await updateProduct.updateCategory(id, name)

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

const updateProduct = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name, description, price, situation } = request.body

    if (
      !name ||
      !description ||
      !price ||
      typeof name !== 'string' ||
      typeof description !== 'string' ||
      typeof price !== 'number' ||
      typeof situation !== 'boolean'
    ) {
      return response.status(400).json({
        message:
          'Invalid or missing parameters: id, name, description, price, situation',
      })
    }

    const product = new ProductService(ProductRepository)
    const updatedProduct = await product.updateProduct(
      id,
      name,
      description,
      price,
      situation,
    )

    return response.status(200).json({
      message: 'Product updated with success!',
      updatedProduct,
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Error updating product',
    })
  }
}

const updateProductImage = async (request: Request, response: Response) => {
  const { id: productId } = request.params
  const imagePath = request.file!.path

  try {
    const updateImage = new ProductService(ProductRepository)
    await updateImage.updateProductImage(productId, imagePath)

    return response.status(200).end()
  } catch (error) {
    return response.status(500).json({
      message: 'Error updating product image',
    })
  }
}

export default {
  createProduct,
  getProductByName,
  getProductById,
  getAllProducts,
  updateProductCategory,
  updateProduct,
  updateProductImage,
}
