import { UserTypes } from '../dtos/UserTypes'
import { IUserRepository } from '../interfaces/IUserRepository'

class CreateUserService {
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
  ) {
    return await this.UserRepository.createUser(
      id,
      username,
      name,
      email,
      password,
      phone,
    )
  }

  public async findUserById(id: string): Promise<UserTypes | null> {
    return await this.UserRepository.getUser(id)
  }

  public async findAllUsers() {
    return await this.UserRepository.getUsers()
  }
}

export { CreateUserService }
