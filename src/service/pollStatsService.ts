import { IServiceOptions } from "../config/interfaces/iServiceOptions";
import SequelizeRepository from "../config/sequelizeRepository";
import { IPollTrackingCreateDTO } from "../database/DTO/iPollStatsDTOs";
import PollStatsRepository from "../database/repository/pollStatsRepository";

export default class PollStatsService {

    options:IServiceOptions;

    constructor(options:IServiceOptions) {
        this.options = options;
    }


    async trackVisitor(data: IPollTrackingCreateDTO) {
        const transaction= await SequelizeRepository.getTransaction(this.options);
        try {
            const pollVisitor = await PollStatsRepository.trackVisitor(data, { ...this.options, transaction }); 
            await SequelizeRepository.commitTransaction(this.options);
            return pollVisitor;
        } catch (error) {
            console.log(error);
            await SequelizeRepository.rollbackTransaction(this.options);
            throw error;
        }
    }

}

