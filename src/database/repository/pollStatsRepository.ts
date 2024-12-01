import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import GeolocationHelper from "../../utils/geolocationHelper";
import { IPollTrackingDTO } from "../DTO/iPollStatsDTOs";

export default class PollStatsRepository {


    static async trackVisitor(data: IPollTrackingDTO, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const [pollVisitor, created] = await options.database.pollVisitor
            .findOrCreate({ where: { visitorId: data.visitorId, pollId: data.pollId }, defaults: { count: 1, ipAddress: data.ipAddress }, transaction },);
        if (!created) {
            pollVisitor.count = pollVisitor.count + 1;
            await pollVisitor.save({ transaction });
        }
        const geolocationData = await options.database.geolocationData.findOne({ where: { ipAddress: data.ipAddress }, transaction });
        if (geolocationData) {
            await geolocationData.update({ visitorId: data.visitorId }, { transaction });
        } else {
            let geolocationData = await GeolocationHelper.getGeolocationData(data.ipAddress);
            if (geolocationData) {
                await options.database.geolocationData.findOrCreate({ where: { visitorId: data.visitorId, ipAddress: data.ipAddress }, defaults: { ...geolocationData, visitorId: data.visitorId }, transaction });
            }
        }

        await this.createUpdatePollView(data.pollId, options);

        return pollVisitor;
    }

    static async createUpdatePollView(pollId: string, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const [pollView, created] = await options.database.pollView.findOrCreate({ where: { pollId }, defaults: { viewCount: 1 }, transaction },);
        if (!created) {
            pollView.viewCount = pollView.viewCount + 1;
            await pollView.save({ transaction });
        }

    }

}