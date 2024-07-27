import { CreateUserDTO, UserTypes } from '../dtos/UserTypes'
import { IUserRepository } from '../interfaces/IUserRepository'

class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private UserRepository: IUserRepository) {}

  public async create(user: CreateUserDTO): Promise<UserTypes> {
    const { id, username, name, email, phone, password, address, role } = user

    return await this.UserRepository.create(
      id,
      username,
      name,
      email,
      password,
      phone,
      role,
      address,
    )
  }

  public async login(email: string, password: string) {
    return await this.UserRepository.login(email, password)
  }

  public async findUserById(id: string): Promise<UserTypes | null> {
    return await this.UserRepository.getUser(id)
  }

  public async findAllUsers() {
    return await this.UserRepository.getAllUsers()
  }

  public async updateUserById(
    id: string,
    username: string,
    name: string,
    phone: string,
  ) {
    return await this.UserRepository.update(id, username, name, phone)
  }

  public async updateAddress(email: string, address: UserTypes['address']): Promise<void> {
    await this.UserRepository.updateAddress(email, address)
  }
  
  public async deleteUser(id: string): Promise<void> {
    return await this.UserRepository.delete(id)
  }
}

export { UserService }
