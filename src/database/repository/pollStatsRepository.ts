import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import GeolocationHelper from "../../utils/geolocationHelper";
import { IOptionPollDTO } from "../DTO/iOptionDTOs";
import { IPollStatsResponseDTO, IPollTrackingCreateDTO } from "../DTO/iPollStatsDTOs";
import { VotesCountType } from "../DTO/iVoteDTOs";

export default class PollStatsRepository {


    static async trackVisitor(data: IPollTrackingCreateDTO, options: IRepositoryOptions) {
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

    private static async createUpdatePollView(pollId: string, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const [pollView, created] = await options.database.pollView.findOrCreate({ where: { pollId }, defaults: { viewCount: 1 }, transaction },);
        if (!created) {
            pollView.viewCount = pollView.viewCount + 1;
            await pollView.save({ transaction });
        }

    }

    static async calculatePollVotes(pollId: string, options: IRepositoryOptions): Promise<IPollStatsResponseDTO> {
        const transaction = await SequelizeRepository.getTransaction(options);
        const poll = await options.database.poll.findOne({
            where: { id: pollId },
            include: [
              { model: options.database.option, as: "options" },
              { model: options.database.vote, as: "votes", include: ["options"] },
              { model: options.database.pollView, as: "views" },
              { model: options.database.pollConfiguration, as: "configuration" },
            ],
            transaction,
          });
          
        const votersVotes = poll.votes || [];
        const pollOptions = poll.options;
        const pollViews = poll.views;
        const pollConfiguration = await poll.getConfiguration({ transaction });
        const votedOptions = votersVotes.map((vote: any) => vote.options.map((option: any) => option.id)).flat();
        const totalVotes = pollConfiguration.votesCountType == VotesCountType.BY_PARTICIPANT ? votersVotes.length : votedOptions.length;

          

        const stats: IPollStatsResponseDTO = {
            pollViews: pollViews?.dataValues?.viewCount || 0,
            votesCount: totalVotes,
            participationCount: votersVotes.length,
            percentageVotePerOption: [] as IOptionPollDTO[],
            lastVote: undefined
        }

        for (let i = 0; i < pollOptions.length; i++) {
            const pollOption = pollOptions[i];
            const optionVotesCount = votedOptions.filter((optionId: string) => optionId == pollOption.id).length;
            const percentageVotes = this.calculatePercentageVotes(totalVotes, optionVotesCount);
            stats.percentageVotePerOption.push({ id: pollOption.id as string, value: pollOption.value, order: pollOption.order, percentage: percentageVotes });
        }
        stats.lastVote = votersVotes.length > 0 ? votersVotes[votersVotes.length - 1].createdAt : null;
        return stats;
    }

    static async getPollGeneralStats(poll: any, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const votesCount = await options.database.vote.count({
            where: { pollId: poll.id },
            transaction,
        });
        const lastVote = await options.database.vote.findOne({
            where: { pollId: poll.id },
            order: [["createdAt", "DESC"]],
            transaction,
        });
        const lastVoteDate = lastVote ? lastVote.createdAt : null;
        const pollSeen = 10;
        return {
            votesCount,
            lastVoteDate,
            pollSeen
        };
    }


    private static calculatePercentageVotes(total: number, count: number): string {
        if (total === 0) return "0.00%";
        return ((count / total) * 100).toFixed(2) + "%";
      }

}