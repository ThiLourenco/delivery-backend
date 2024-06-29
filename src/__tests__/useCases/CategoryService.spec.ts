/* eslint-disable no-undef */
import { CategoryService } from '../../services/CategoryService'
import CategoryRepository from '../../repositories/CategoryRepository'
import { CategoryTypes } from '../../dtos/CategoryTypes'

jest.mock('../../repositories/CategoryRepository')

describe('CategoryRepository', () => {
  let categoryService: CategoryService

  beforeEach(() => {
    categoryService = new CategoryService(CategoryRepository)
  })

  it('should create a new category', async () => {
    const mockCategory: CategoryTypes = {
      id: '1',
      name: 'New Category',
    }

    const createCategorySpy = jest.spyOn(CategoryRepository, 'createCategory')

    createCategorySpy.mockResolvedValue(mockCategory)

    const category = await categoryService.create(mockCategory.name)

    expect(createCategorySpy).toHaveBeenCalledWith(mockCategory.name)

    expect(category.name).toBe(mockCategory.name)
  })

  it('should get all categories', async () => {
    const mockCategory: CategoryTypes[] = [
      {
        id: '123',
        name: 'Category Name',
      },
      {
        id: '124',
        name: 'Category Name 2',
      },
    ]

    const getAllCategorySpy = jest.spyOn(CategoryRepository, 'getCategories')
    getAllCategorySpy.mockResolvedValue(mockCategory)

    const categories = await categoryService.findAllCategory()

    expect(getAllCategorySpy).toHaveBeenCalled()

    expect(categories).toEqual(mockCategory)
  })

  it('should return a category by Id', async () => {
    const mockCategory: CategoryTypes[] = [
      {
        id: '123',
        name: 'Category Name',
      },
    ]

    const getCategoryByIdSpy = jest.spyOn(
      CategoryRepository,
      'findCategoriesByProductId',
    )
    getCategoryByIdSpy.mockResolvedValue(mockCategory)

    const category = await categoryService.findAllProductByCategoryId(
      mockCategory[0].id!,
    )

    expect(getCategoryByIdSpy).toHaveBeenCalledWith(mockCategory[0].id)
    expect(category[0]).toStrictEqual(mockCategory[0])
  })

  it('should update category name', async () => {
    const mockCategory: CategoryTypes = {
      id: '123',
      name: 'Updated Category Name',
    }

    const updateCategorySpy = jest.spyOn(CategoryRepository, 'updateCategory')
    updateCategorySpy.mockResolvedValue(mockCategory)

    const updateCategory = await categoryService.updateCategory(
      mockCategory.id!,
      mockCategory.name,
    )

    expect(updateCategory.id).toBe(mockCategory.id)
    expect(updateCategory.name).toBe(mockCategory.name)
  })

  it('should delete a category', async () => {
    const mockCategory: CategoryTypes = {
      id: '1dae449e-141f-4131-83a1-328704f1e9bd',
      name: 'teste',
    }

    const deleteCategorySpy = jest.spyOn(CategoryRepository, 'deleteCategory')
    deleteCategorySpy.mockResolvedValue()

    const deleteCategory = await categoryService.deleteCategory(
      mockCategory.id!,
    )

    expect(deleteCategory).toBeTruthy()
    expect(deleteCategory).toBe(mockCategory.id)
  })
})
