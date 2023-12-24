import { IProductRepository } from '../interfaces/IProductRepository'

class ProductService {
  constructor(private ProductRepository: IProductRepository) {
    this.ProductRepository = ProductRepository
  }

  public async create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: boolean,
    category?: {
      name: string
    },
  ) {
    return await this.ProductRepository.create(
      name,
      description,
      image,
      price,
      situation,
      category,
    )
  }

  public async findProductByName(name: string) {
    const product = await this.ProductRepository.findByName(name)

    return product
  }

  public async findProductById(id: string) {
    const product = await this.ProductRepository.findById(id)

    return product
  }

  public async getAllProducts() {
    const products = await this.ProductRepository.findAllProducts()

    return products
  }

  public async updateCategory(categoryName: string, id: string) {
    const product = await this.ProductRepository.updateProductCategory(
      categoryName,
      id,
    )

    return product
  }
}

export { ProductService }
