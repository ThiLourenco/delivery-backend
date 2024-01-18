/* eslint-disable no-undef */
import { CategoryService } from '../../services/CategoryService'
import categoryRepository from '../../repositories/CategoryRepository'
import { CategoryTypes } from '../../dtos/CategoryTypes'

jest.mock('../../repositories/CategoryRepository', () => {
  return {
    create: jest
      .fn()
      .mockImplementation((name: string): Promise<CategoryTypes> => {
        return Promise.resolve({
          id: '1',
          name,
        })
      }),
    update: jest
      .fn()
      .mockImplementation(
        (id: string, name: string): Promise<CategoryTypes> => {
          return Promise.resolve({
            id: '1',
            name,
          })
        },
      ),
  }
})

describe('CategoryRepository', () => {
  let categoryService: CategoryService

  beforeEach(() => {
    categoryService = new CategoryService(categoryRepository as any)
  })

  it('should create a new category', async () => {
    const categoryData: CategoryTypes = {
      id: '1',
      name: 'Category name',
    }

    const category = await categoryService.execute(categoryData.name)

    expect(categoryRepository.createCategory).toHaveBeenCalledWith(
      categoryData.name,
    )

    expect(category.name).toBe(categoryData.name)
  })

  it('should update category name', async () => {
    const categoryData: CategoryTypes = {
      id: '123',
      name: 'Updated Category Name',
    }

    const updateCategory = await categoryService.updateCategory(
      categoryData.id!,
      categoryData.name,
    )

    expect(updateCategory.id).toBe(categoryData.id)
    expect(updateCategory.name).toBe(categoryData.name)
  })
})
