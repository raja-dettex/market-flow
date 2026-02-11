import { UserModel } from "../db/schema/user";
import { IUser, IUserDTO, IUserUpdateDTO } from "../db/types";

export interface IUserRepository { 
    addUser: (user: IUserDTO) => Promise<IUser>;
    updateUser: (user: IUserUpdateDTO, id: string) => Promise<void>;
    getUserById: ( id: string) => Promise<IUser| null>; 
    getUserByGoogleId: (googleId: string) => Promise<IUser | undefined | null>
}



export class UserRepository implements IUserRepository { 
    async addUser(user: IUserDTO) :  Promise<IUser> {
        const userToBeSaved = {...user, id: Math.random().toString()}; 
        const userCreated = await new UserModel(userToBeSaved).save();
        return userCreated;
    }   

    async updateUser(user: IUserUpdateDTO, id: string) : Promise<void> { 
        await UserModel.findByIdAndUpdate(id, user);
        return;
    }

    async getUserById(id: string):  Promise<IUser | null> { 
        console.log('getting user by id')
        return await UserModel.findById(id)
    }

    async getUserByGoogleId(googleId : string): Promise<IUser | undefined | null> { 
        return await UserModel.findOne({googleSSOId: googleId});
    }
}