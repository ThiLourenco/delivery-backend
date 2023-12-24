import { UserTypes } from '../dtos/UserTypes'
import { IUserRepository } from '../interfaces/IUserRepository'

class UserService {
  constructor(private UserRepository: IUserRepository) {
    this.UserRepository = UserRepository
  }

  public async execute(
    id: string,
    username: string,
    name: string,
    email: string,
    phone: string,
    password: string,
    address: {
      street: string
      number: string
      city: string
      state: string
      zipCode: string
    },
  ) {
    return await this.UserRepository.createUser(
      id,
      username,
      name,
      email,
      password,
      phone,
      address,
    )
  }

  public async login(email: string, password: string) {
    return await this.UserRepository.login(email, password)
  }

  public async findUserById(id: string): Promise<UserTypes | null> {
    return await this.UserRepository.getUser(id)
  }

  public async findUserByEmail(email: string): Promise<UserTypes | null> {
    return await this.UserRepository.getByEmail(email)
  }

  public async findAllUsers() {
    return await this.UserRepository.getUsers()
  }
}

export { UserService }
