import { IUserRepository } from '../interfaces/IUserRepository'

class CreateUserService {
  // eslint-disable-next-line no-useless-constructor
  constructor(private UserRepository: IUserRepository) {}

  public async execute(
    id: string,
    username: string,
    name: string,
    email: string,
    phone: string,
    password: string,
  ) {
    const user = await this.UserRepository.createUser(
      id,
      username,
      name,
      email,
      password,
      phone,
    )

    return user
  }

  public async findUserById(id: string) {
    const userById = await this.UserRepository.getUser(id)

    return userById
  }

  public async findAllUsers() {
    const users = await this.UserRepository.getUsers()

    return users
  }
}

export { CreateUserService }
