import { IUserResponseDTO } from "../../database/DTO/IuserDTOs";

export interface IRepositoryOptions {
    database: any,
    transaction:any,
    user?:IUserResponseDTO,
}