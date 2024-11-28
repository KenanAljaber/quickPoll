import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import ErrorWithMessage from "../../errors/errorWithMessage";
import { hashPassword } from "../../security/passwords";
import { IUserRegisterDTO, IUserUpdateDTO } from "../DTO/IuserDTOs";
import { RoleRepository } from "./roleRepository";

export default class UserRepository {


  static async findByEmail(email: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const user = await options.database.user.findOne({
      where: { email },
      transaction,
    });
    return user;
  }

  static async findById(id: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const user = await options.database.user.findOne({
      where: { id },
      transaction,
    });
    return user;
  }

  static async update(
    id: string,
    data: IUserUpdateDTO,
    options: IRepositoryOptions
  ) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const user = await options.database.user.update(data, {
      where: { id },
      transaction,
    });
    return user;
  }

  static async delete(id: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const user = await options.database.user.destroy({
      where: { id },
      transaction,
    });
    return user;
  }

  static async findAll(
    filter: any,
    offset: number = 0,
    limit: number = 10,
    options: IRepositoryOptions
  ) {
    const transaction = await SequelizeRepository.getTransaction(options);
    let where: any = {};
    let include: any = [];
    if (filter) {
      if (filter.email) {
        where.email = filter.email;
      }
      if (filter.firstName) {
        where.firstName = filter.firstName;
      }
      if (filter.lastName) {
        where.lastName = filter.lastName;
      }
      if (filter.id) {
        where.id = filter.id;
      }
      if (filter.role) {
        include.push({
          model: options.database.role,
          as: "role",
          attributes: ["name"],
          where: { name: filter.role, required: true },
        });
      }
    }

    const users = await options.database.user.findAndCountAll({
      where,
      include,
      offset,
      limit,
      transaction,
    });
    return users;
  }
}
