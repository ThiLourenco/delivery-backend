import { DeliveryManTypes } from './../dtos/DeliveryManTypes'
import { IDeliveryManRepository } from './../interfaces/IDeliveryManRepository'

class DeliveryManService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private DeliveryManRepository: IDeliveryManRepository) {}

  public async execute(
    deliveryMan: DeliveryManTypes,
  ): Promise<DeliveryManTypes> {
    const { name, username, email, password, role, phone, address } =
      deliveryMan

    return await this.DeliveryManRepository.createDeliveryMan(
      name,
      email,
      username,
      password,
      phone,
      role,
      address,
    )
  }

  public async update(id: string, name: string, phone: string) {
    return await this.DeliveryManRepository.updateDeliveryMan(id, name, phone)
  }

  public async login(email: string, password: string) {
    return await this.DeliveryManRepository.loginDeliveryMan(email, password)
  }

  public async updateDeliveryOrder(deliveryManId: string, orderId: string) {
    return await this.DeliveryManRepository.updateOrderDeliveryMan(
      deliveryManId,
      orderId,
    )
  }

  public async getOrdersDelivery(deliveryManId: string) {
    return await this.DeliveryManRepository.getOrdersDeliveryMan(deliveryManId)
  }
}

export { DeliveryManService }
