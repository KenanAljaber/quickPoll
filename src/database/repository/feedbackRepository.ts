import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import { IFeedbackCreateDTO, IFeedbackUpdateDTO } from "../DTO/iFeedbackDTOs";

export default class FeedbackRepository {



    static async create(feedback: IFeedbackCreateDTO, option: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(option);
        const poll = await option.database.feedback.create(feedback, { transaction });
        return poll;
    }


    static async update(id: string, data: IFeedbackUpdateDTO, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const poll = await options.database.feedback.update(data, {
            where: {
                id
            },
            transaction,
        });
        return poll;
    }


    static async delete(id: string, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const poll = await options.database.feedback.destroy({
            where: { id },
            transaction,
        });
        return poll;
    }

    static async findAll(filter: any, offset: number = 0, limit: number = 10, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const polls = await options.database.feedback.findAndCountAll({
            where: filter,
            offset,
            limit,
            transaction,
        });
        return polls;
    }

}