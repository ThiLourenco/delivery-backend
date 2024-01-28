/* eslint-disable no-undef */
import { ProductService } from '../../services/ProductService'
import ProductRepository from '../../repositories/ProductRepository'
import { ProductsTypes } from '../../dtos/ProductsTypes'

jest.mock('../../repositories/ProductRepository')

describe('ProductService', () => {
  let productService: ProductService

  beforeEach(() => {
    productService = new ProductService(ProductRepository)
  })

  it('should create a product successfully', async () => {
    const mockProduct: ProductsTypes = {
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

    const createProductSpy = jest.spyOn(ProductRepository, 'create')
    createProductSpy.mockResolvedValue(mockProduct)

    const product = await productService.create(
      mockProduct.name,
      mockProduct.description,
      mockProduct.image,
      mockProduct.price,
      mockProduct.situation,
      mockProduct.category,
    )

    expect(createProductSpy).toHaveBeenCalledWith(
      mockProduct.name,
      mockProduct.description,
      mockProduct.image,
      mockProduct.price,
      mockProduct.situation,
      mockProduct.category,
    )
    expect(product).toHaveProperty('id', '1')
    expect(product.name).toBe(mockProduct.name)
    expect(product.description).toBe(mockProduct.description)
    expect(product.image).toBe(mockProduct.image)
    expect(product.price).toBe(mockProduct.price)
    expect(product.situation).toBe(mockProduct.situation)
    expect(product.category).toEqual(mockProduct.category)
  })

  it('should return a product by name when it exists', async () => {
    const mockProduct: ProductsTypes = {
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

    const getProductByNameSpy = jest.spyOn(ProductRepository, 'findByName')

    getProductByNameSpy.mockResolvedValue(mockProduct)

    const product = await productService.findProductByName(mockProduct.name)

    expect(getProductByNameSpy).toHaveBeenCalledWith(mockProduct.name)
    expect(product).toHaveProperty('id', '1')
    expect(product?.name).toBe(mockProduct.name)
  })

  it('should return a product when it exists by Id', async () => {
    const mockProduct: ProductsTypes = {
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

    const getProductByIdSpy = jest.spyOn(ProductRepository, 'findById')
    getProductByIdSpy.mockResolvedValue(mockProduct)

    const product = await productService.findProductById(mockProduct.id)

    expect(getProductByIdSpy).toHaveBeenCalledWith(mockProduct.id)
    expect(product?.id).toBe(mockProduct.id)
  })

  it('should return all products', async () => {
    const mockProduct: ProductsTypes[] = [
      {
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        image: 'test-image.png',
        price: 100,
        situation: true,
        category: {
          name: 'Test Category',
        },
      },
      {
        id: '2',
        name: 'Test Product 2',
        description: 'Test Description',
        image: 'test-image.png',
        price: 100,
        situation: true,
        category: {
          name: 'Test Category',
        },
      },
    ]

    const getAllProductSpy = jest.spyOn(ProductRepository, 'findAllProducts')
    getAllProductSpy.mockResolvedValue(mockProduct)

    const products = await productService.getAllProducts()

    expect(getAllProductSpy).toHaveBeenCalled()
    expect(products).toEqual(mockProduct)
  })

  it('should update product category', async () => {
    const mockProduct: ProductsTypes = {
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

    const updateProductCategorySpy = jest.spyOn(
      ProductRepository,
      'updateProductCategory',
    )

    updateProductCategorySpy.mockResolvedValue(mockProduct)

    const updatedProduct = await productService.updateCategory(
      mockProduct.id,
      mockProduct.name,
    )

    expect(updateProductCategorySpy).toHaveBeenCalledWith(
      mockProduct.id,
      mockProduct.name,
    )
    expect(updatedProduct.category?.name).toBe(mockProduct.category?.name)
  })

  it('should update products data', async () => {
    const mockProduct: ProductsTypes = {
      id: '1',
      name: 'Coca-Cola',
      description: 'Updated description',
      image: 'test-image.png',
      price: 100,
      situation: true,
      category: {
        name: 'Test Category',
      },
    }

    const updateProductSpy = jest.spyOn(ProductRepository, 'updateProduct')
    updateProductSpy.mockResolvedValue(mockProduct)

    const product = await productService.updateProduct(
      mockProduct.name,
      mockProduct.description,
      mockProduct.image,
      mockProduct.price,
      mockProduct.situation,
    )

    expect(updateProductSpy).toHaveBeenCalledWith(
      mockProduct.name,
      mockProduct.description,
      mockProduct.image,
      mockProduct.price,
      mockProduct.situation,
    )

    expect(product.name).toEqual(mockProduct.name)
    expect(product.description).toEqual(mockProduct.description)
    expect(product.image).toEqual(mockProduct.image)
    expect(product.price).toEqual(mockProduct.price)
    expect(product.situation).toEqual(mockProduct.situation)
  })

  it('should can be updated product image', async () => {
    const mockProduct: ProductsTypes = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      image:
        '/www/Projects/Developer/Backend/delivery-backend/tmp/45ee1999b375360a55656f3684ab953e-natal.jpg',
      price: 100,
      situation: true,
      category: {
        name: 'Test Category',
      },
    }

    const updateProductImageSpy = jest.spyOn(
      ProductRepository,
      'updateProductImage',
    )

    updateProductImageSpy.mockResolvedValue(mockProduct)

    const updateImage = await productService.updateProductImage(
      mockProduct.id,
      mockProduct.image,
    )

    expect(updateProductImageSpy).toHaveBeenCalledWith(
      mockProduct.id,
      mockProduct.image,
    )

    expect(updateImage.id).toEqual(mockProduct.id)
    expect(updateImage.image).toEqual(mockProduct.image)
  })
})
