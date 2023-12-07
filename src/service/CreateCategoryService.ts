import { ICategoryRepository } from '../interfaces/ICategoryRepository'

class CreateCategoryService {
  constructor(private CategoryRepository: ICategoryRepository) {
    this.CategoryRepository = CategoryRepository
  }

  public async execute(name: string) {
    return await this.CategoryRepository.createCategory(name)
  }

  public async findAllCategory() {
    return await this.CategoryRepository.getCategories()
  }
}

export { CreateCategoryService }
