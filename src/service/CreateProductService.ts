import { IProductRepository } from '../interfaces/IProductRepository'

class CreateProductService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private ProductRepository: IProductRepository) {}

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
    const product = await this.ProductRepository.create(
      name,
      description,
      image,
      price,
      situation,
      category,
    )

    return product
  }

  public async findProductByName(name: string) {
    const product = await this.ProductRepository.findByName(name)

    return product
  }

  public async findProductById(id: string) {
    const product = await this.ProductRepository.findById(id)

    return product
  }
}

export { CreateProductService }
