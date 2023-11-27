import { IProductRepository } from '../interfaces/IProductRepository'

class CreateProductService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private ProductRepository: IProductRepository) {}

  public async create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: string,
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
}

export { CreateProductService }
