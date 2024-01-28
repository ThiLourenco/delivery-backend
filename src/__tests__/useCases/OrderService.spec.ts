/* eslint-disable no-undef */
import { OrderService } from '../../services/OrderService'
import { OrderTypes } from '../../dtos/OrderTypes'
import OrderRepository from '../../repositories/OrderRepository'

jest.mock('../../repositories/OrderRepository')

describe('OrderService', () => {
  let orderService: OrderService

  beforeEach(() => {
    orderService = new OrderService(OrderRepository)
  })

  it('should create a new order', async () => {
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
      status: 'Em preparo',
    }

    const createOrderSpy = jest.spyOn(OrderRepository, 'createOrder')

    createOrderSpy.mockResolvedValue(mockOrder)

    const order = await orderService.execute(
      mockOrder.products,
      mockOrder.userId,
      mockOrder.totalAmount,
      mockOrder.discount!,
      mockOrder.status,
    )

    expect(createOrderSpy).toHaveBeenCalledWith(
      mockOrder.products,
      mockOrder.userId,
      mockOrder.totalAmount,
      mockOrder.discount,
      mockOrder.status,
    )

    expect(order).toEqual(mockOrder)
  })

  it('should return a order by user', async () => {
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

    const getOrderByUserSpy = jest.spyOn(OrderRepository, 'findOrderByUser')
    getOrderByUserSpy.mockResolvedValue(mockOrders)

    const orders = await orderService.findOrder(mockOrders[0].userId)

    expect(getOrderByUserSpy).toHaveBeenCalledWith(mockOrders[0].userId)
    expect(orders).toEqual(mockOrders)
    expect(orders[0].userId).toBe(mockOrders[0].userId)
  })

  it('should update order end date', async () => {
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
      status: 'Pedido Entregue',
    }
    const updateEndDateSpy = jest.spyOn(OrderRepository, 'updateEndDate')
    updateEndDateSpy.mockResolvedValue(mockOrder)

    const order = await orderService.updateEndDate(
      mockOrder.userId,
      mockOrder.id,
    )

    expect(updateEndDateSpy).toHaveBeenCalledWith(
      mockOrder.userId,
      mockOrder.id,
    )

    expect(order.status).toEqual(mockOrder.status)
    expect(order.userId).toEqual(mockOrder.userId)
    expect(order.id).toEqual(mockOrder.id)
  })

  it('should return all available orders', async () => {
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
        status: 'Em preparo',
      },
      {
        id: '12345',
        products: [
          {
            productId: '1234567',
            quantity: 2,
          },
        ],
        userId: '123',
        totalAmount: 200,
        discount: 0,
        status: 'Em preparo',
      },
    ]

    const getAllOrdersAvailableSpy = jest.spyOn(
      OrderRepository,
      'getAllOrdersAvailable',
    )

    getAllOrdersAvailableSpy.mockResolvedValue(mockOrders)

    const orders = await orderService.getAllOrders()

    expect(getAllOrdersAvailableSpy).toHaveBeenCalled()
    expect(orders).toEqual(mockOrders)
  })

  it('should return all unavailable orders', async () => {
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
        status: 'Em preparo',
      },
      {
        id: '12345',
        products: [
          {
            productId: '1234567',
            quantity: 2,
          },
        ],
        userId: '123',
        totalAmount: 200,
        discount: 0,
        status: 'Em preparo',
      },
    ]

    const getAllOrdersUnavailableSpy = jest.spyOn(
      OrderRepository,
      'getAllOrdersUnavailable',
    )

    getAllOrdersUnavailableSpy.mockResolvedValue(mockOrders)

    const orders = await orderService.getAllOrdersUnavailable()

    expect(getAllOrdersUnavailableSpy).toHaveBeenCalled()
    expect(orders).toEqual(mockOrders)
  })

  it('should return all orders completed', async () => {
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
        status: 'Em preparo',
      },
      {
        id: '12345',
        products: [
          {
            productId: '1234567',
            quantity: 2,
          },
        ],
        userId: '123',
        totalAmount: 200,
        discount: 0,
        status: 'Em preparo',
      },
    ]

    const getAllOrdersCompletedSpy = jest.spyOn(
      OrderRepository,
      'getAllOrdersCompleted',
    )

    getAllOrdersCompletedSpy.mockResolvedValue(mockOrders)

    const orders = await orderService.getAllOrdersCompleted()

    expect(getAllOrdersCompletedSpy).toHaveBeenCalled()
    expect(orders).toEqual(mockOrders)
  })
})
