import { IUser, IUserDTO } from "./db/types";
import { IUserRepository } from "./repository/user.repository";
import { UserService } from "./services/user.service";

export class AuthService { 
    constructor(
        private readonly userRepository : IUserRepository,
        private readonly userService: UserService
    ) { }

    async authenticateUserWithgoogleSSO(id: string, user: IUserDTO): Promise<IUser> { 
        // check wheather exists if exists throw exception
        const existingUser = await this.userRepository.getUserByGoogleId(id);
        if (existingUser !== undefined && existingUser !== null) { 
            return existingUser;
        }
        return await this.userService.createUser(user)
    }
}