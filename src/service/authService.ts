import { IServiceOptions } from "../config/interfaces/iServiceOptions";
import SequelizeRepository from "../config/sequelizeRepository";
import {
  IUserLoginDTO,
  IUserRegisterDTO,
  IUserResponseDTO,
} from "../database/DTO/IuserDTOs";
import { RoleRepository } from "../database/repository/roleRepository";
import UserRepository from "../database/repository/userRepository";
import ErrorWithMessage from "../errors/errorWithMessage";
import { hashPassword, verifyPassword } from "../security/passwords";
import jsonwebtoken from "jsonwebtoken";

export default class AuthService {
  options: IServiceOptions;
  constructor(options: IServiceOptions) {
    this.options = options;
  }

  async register(userData: IUserRegisterDTO): Promise<IUserResponseDTO> {
    const transaction = await SequelizeRepository.getTransaction(this.options);
    try {
      const alreadyExists = await UserRepository.findByEmail(
        userData.email,
        this.options
      );
      if (alreadyExists) {
        throw new ErrorWithMessage("User already exists", 400);
      }
      userData.hashedPassword = await hashPassword(userData.hashedPassword);
      const role = await RoleRepository.findByRole("user", this.options);
      userData.email = userData.email.toLowerCase();
      userData.firstName = this.capitalizeFirstLetter(userData.firstName);
      userData.lastName = this.capitalizeFirstLetter(userData.lastName);
      const user = await this.options.database.user.create(
        { ...userData, roleId: role?.id },
        { transaction }
      );
      await SequelizeRepository.commitTransaction(this.options);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoUrl: user.photoUrl,
        token: user.token,
      };
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(this.options);
      throw error;
    }
  }

  async login(loginData: IUserLoginDTO): Promise<IUserResponseDTO> {
    const transaction = await SequelizeRepository.getTransaction(this.options);
    try {
      const user: any = await UserRepository.findByEmail(
        loginData.email,
        this.options
      );
      if (!user) {
        throw new ErrorWithMessage("Unauthorized1", 401);
      }
      const isPasswordValid = await verifyPassword(
        loginData.password,
        user.hashedPassword
      );
      if (!isPasswordValid) {
        throw new ErrorWithMessage("Unauthorized2", 401);
      }
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new ErrorWithMessage("Something went wrong", 500);
      }
      const token = jsonwebtoken.sign(
        { email: user.email, id: user.id },
        secret,
        { expiresIn: "3h" }
      );
      const lastLogin = new Date();
      await UserRepository.update(user.id, { lastLogin }, this.options);
      const userResponse: IUserResponseDTO = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        photoUrl: user.photoUrl,
        token,
      };
      await SequelizeRepository.commitTransaction(this.options);
      return userResponse;
    } catch (error) {
      await SequelizeRepository.rollbackTransaction(this.options);
      throw error;
    }
  }


   capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
