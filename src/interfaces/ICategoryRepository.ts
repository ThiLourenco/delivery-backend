import { CategoryTypes } from '../dtos/CategoryTypes'

export interface ICategoryRepository {
  createCategory(name: string): Promise<CategoryTypes>

  getCategories(): Promise<CategoryTypes[]>

  findCategoryByName(name: string): Promise<CategoryTypes | null>

  findCategoriesByProductId(id: string): Promise<CategoryTypes[]>

  updateCategory(id: string, name: string): Promise<CategoryTypes>

  deleteCategory(id: string): Promise<void>
}
