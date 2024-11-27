import { IServiceOptions } from "../config/interfaces/iServiceOptions";
import { IUserLoginDTO, IUserResponseDTO } from "../database/DTO/IuserDTOs";
import UserRepository from "../database/repository/userRepository";
import ErrorWithMessage from "../errors/errorWithMessage";
import { verifyPassword } from "../security/passwords";
import jsonwebtoken from "jsonwebtoken";

export default class AuthService {

    options:IServiceOptions
    constructor(options:IServiceOptions) {
        this.options=options
    }

    async login(loginData:IUserLoginDTO) {
        try {
             const user:any = await UserRepository.findByEmail(loginData.email, this.options);
             if (!user) {
                 throw new ErrorWithMessage('Unauthorized', 401);
             }
             const isPasswordValid = await verifyPassword(loginData.password, user.hashedPassword);
             if (!isPasswordValid) {
                 throw new ErrorWithMessage('Unauthorized', 401);
             }
             const secret= process.env.JWT_SECRET;
             if (!secret) {
                 throw new ErrorWithMessage('Something went wrong',500);
             }
             const token = jsonwebtoken.sign({ email: user.email, id: user.id }, secret, { expiresIn: '3h' });
             const userResponse:IUserResponseDTO = {
                 id: user.id,
                 firstName: user.firstName,
                 lastName: user.lastName,
                 email: user.email,
                 photoUrl: user.photoUrl,
                 token
             }
             return userResponse
             
        } catch (error) {
            throw error
            
        }
    }
}