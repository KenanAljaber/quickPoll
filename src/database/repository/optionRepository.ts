import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import { IOptionCreateDTO } from "../DTO/iOptionDTOs";

export default class OptionRepository {


    static async create(option: IOptionCreateDTO, options:IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const poll = await options.database.option.create(option, { transaction });
        return poll;
        
    }

    static async bulkCreate(option: IOptionCreateDTO[], options:IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const poll = await options.database.option.bulkCreate(option, { transaction });
        return poll;
        
    }

}