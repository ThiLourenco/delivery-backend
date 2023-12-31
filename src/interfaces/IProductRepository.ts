import { ProductsTypes } from '../dtos/ProductsTypes'

export interface IProductRepository {
  create(
    name: string,
    description: string,
    image: string,
    price: number,
    situation: boolean,
    category?: {
      name: string
    },
  ): Promise<ProductsTypes>
  findByName(name: string): Promise<ProductsTypes | null>
  findById(id: string): Promise<ProductsTypes | null>
  findAllProducts(): Promise<ProductsTypes[]>
  updateProductCategory(name: string, id: string): Promise<ProductsTypes>

  updateProduct(
    id: string,
    name: string,
    description: string,
    price: number,
    situation: boolean,
  ): Promise<ProductsTypes>
}
