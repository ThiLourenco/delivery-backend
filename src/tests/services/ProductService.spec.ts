/* eslint-disable no-undef */
import { ProductService } from '../../services/ProductService'
import productRepository from '../../repositories/ProductRepository'
import { ProductsTypes } from '../../dtos/ProductsTypes'

// Mock do ProductRepository
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
    // Adicione outros métodos conforme necessário
    findByName: jest
      .fn()
      .mockImplementation((name: string): Promise<ProductsTypes | null> => {
        if (name === 'Existing Product') {
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
  }
})

describe('ProductService', () => {
  let productService: ProductService

  beforeEach(() => {
    // Crie uma nova instância do ProductService com o mock do ProductRepository
    productService = new ProductService(productRepository as any) // Cast para any para evitar erros de tipo
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

    // Passe os argumentos separadamente conforme a definição do método create
    const product = await productService.create(
      productData.name,
      productData.description,
      productData.image,
      productData.price,
      productData.situation,
      productData.category,
    )

    // Expectativas do teste
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

  // Adicione outros testes conforme necessário
})
