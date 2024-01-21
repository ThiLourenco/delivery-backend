/* eslint-disable no-undef */
import { ProductService } from '../../services/ProductService'
import productRepository from '../../repositories/ProductRepository'
import { ProductsTypes } from '../../dtos/ProductsTypes'

const mockProducts: ProductsTypes[] = [
  {
    id: '1',
    name: 'Existing Product',
    description: 'Description',
    image: 'image.png',
    price: 100,
    situation: true,
    category: {
      name: 'Category Name',
    },
  },
  {
    id: '2',
    name: 'Existing Product2',
    description: 'Description2',
    image: 'image2.png',
    price: 100,
    situation: true,
    category: {
      name: 'Category Name2',
    },
  },
]

// Mock ProductRepository
jest.mock('../../repositories/ProductRepository', () => {
  return {
    create: jest.fn(
      (
        name: string,
        description: string,
        image: string,
        price: number,
        situation: boolean,
        category?: { name: string },
      ): Promise<ProductsTypes> => {
        return Promise.resolve({
          id: '1',
          name,
          description,
          image,
          price,
          situation,
          category,
        })
      },
    ),
    findByName: jest.fn(
      (name: string, id: string): Promise<ProductsTypes | null> => {
        if (name === 'Existing Product' || id === '1') {
          return Promise.resolve({
            id: '1',
            name: 'Existing Product',
            description: 'Description',
            image: 'image.png',
            price: 100,
            situation: true,
            category: {
              name: 'Category Name',
            },
          })
        } else {
          return Promise.resolve(null)
        }
      },
    ),
    findById: jest.fn((id: string): Promise<ProductsTypes | null> => {
      if (id === '1') {
        return Promise.resolve({
          id: '1',
          name: 'Existing Product',
          description: 'Description',
          image: 'image.png',
          price: 100,
          situation: true,
          category: {
            name: 'Category Name',
          },
        })
      } else {
        return Promise.resolve(null)
      }
    }),
    findAllProducts: jest.fn(() => Promise.resolve(mockProducts)),
    updateProductCategory: jest.fn(
      (id: string, name: string): Promise<ProductsTypes> => {
        return Promise.resolve({
          id,
          name,
          description: 'Updated Description',
          image: 'updated-image.png',
          price: 200,
          situation: true,
          category: { name },
        })
      },
    ),
    updateProduct: jest.fn(
      (
        id: string,
        name: string,
        description: string,
        price: number,
        situation: boolean,
        category,
      ): Promise<ProductsTypes> => {
        return Promise.resolve({
          id,
          name: 'Coca-Cola',
          description: 'Updated description',
          image: 'image.png',
          price: 100,
          situation: true,
          category: {
            name,
          },
        })
      },
    ),
    updateProductImage: jest.fn(
      (productId: string, imagePath: string): Promise<ProductsTypes> => {
        return Promise.resolve({
          id: productId,
          image: imagePath,
          name: 'Coca-Cola',
          description: 'Updated description',
          price: 100,
          situation: true,
        })
      },
    ),
  }
})

const mockedProductRepository = jest.mocked(productRepository)

describe('ProductService', () => {
  let productService: ProductService

  beforeEach(() => {
    // Create a new instance of ProductService with mock ProductRepository
    productService = new ProductService(mockedProductRepository)
  })

  it('should create a product successfully', async () => {
    const productData: ProductsTypes = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      image: 'test-image.png',
      price: 100,
      situation: true,
      category: {
        name: 'Test Category',
      },
    }

    const product = await productService.create(
      productData.name,
      productData.description,
      productData.image,
      productData.price,
      productData.situation,
      productData.category,
    )

    expect(mockedProductRepository.create).toHaveBeenCalledWith(
      productData.name,
      productData.description,
      productData.image,
      productData.price,
      productData.situation,
      productData.category,
    )
    expect(product).toHaveProperty('id', '1')
    expect(product.name).toBe(productData.name)
    expect(product.description).toBe(productData.description)
    expect(product.image).toBe(productData.image)
    expect(product.price).toBe(productData.price)
    expect(product.situation).toBe(productData.situation)
    expect(product.category).toEqual(productData.category)
  })

  it('should return a product when it exists', async () => {
    const productName = 'Existing Product'
    const product = await productService.findProductByName(productName)

    expect(mockedProductRepository.findByName).toHaveBeenCalledWith(productName)
    expect(product).toHaveProperty('id', '1')
    expect(product?.name).toBe(productName)
  })

  it('should return null when the product does not exists', async () => {
    const productName = 'Non-Existing Product'
    const product = await productService.findProductByName(productName)

    expect(mockedProductRepository.findByName).toHaveBeenCalledWith(productName)
    expect(product).toBeNull()
  })

  it('should return a product when it exists by Id', async () => {
    const productId = '1'
    const product = await productService.findProductById(productId)

    expect(mockedProductRepository.findById).toHaveBeenCalledWith(productId)
    expect(product?.id).toBe(productId)
  })

  it('should return null when the product is not found by id', async () => {
    const productId = 'No-Exists-Product'
    const product = await productService.findProductById(productId)

    expect(mockedProductRepository.findById).toHaveBeenCalledWith(productId)
    expect(product).toBeNull()
  })

  it('should return all products', async () => {
    const products = await productService.getAllProducts()

    expect(mockedProductRepository.findAllProducts).toHaveBeenCalled()
    expect(products).toEqual(mockProducts)
  })

  it('should update product category', async () => {
    const id = '1'
    const name = 'New category Name'
    const updatedProduct = await productService.updateCategory(id, name)

    expect(mockedProductRepository.updateProductCategory).toHaveBeenCalledWith(
      id,
      name,
    )
    expect(updatedProduct.category?.name).toBe(name)
  })

  it('should update products data', async () => {
    const name = 'Coca-Cola'
    const description = 'Updated description'
    const price = 100
    const image = 'image.png'
    const situation = true

    const data = await productService.updateProduct(
      name,
      description,
      image,
      price,
      situation,
    )

    expect(mockedProductRepository.updateProduct).toHaveBeenCalledWith(
      name,
      description,
      image,
      price,
      situation,
    )

    expect(data.name).toEqual(name)
    expect(data.description).toEqual(description)
    expect(data.image).toEqual(image)
    expect(data.price).toEqual(price)
    expect(data.situation).toEqual(situation)
  })

  it('should can be updated product image', async () => {
    const image =
      '/www/Projects/Developer/Backend/delivery-backend/tmp/45ee1999b375360a55656f3684ab953e-natal.jpg'
    const id = '1'

    const updateImage = await productService.updateProductImage(id, image)

    expect(mockedProductRepository.updateProductImage).toHaveBeenCalledWith(
      id,
      image,
    )

    expect(updateImage.id).toEqual(id)
    expect(updateImage.image).toEqual(image)
  })
})
