import { ICategoryRepository } from '../interfaces/ICategoryRepository'

class CategoryService {
  constructor(private CategoryRepository: ICategoryRepository) {
    this.CategoryRepository = CategoryRepository
  }

  public async create(name: string) {
    return await this.CategoryRepository.createCategory(name)
  }

  public async findAllCategory() {
    return await this.CategoryRepository.getCategories()
  }

  public async findAllProductByCategoryId(id: string) {
    return await this.CategoryRepository.findCategoriesByProductId(id)
  }

  public async updateCategory(id: string, name: string) {
    return await this.CategoryRepository.updateCategory(id, name)
  }

  public async deleteCategory(id: string) {
    return await this.CategoryRepository.deleteCategory(id)
  }
}

export { CategoryService }
