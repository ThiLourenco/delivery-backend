/* eslint-disable no-undef */
import DeliveryManRepository from '../../repositories/DeliveryManRepository'
import { DeliveryManTypes } from '../../dtos/DeliveryManTypes'
import { DeliveryManService } from '../../services/DeliveryManService'
import { UserRole } from '@prisma/client'

const mockDeliveryMan: DeliveryManTypes[] = [
  {
    id: '123',
    name: 'John Smith',
    username: 'John',
    email: 'jhon@example.com',
    password: '123',
    phone: '552299999999',
    role: 'DELIVERY_MAN',
    address: {
      street: 'Street view',
      number: 'S/N',
      city: 'San Francisco',
      country: 'US',
      zipCode: '12345678',
    },
  },
]

jest.mock('../../repositories/DeliveryManRepository', () => {
  return {
    createDeliveryMan: jest.fn(
      (
        id: string,
        name: string,
        username: string,
        email: string,
        password: string,
        phone: string,
        _role: UserRole,
        _address?: {
          street: string
          number?: string
          city: string
          country: string
          zipCode: string
        },
      ): Promise<DeliveryManTypes> => {
        return Promise.resolve({
          id,
          name,
          username,
          email,
          password,
          phone,
          role: 'DELIVERY_MAN',
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

const mockedDeliveryRepository = jest.mocked(DeliveryManRepository)

describe('DeliveryManRepository', () => {
  let deliveryManService: DeliveryManService

  beforeEach(() => {
    deliveryManService = new DeliveryManService(mockedDeliveryRepository)
  })

  it('should create a deliveryMan', async () => {
    const userData: DeliveryManTypes = {
      id: '123',
      name: 'John Smith',
      username: 'John',
      email: 'jhon@example.com',
      password: '123',
      phone: '552299999999',
      role: 'DELIVERY_MAN',
      address: {
        street: 'Street view',
        number: 'S/N',
        city: 'San Francisco',
        country: 'US',
        zipCode: '12345678',
      },
    }

    const deliveryMan = await deliveryManService.execute(userData)

    expect(deliveryMan.id).toBe(userData.id)
    expect(deliveryMan.name).toBe(userData.name)
    expect(deliveryMan.email).toBe(userData.email)
    expect(deliveryMan.password).toBe(userData.password)
    expect(deliveryMan.phone).toBe(userData.phone)
    expect(deliveryMan.role).toBe(userData.role)
    expect(deliveryMan.address).toBe(userData.address)
    expect(deliveryMan.address?.street).toBe(userData.address?.street)
    expect(deliveryMan.address?.number).toBe(userData.address?.number)
    expect(deliveryMan.address?.city).toBe(userData.address?.city)
    expect(deliveryMan.address?.country).toBe(userData.address?.country)
    expect(deliveryMan.address?.zipCode).toBe(userData.address?.zipCode)
  })

  it('should be able to do login DeliveryMan', async () => {})

  it('should be able to update deliveryMan', async () => {})

  it('should be able to update orders DeliveryMan', async () => {})

  it('should be able to get orders DeliveryMan', async () => {})
})
