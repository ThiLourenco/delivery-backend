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
        role: UserRole,
        address?: {
          street: string
          number?: string
          city: string
          country: string
          zipCode: string
        },
      ): Promise<DeliveryManTypes> => {
        return Promise.resolve({
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
        })
      },
    ),
    loginDeliveryMan: jest.fn(
      (email: string, password: string): Promise<DeliveryManTypes | null> => {
        const delivery = mockDeliveryMan.find(
          (u) => u.email === email && u.password === password,
        )
        return Promise.resolve(delivery || null)
      },
    ),
  }
})

const mockedDeliveryRepository = jest.mocked(DeliveryManRepository)

describe('DeliveryManRepository', () => {
  let deliveryManService: DeliveryManService

  beforeAll(() => {
    deliveryManService = new DeliveryManService(mockedDeliveryRepository)
  })

  it('should create a deliveryMan', async () => {
    const deliveryMan = await deliveryManService.execute(mockDeliveryMan[0])

    expect(deliveryMan.name).toBe(mockDeliveryMan[0].name)
    expect(deliveryMan.username).toBe(mockDeliveryMan[0].username)
    expect(deliveryMan.id).toBe(mockDeliveryMan[0].id)
    expect(deliveryMan.email).toBe(mockDeliveryMan[0].email)
    expect(deliveryMan.password).toBe(mockDeliveryMan[0].password)
    expect(deliveryMan.phone).toBe(mockDeliveryMan[0].phone)
    expect(deliveryMan.role).toBe(mockDeliveryMan[0].role)
    expect(deliveryMan.address?.street).toBe(mockDeliveryMan[0].address?.street)
    expect(deliveryMan.address?.number).toBe(mockDeliveryMan[0].address?.number)
    expect(deliveryMan.address?.city).toBe(mockDeliveryMan[0].address?.city)
    expect(deliveryMan.address?.country).toBe(
      mockDeliveryMan[0].address?.country,
    )
    expect(deliveryMan.address?.zipCode).toBe(
      mockDeliveryMan[0].address?.zipCode,
    )
  })

  it('should be able to do login DeliveryMan', async () => {})

  it('should be able to update deliveryMan', async () => {})

  it('should be able to update orders DeliveryMan', async () => {})

  it('should be able to get orders DeliveryMan', async () => {})
})
