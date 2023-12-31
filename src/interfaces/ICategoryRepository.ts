import { ProductsTypes } from 'dtos/ProductsTypes'
import { CategoryTypes } from '../dtos/CategoryTypes'

export interface ICategoryRepository {
  createCategory(name: string): Promise<CategoryTypes>

  getCategories(): Promise<CategoryTypes[]>

  findCategoriesByProductId(id: string): Promise<ProductsTypes[]>

  updateCategory(id: string, name: string): Promise<CategoryTypes>
}
