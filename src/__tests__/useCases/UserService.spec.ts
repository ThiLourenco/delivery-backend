/* eslint-disable no-undef */
import { UserService } from '../../services/UserService'
import UserRepository from '../../repositories/UserRepository'
import { UserTypes, UserWithAddress } from '../../dtos/UserTypes'

jest.mock('../../repositories/UserRepository')

describe('UserRepository', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService(UserRepository)
  })

  it('should create a user ADM', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: true,
      role: 'ADMIN',
    }

    const createUserSpy = jest.spyOn(UserRepository, 'create')
    createUserSpy.mockResolvedValue(mockUser)

    const user = await userService.create(mockUser)

    expect(user.id).toBe(mockUser.id)
    expect(user.name).toBe(mockUser.name)
    expect(user.username).toBe(mockUser.username)
    expect(user.email).toBe(mockUser.email)
    expect(user.phone).toBe(mockUser.phone)
    expect(user.isAdmin).toBe(mockUser.isAdmin)
    expect(user.password).toBe(mockUser.password)
    expect(user.role).toBe(mockUser.role)
  })

  it('should create a user Client', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'CLIENT',
    }

    const createUserSpy = jest.spyOn(UserRepository, 'create')
    createUserSpy.mockResolvedValue(mockUser)

    const user = await userService.create(mockUser)

    expect(user.id).toBe(mockUser.id)
    expect(user.name).toBe(mockUser.name)
    expect(user.username).toBe(mockUser.username)
    expect(user.email).toBe(mockUser.email)
    expect(user.phone).toBe(mockUser.phone)
    expect(user.isAdmin).toBe(mockUser.isAdmin)
    expect(user.password).toBe(mockUser.password)
    expect(user.role).toBe(mockUser.role)
  })

  it('should create a user - Delivery Man', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'DELIVERY_MAN',
    }

    const createUserSpy = jest.spyOn(UserRepository, 'create')
    createUserSpy.mockResolvedValue(mockUser)

    const user = await userService.create(mockUser)

    expect(user.id).toBe(mockUser.id)
    expect(user.name).toBe(mockUser.name)
    expect(user.username).toBe(mockUser.username)
    expect(user.email).toBe(mockUser.email)
    expect(user.phone).toBe(mockUser.phone)
    expect(user.isAdmin).toBeFalsy()
    expect(user.password).toBe(mockUser.password)
    expect(user.role).toBe(mockUser.role)
  })

  it('should allow you to login - User ADM', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: true,
      role: 'ADMIN',
    }

    const loginSpy = jest.spyOn(UserRepository, 'login')
    loginSpy.mockResolvedValue(mockUser)

    const user = await userService.login(mockUser.email, mockUser.password)

    expect(user?.email).toStrictEqual(mockUser.email)
    expect(user?.password).toStrictEqual(mockUser.password)
  })

  it('should allow you to login - Client', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'CLIENT',
    }

    const loginSpy = jest.spyOn(UserRepository, 'login')
    loginSpy.mockResolvedValue(mockUser)

    const user = await userService.login(mockUser.email, mockUser.password)

    expect(user?.email).toStrictEqual(mockUser.email)
    expect(user?.password).toStrictEqual(mockUser.password)
  })

  it('should allow you to login - Delivery Man', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'DELIVERY_MAN',
    }

    const loginSpy = jest.spyOn(UserRepository, 'login')
    loginSpy.mockResolvedValue(mockUser)

    const user = await userService.login(mockUser.email, mockUser.password)

    expect(user?.email).toStrictEqual(mockUser.email)
    expect(user?.password).toStrictEqual(mockUser.password)
  })

  it('should return a user by Id', async () => {
    const mockUser: UserWithAddress[] = [
      {
        id: '1',
        username: 'John',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '55 555-5555',
        password: '123',
        role: 'CLIENT',
        isAdmin: false,
        address: {
          street: 'St. 15aver',
          number: '23',
          city: 'San Francisco',
          country: 'United States',
          zipCode: '29800000',
        },
      },
    ]

    const getUserByIdSpy = jest.spyOn(UserRepository, 'getUser')
    getUserByIdSpy.mockResolvedValue(mockUser[0])

    const user = await userService.findUserById(mockUser[0].id)

    expect(getUserByIdSpy).toHaveBeenCalledWith(mockUser[0].id)
    expect(user?.id).toBe(mockUser[0].id)
  })

  it('should return all Users', async () => {
    const mockUser: UserTypes[] = [
      {
        id: '123',
        name: 'John',
        username: 'John',
        email: 'john@example.com',
        phone: '123',
        password: '123',
        isAdmin: false,
        role: 'CLIENT',
      },
      {
        id: '1234',
        name: 'Jane',
        username: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123',
        password: '123',
        isAdmin: false,
        role: 'CLIENT',
      },
    ]

    const getUsersSpy = jest.spyOn(UserRepository, 'getAllUsers')
    getUsersSpy.mockResolvedValue(mockUser)

    const user = await userService.findAllUsers()

    expect(getUsersSpy).toHaveBeenCalled()
    expect(user).toEqual(mockUser)
  })

  it('should allow update user by Id', async () => {
    const mockUser: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'CLIENT',
    }

    const updateUserSpy = jest.spyOn(UserRepository, 'update')
    updateUserSpy.mockResolvedValue(mockUser)

    const updateUser = await userService.updateUserById(
      mockUser.id,
      mockUser.name,
      mockUser.username,
      mockUser.phone,
    )

    expect(updateUserSpy).toHaveBeenCalledWith(
      mockUser.id,
      mockUser.name,
      mockUser.username,
      mockUser.phone,
    )

    expect(updateUser.id).toBe(mockUser.id)
    expect(updateUser.name).toBe(mockUser.name)
    expect(updateUser.phone).toBe(mockUser.phone)
    expect(updateUser.username).toBe(mockUser.username)
  })

  it('should allow deleting user, if not is admin', async () => {
    const mockUserId = '1dae449e-141f-4131-83a1-328704f1e9bd'

    const deleteUserSpy = jest.spyOn(UserRepository, 'delete')

    await userService.deleteUser(mockUserId)

    expect(deleteUserSpy).toHaveBeenCalledWith(mockUserId)
  })
})
