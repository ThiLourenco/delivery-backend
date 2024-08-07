import { Request, Response } from 'express'
import path from 'path'
import { ProductsTypes } from '../dtos/ProductsTypes'
import { ProductService } from '../services/ProductService'
import ProductRepository from '../repositories/ProductRepository'
import { tmpFolder } from './../middlewares/upload'

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

    const getProduct = new ProductService(ProductRepository)
    const product = await getProduct.findProductByName(name)

    if(product?.name) {
      return response.status(400).json({
        message: 'Product already exists with this name!',
      })
    }

    const createProduct = new ProductService(ProductRepository)

    const productData = await createProduct.create(
      name,
      description,
      image,
      price,
      situation,
      category,
    )

    return response.status(201).json({
      success: true,
      data: productData,
      message: 'Product created with success',
    })
  } catch (error) {
    console.error(error)
    return response.status(500).json({
      message: 'Failed creating product',
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
    const productData = await getProduct.findProductByName(name)

    if (productData) {
      const { createdAt, updatedAt, ...product } = productData

      return response.status(200).json({
        success: true,
        data: product,
        message: 'Product retrieved successfully',
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
    const productData = await getProduct.findProductById(id)

    if (productData) {
      const { createdAt, updatedAt, ...product } = productData

      return response.status(200).json({
        success: true,
        data: product,
        message: 'Product retrieved successfully',
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

    const productsData = products.map((product) => {
      const { createdAt, ...productsData } = product
      return productsData
    })

    return response.status(200).json({
      success: true,
      data: productsData,
      message: 'Product retrieved successfully',
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
    const product = await updateProduct.updateCategory(id, name)

    if(product) {
      const { description, image, price, situation, createdAt, updatedAt, ...productData } = product

      return response.status(200).json({
        success: true,
        data: productData,
        message: 'Product category updated successfully',
      })
    }

  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed updating product category',
    })
  }
}

const updateProduct = async (request: Request, response: Response) => {
  try {
    const { id } = request.params
    const { name, description, price, situation }: ProductsTypes = request.body

    if (!name || !description || !price) {
      return response.status(400).json({
        message:
          'Invalid or missing parameters: id, name, description, price, situation',
      })
    }

    const product = new ProductService(ProductRepository)
    const productExists = await product.findProductByName(name).then((product) => {
      return product? product : null
    })

    if (productExists) {
      return response.status(400).json({
        message: 'Product already exists with this name!',
      })
    }

    const productData = await product.updateProduct(id, name, description, price, situation)

    return response.status(200).json({
      success: true,
      data: productData,
      message: 'Product updated with success!',
    })
    
  } catch (error) {
    console.error(error)
    return response.status(400).json({
      message: 'Failed updating product',
    })
  }
}

const updateProductImage = async (request: Request, response: Response) => {
  const { id: productId } = request.params
  const imagePath = request.file!.path

  try {
    const updateImage = new ProductService(ProductRepository)
    // Save the relative path to the database
    const relativeImagePath = path.relative(tmpFolder, imagePath)
    await updateImage.updateProductImage(productId, relativeImagePath)

    // Construct the URL for the updated image
    const imageUrl = `${request.protocol}://${request.get(
      'host',
    )}/images/${path.basename(relativeImagePath)}`

    // Return the URL of the updated image
    return response.status(200).json({
      success: true,
      data: imageUrl ,
      message: 'Product image updated successfully!',
    })
  } catch (error) {
    return response.status(500).json({
      message: 'Failed updating product image',
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
