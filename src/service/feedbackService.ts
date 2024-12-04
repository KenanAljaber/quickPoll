import { IServiceOptions } from "../config/interfaces/iServiceOptions";
import SequelizeRepository from "../config/sequelizeRepository";
import { IFeedbackCreateDTO, IFeedbackUpdateDTO } from "../database/DTO/iFeedbackDTOs";
import FeedbackRepository from "../database/repository/feedbackRepository";

export default class FeedbackService {

    options:IServiceOptions;

    constructor(options:IServiceOptions) {
        this.options=options;
    }


    async create (data: IFeedbackCreateDTO) {
        const transaction = await SequelizeRepository.getTransaction(this.options);
        try {
            const feedback = await FeedbackRepository.create(data, { ...this.options, transaction });
            await SequelizeRepository.commitTransaction(this.options);
            return feedback;
        } catch (error) {
            console.log(error);
            await SequelizeRepository.rollbackTransaction(this.options);
            throw error;
        }
    }

    async delete(id: string) {
        const transaction = await SequelizeRepository.getTransaction(this.options);
        try {
            const feedback = await FeedbackRepository.delete(id, { ...this.options, transaction });
            await SequelizeRepository.commitTransaction(this.options);
            return feedback;
        } catch (error) {
            console.log(error);
            await SequelizeRepository.rollbackTransaction(this.options);
            throw error;
        }
    }

    async update(id: string, data: IFeedbackUpdateDTO) {
        const transaction = await SequelizeRepository.getTransaction(this.options);
        try {
            const feedback = await FeedbackRepository.update(id, data, { ...this.options, transaction });
            await SequelizeRepository.commitTransaction(this.options);
            return feedback;
        } catch (error) {
            console.log(error);
            await SequelizeRepository.rollbackTransaction(this.options);
            throw error;
        }
    }


    async findAll(filter: any, offset: number = 0, limit: number = 10 ) {
        const transaction = await SequelizeRepository.getTransaction(this.options);
        try {
            const feedbacks = await FeedbackRepository.findAll(filter, offset, limit, { ...this.options, transaction });
            return feedbacks;
        } catch (error) {
            console.log(error);
            await SequelizeRepository.rollbackTransaction(this.options);
            throw error;
        }
    }

}
