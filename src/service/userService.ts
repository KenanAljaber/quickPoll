import { IServiceOptions } from "../config/interfaces/iServiceOptions";
import SequelizeRepository from "../config/sequelizeRepository";
import { IUserRegisterDTO, IUserUpdateDTO } from "../database/DTO/IuserDTOs";
import UserRepository from "../database/repository/userRepository";

export default class UserService {
    options:IServiceOptions;

    constructor(options:IServiceOptions) {
        this.options=options;
    }



    async findByEmail(email: string, options: IServiceOptions) {
        try {
            const user = await UserRepository.findByEmail(email, options);
            return user
            
        } catch (error) {
            throw error
        }
        
    }


    async findById(id: string, options: IServiceOptions) {
        try {
            const user = await UserRepository.findById(id, options);
            return user
            
        } catch (error) {
            throw error
        }
        
    }

    async update(id: string, data: IUserUpdateDTO, options: IServiceOptions) {
        const transaction= await SequelizeRepository.getTransaction(options);
        try {
            const user = await UserRepository.update(id, data, { ...options, transaction });
            await SequelizeRepository.commitTransaction(options);
            return user
            
        } catch (error) {
            await SequelizeRepository.rollbackTransaction(options);
            throw error
        }
        
    }

    async delete(id: string, options: IServiceOptions) {
        const transaction= await SequelizeRepository.getTransaction(options);
        try {
            const user = await UserRepository.delete(id, { ...options, transaction });
            await SequelizeRepository.commitTransaction(options);
            return user
            
        } catch (error) {
            await SequelizeRepository.rollbackTransaction(options);
            throw error
        }
        
    }


    async findAll(filter: any, offset: number = 0, limit: number = 10, options: IServiceOptions) {
        try {
            const users = await UserRepository.findAll(filter, offset, limit, options);
            return users
            
        } catch (error) {
            throw error
        }
        
    }

}