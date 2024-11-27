import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import ErrorWithMessage from "../../errors/errorWithMessage";

export class RoleRepository {


static async create (name: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const alreadyExists = await this.findByRole(name, options);
    if (alreadyExists) {
      throw new ErrorWithMessage("Role already exists", 400);
    }
    const role = await options.database.role.create({ name }, { transaction });
    return role;
}

static async findByRole(name: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const role = await options.database.role.findOne({
      where: { name },
      transaction,
    });
    return role;
  }

}