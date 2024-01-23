/* eslint-disable no-undef */
import { UserService } from '../../services/UserService'
import UserRepository from '../../repositories/UserRepository'
import { UserTypes } from '../../dtos/UserTypes'
import { UserRole } from '@prisma/client'

const mockUser: UserTypes[] = [
  {
    id: '123',
    name: 'John',
    username: 'John',
    email: 'john@example.com',
    phone: '123',
    password: '123',
    isAdmin: true,
    role: 'ADMIN',
    address: {
      city: 'San Francisco',
      country: 'US',
      street: 'San Francisco',
      zipCode: '123',
      number: '123',
    },
  },
  {
    id: '123',
    name: 'John',
    username: 'John',
    email: 'john@example.com',
    phone: '123',
    password: '123',
    isAdmin: false,
    role: 'CLIENT',
    address: {
      city: 'San Francisco',
      country: 'US',
      street: 'San Francisco',
      zipCode: '123',
      number: '123',
    },
  },
  {
    id: '123',
    name: 'John',
    username: 'John',
    email: 'john@example.com',
    phone: '123',
    password: '123',
    isAdmin: false,
    role: 'DELIVERY_MAN',
    address: {
      city: 'San Francisco',
      country: 'US',
      street: 'San Francisco',
      zipCode: '123',
      number: '123',
    },
  },
]

jest.mock('../../repositories/UserRepository', () => {
  return {
    createUser: jest.fn(
      (
        id: string,
        name: string,
        username: string,
        email: string,
        phone: string,
        password: string,
        _isAdmin: boolean,
        _role: UserRole,
        _address: {
          city: string
          country: string
          street: string
          zipCode: string
          number: string
        },
      ): Promise<UserTypes> => {
        return Promise.resolve({
          id,
          name,
          username,
          email,
          phone,
          password,
          role: 'ADMIN',
          isAdmin: false,
          address: {
            city: 'San Francisco',
            country: 'US',
            street: 'San Francisco',
            zipCode: '123',
            number: '123',
          },
        })
      },
    ),
    login: jest.fn(
      (email: string, password: string): Promise<UserTypes | null> => {
        const user = mockUser.find(
          (u) => u.email === email && u.password === password,
        )
        return Promise.resolve(user || null)
      },
    ),
    getUser: jest.fn((id: string): Promise<UserTypes | null> => {
      if (id === '1') {
        return Promise.resolve({
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
        })
      } else {
        return Promise.resolve(null)
      }
    }),
    getUsers: jest.fn(() => Promise.resolve(mockUser)),
    updateUser: jest.fn(
      (
        id: string,
        name: string,
        username: string,
        email: string,
        phone: string,
        password: string,
        _isAdmin: boolean,
        _role: UserRole,
        _address: {
          city: string
          country: string
          street: string
          zipCode: string
          number: string
        },
      ): Promise<UserTypes> => {
        return Promise.resolve({
          id: '123',
          name: 'Jane Doe',
          username: 'JaneDoe',
          email: 'jane@example',
          phone: '550223938232',
          password: '123456',
          role: 'ADMIN',
          isAdmin: false,
          address: {
            city: 'San Francisco',
            country: 'US',
            street: 'San Francisco',
            zipCode: '123',
            number: '123',
          },
        })
      },
    ),
  }
})

const mockedUserRepository = jest.mocked(UserRepository)

describe('UserRepository', () => {
  let userService: UserService

  beforeEach(() => {
    userService = new UserService(mockedUserRepository)
  })

  it('should create a new user', async () => {
    const userData: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'ADMIN',
    }

    const user = await userService.execute(userData)

    expect(user.id).toBe(userData.id)
    expect(user.name).toBe(userData.name)
    expect(user.username).toBe(userData.username)
    expect(user.email).toBe(userData.email)
    expect(user.phone).toBe(userData.phone)
    expect(user.password).toBe(userData.password)
    expect(user.isAdmin).toBe(userData.isAdmin)
    expect(user.role).toBe(userData.role)
  })

  it('should allow you to login', async () => {
    const userData: UserTypes = {
      id: '123',
      name: 'John',
      username: 'John',
      email: 'john@example.com',
      phone: '123',
      password: '123',
      isAdmin: false,
      role: 'ADMIN',
    }

    mockedUserRepository.login.mockResolvedValue(userData)

    const user = await userService.login(userData.email, userData.password)

    expect(user?.email).toBe(userData.email)
    expect(user?.password).toBe(userData.password)
  })

  it('should return a user by Id', async () => {
    const userId = '1'
    const user = await userService.findUserById(userId)

    expect(mockedUserRepository.getUser).toHaveBeenCalledWith(userId)
    expect(user?.id).toBe(userId)
  })

  it('should return null when the user id not fount by Id', async () => {
    const userId = 'not-found'
    const user = await userService.findUserById(userId)

    expect(mockedUserRepository.getUser).toHaveBeenCalledWith(userId)
    expect(user).toBeNull()
  })

  it('should return all Users', async () => {
    const user = await userService.findAllUsers()

    expect(mockedUserRepository.getUsers).toHaveBeenCalled()
    expect(user).toEqual(mockUser)
  })

  it('should allow update user by Id', async () => {
    const id = '123'
    const name = 'Jane Doe'
    const username = 'JaneDoe'
    const phone = '550223938232'

    const updateUser = await userService.updateUserById(
      id,
      name,
      username,
      phone,
    )

    expect(mockedUserRepository.updateUser).toHaveBeenCalledWith(
      id,
      name,
      username,
      phone,
    )

    expect(updateUser.id).toBe(id)
    expect(updateUser.name).toBe(name)
    expect(updateUser.phone).toBe(phone)
    expect(updateUser.username).toBe(username)
  })
})
