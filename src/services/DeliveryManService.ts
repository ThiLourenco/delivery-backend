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
}

export { DeliveryManService }
