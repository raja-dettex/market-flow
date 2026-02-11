import { IUser, IUserDTO, IUserUpdateDTO } from "../db/types";
import { IUserRepository } from "../repository/user.repository";


export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async createUser(user: IUserDTO): Promise<IUser> {
    return await this.userRepository.addUser(user);
  }

  async updateUser(user: IUserUpdateDTO, id: string): Promise<void> {
    await this.userRepository.updateUser(user, id);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return this.userRepository.getUserById(id);
  }

}
