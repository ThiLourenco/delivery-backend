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
    create: jest
      .fn()
      .mockImplementation(
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
    findByName: jest
      .fn()
      .mockImplementation(
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
    findById: jest
      .fn()
      .mockImplementation((id: string): Promise<ProductsTypes | null> => {
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
  }
})

describe('ProductService', () => {
  let productService: ProductService

  beforeEach(() => {
    // Create a new instance of ProductService with mock ProductRepository
    productService = new ProductService(productRepository)
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

    expect(productRepository.create).toHaveBeenCalledWith(
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

    expect(productRepository.findByName).toHaveBeenCalledWith(productName)
    expect(product).toHaveProperty('id', '1')
    expect(product?.name).toBe(productName)
  })

  it('should return null when the product does not exists', async () => {
    const productName = 'Non-Existing Product'
    const product = await productService.findProductByName(productName)

    expect(productRepository.findByName).toHaveBeenCalledWith(productName)
    expect(product).toBeNull()
  })

  it('should return a product when it exists by Id', async () => {
    const productId = '1'
    const product = await productService.findProductById(productId)

    expect(productRepository.findById).toHaveBeenCalledWith(productId)
    expect(product?.id).toBe(productId)
  })

  it('should return null when the product is not found by id', async () => {
    const productId = 'No-Exists-Product'
    const product = await productService.findProductById(productId)

    expect(productRepository.findById).toHaveBeenCalledWith(productId)
    expect(product).toBeNull()
  })

  it('should return all products', async () => {
    const products = await productService.getAllProducts()

    expect(productRepository.findAllProducts).toHaveBeenCalled()
    expect(products).toEqual(mockProducts)
  })
})
