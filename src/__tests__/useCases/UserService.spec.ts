/* eslint-disable no-undef */
import { UserService } from '../../services/UserService'
import UserRepository from '../../repositories/UserRepository'
import { UserTypes, CreateUserDTO, UserWithAddress } from '../../dtos/UserTypes'
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
    createUser: jest.fn().mockImplementation(
      (
        id: string,
        name: string,
        username: string,
        email: string,
        phone: string,
        password: string,
        isAdmin: boolean,
        role: UserRole,
        address: {
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
})
