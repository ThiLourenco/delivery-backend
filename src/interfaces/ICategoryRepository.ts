import { CategoryTypes } from '../dtos/CategoryTypes'

export interface ICategoryRepository {
  createCategory(name: string): Promise<CategoryTypes>

  getCategories(): Promise<CategoryTypes[]>
}
