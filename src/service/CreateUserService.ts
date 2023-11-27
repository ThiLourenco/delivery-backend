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
    const user = await this.UserRepository.create(
      id,
      username,
      name,
      email,
      password,
      phone,
    )

    return user
  }
}

export { CreateUserService }
