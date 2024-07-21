/* eslint-disable no-undef */
import { DeliveryManService } from '../../services/DeliveryManService'
import { DeliveryManTypes } from '../../dtos/DeliveryManTypes'
import DeliveryManRepository from '../../repositories/DeliveryManRepository'
import { OrderTypes } from '../../dtos/OrderTypes'

jest.mock('../../repositories/DeliveryManRepository')

describe('DeliveryManService', () => {
  let deliveryManService: DeliveryManService

  beforeEach(() => {
    deliveryManService = new DeliveryManService(DeliveryManRepository)
  })

  it('should create a deliveryMan', async () => {
    const mockDeliveryMan: DeliveryManTypes = {
      id: '123',
      name: 'John Smith',
      username: 'John',
      email: 'john@example.com',
      password: '123',
      phone: '552299999999',
      role: 'DELIVERY_MAN',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      address: {
        street: 'Street view',
        number: 'S/N',
        city: 'San Francisco',
        country: 'US',
        zipCode: '12345678',
      },
    }

    const createDeliveryManSpy = jest.spyOn(
      DeliveryManRepository,
      'createDeliveryMan',
    )
    createDeliveryManSpy.mockResolvedValue(mockDeliveryMan)

    const deliveryMan = await deliveryManService.create(mockDeliveryMan)

    expect(createDeliveryManSpy).toHaveBeenCalledWith(
      mockDeliveryMan.name,
      mockDeliveryMan.email,
      mockDeliveryMan.username,
      mockDeliveryMan.password,
      mockDeliveryMan.phone,
      mockDeliveryMan.role,
      mockDeliveryMan.address,
    )
    expect(deliveryMan).toEqual(mockDeliveryMan)
  })

  it('should update a deliveryMan', async () => {
    const mockDeliveryMan: DeliveryManTypes = {
      id: '123',
      name: 'John Smith',
      username: 'John',
      email: 'john@example.com',
      password: '123',
      phone: '552299999999',
      isAdmin: false,
      role: 'DELIVERY_MAN',
      createdAt: new Date(),
      updatedAt: new Date(),
      address: {
        street: 'Street view',
        number: 'S/N',
        city: 'San Francisco',
        country: 'US',
        zipCode: '12345678',
      },
    }

    const updateDeliveryManSpy = jest.spyOn(
      DeliveryManRepository,
      'updateDeliveryMan',
    )
    updateDeliveryManSpy.mockResolvedValue(mockDeliveryMan)

    const deliveryMan = await deliveryManService.update(
      mockDeliveryMan.id!,
      mockDeliveryMan.name,
      mockDeliveryMan.phone,
    )

    expect(updateDeliveryManSpy).toHaveBeenCalledWith(
      mockDeliveryMan.id,
      mockDeliveryMan.name,
      mockDeliveryMan.phone,
    )
    expect(deliveryMan).toEqual(mockDeliveryMan)
  })

  it('should login a deliveryMan', async () => {
    const mockDeliveryMan: DeliveryManTypes = {
      id: '123',
      name: 'John Smith',
      username: 'John',
      email: 'john@example.com',
      password: '123',
      phone: '552299999999',
      isAdmin: false,
      role: 'DELIVERY_MAN',
      createdAt: new Date(),
      updatedAt: new Date(),
      address: {
        street: 'Street view',
        number: 'S/N',
        city: 'San Francisco',
        country: 'US',
        zipCode: '12345678',
      },
    }

    const loginDeliveryManSpy = jest.spyOn(
      DeliveryManRepository,
      'loginDeliveryMan',
    )
    loginDeliveryManSpy.mockResolvedValue(mockDeliveryMan)

    const deliveryMan = await deliveryManService.login(
      mockDeliveryMan.email,
      mockDeliveryMan.password,
    )

    expect(loginDeliveryManSpy).toHaveBeenCalledWith(
      mockDeliveryMan.email,
      mockDeliveryMan.password,
    )
    expect(deliveryMan).toEqual(mockDeliveryMan)
  })

  it('should update an order for a deliveryMan', async () => {
    const mockOrder: OrderTypes = {
      id: '1234',
      products: [
        {
          productId: '123456',
          quantity: 1,
        },
      ],
      userId: '123',
      totalAmount: 100,
      discount: 0,
      status: 'Em rota de entrega',
    }

    const updateOrderDeliveryManSpy = jest.spyOn(
      DeliveryManRepository,
      'updateOrderDeliveryMan',
    )
    updateOrderDeliveryManSpy.mockResolvedValue(mockOrder)

    const order = await deliveryManService.updateDeliveryOrder(
      mockOrder.userId,
      mockOrder.id,
    )

    expect(updateOrderDeliveryManSpy).toHaveBeenCalledWith(
      mockOrder.userId,
      mockOrder.id,
    )
    expect(order).toEqual(mockOrder)
  })

  it('should get orders for a deliveryMan', async () => {
    const mockOrders: OrderTypes[] = [
      {
        id: '1234',
        products: [
          {
            productId: '123456',
            quantity: 1,
          },
        ],
        userId: '123',
        totalAmount: 100,
        discount: 0,
        status: 'Em rota de entrega',
      },
    ]

    const getOrdersDeliveryManSpy = jest.spyOn(
      DeliveryManRepository,
      'getOrdersDeliveryMan',
    )
    getOrdersDeliveryManSpy.mockResolvedValue(mockOrders)

    const orders = await deliveryManService.getOrdersDelivery(
      mockOrders[0].userId,
    )

    expect(getOrdersDeliveryManSpy).toHaveBeenCalledWith(mockOrders[0].userId)
    expect(orders).toEqual(mockOrders)
  })
})
