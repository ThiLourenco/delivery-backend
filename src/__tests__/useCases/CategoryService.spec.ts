/* eslint-disable no-undef */
import { CategoryService } from '../../services/CategoryService'
import categoryRepository from '../../repositories/CategoryRepository'
import { CategoryTypes } from '../../dtos/CategoryTypes'

const mockCategory: CategoryTypes[] = [
  {
    id: '1',
    name: 'Refrigerante',
  },
  {
    id: '2',
    name: 'Cerveja',
  },
]

jest.mock('../../repositories/CategoryRepository', () => {
  return {
    createCategory: jest
      .fn()
      .mockImplementation((name: string): Promise<CategoryTypes> => {
        return Promise.resolve({
          id: '1',
          name,
        })
      }),
    getCategories: jest.fn(() => Promise.resolve(mockCategory)),
    findCategoriesByProductId: jest
      .fn()
      .mockImplementation((id: string): Promise<CategoryTypes | null> => {
        if (id === '1') {
          return Promise.resolve({
            id: '1',
            name: 'Refrigerante',
          })
        } else {
          return Promise.resolve(null)
        }
      }),
    updateCategory: jest
      .fn()
      .mockImplementation(
        (id: string, name: string): Promise<CategoryTypes> => {
          return Promise.resolve({
            id: '123',
            name,
          })
        },
      ),
  }
})

const mockedCategoryRepository = jest.mocked(categoryRepository)

describe('CategoryRepository', () => {
  let categoryService: CategoryService

  beforeEach(() => {
    categoryService = new CategoryService(mockedCategoryRepository)
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

  it('should get all categories', async () => {
    const categories = await categoryService.findAllCategory()

    expect(categoryRepository.getCategories).toHaveBeenCalled()

    expect(categories).toEqual(mockCategory)
  })

  it('should return a category by Id', async () => {
    const categoryId = '1'
    const category = await categoryService.findAllProductByCategoryId(
      categoryId,
    )

    expect(
      mockedCategoryRepository.findCategoriesByProductId,
    ).toHaveBeenCalledWith(categoryId)
    expect(category).toStrictEqual(mockCategory[0])
  })

  it('should return null when no category is found', async () => {
    const categoryId = 'xpto'
    const category = await categoryService.findAllProductByCategoryId(
      categoryId,
    )

    expect(
      mockedCategoryRepository.findCategoriesByProductId,
    ).toHaveBeenCalledWith(categoryId)

    expect(category).toBeNull()
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
