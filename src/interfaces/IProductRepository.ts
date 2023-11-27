import { ProductsTypes } from '../types/ProductsTypes'

export interface IProductRepository {
  create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: string,
    category?: {
      name: string
    },
  ): Promise<ProductsTypes>
}
