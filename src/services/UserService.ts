import { CreateUserDTO, UserTypes } from '../dtos/UserTypes'
import { IUserRepository } from '../interfaces/IUserRepository'

class UserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private UserRepository: IUserRepository) {}

  public async execute(user: CreateUserDTO): Promise<UserTypes> {
    const { id, username, name, email, phone, password, address } = user

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

  public async findAllUsers() {
    return await this.UserRepository.getUsers()
  }
}

export { UserService }
