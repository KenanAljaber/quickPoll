import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import ErrorWithMessage from "../../errors/errorWithMessage";
import { hashPassword, verifyPassword } from "../../security/passwords";
import { IOptionPollDTO } from "../DTO/iOptionDTOs";
import { CreatedByType, GuestRequiredInfo, IAnonymousPollCredentialsDTO, IPollConfigurationDTO, IPollCreateDTO, IPollResponseDTO } from "../DTO/iPollDTOs";
import { IPollStatsResponseDTO } from "../DTO/iPollStatsDTOs";
import { VotesCountType } from "../DTO/iVoteDTOs";
import OptionRepository from "./optionRepository";
import PollStatsRepository from "./pollStatsRepository";

export default class PollRepository {

  static commonAttributes: any = ["id", "title", "body", "state", "endDate"];
  static async create(data: IPollCreateDTO, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const isAnonymous = data.createdByType === CreatedByType.ANONYMOUS || !data.createdById;
    console.log(isAnonymous);

    if (isAnonymous && data.createdById) throw new ErrorWithMessage("Invalid poll type", 400);
    const poll = await options.database.poll.create(
      {
        ...data,
        createdByUserId: data.createdByType === CreatedByType.USER ? data.createdById : null,
        createdByGuestId: data.createdByType === CreatedByType.GUEST ? data.createdById : null,
      },
      { transaction }
    );
    if (isAnonymous) {
      data.createdByType = CreatedByType.ANONYMOUS;
      if ((!data.nickname || !data.password)) throw new ErrorWithMessage("Anonymous poll must have nickname and password", 400);
      const anonymousPoll = await this.findAnonymousPollByNickname(data.nickname || "", options);
      if (anonymousPoll) throw new ErrorWithMessage("Nickname already in use", 400);
      const hashedPassword = await hashPassword(data.password || "");
      await options.database.anonymousPollSecurity.create({
        pollId: poll.id,
        nickname: data.nickname || "",
        password: hashedPassword,
      }, { transaction });
    }
    if (!data.configuration) {
      data.configuration = this.getDefaultConfiguration(isAnonymous);
    }
    await options.database.pollConfiguration.create({
      ...data.configuration,
      pollId: poll.id,
    }, { transaction });
    if (data.options) {
      const optionsWithPollId = data.options.map((option) => ({
        ...option,
        pollId: poll.id,
      }));
      const result = await OptionRepository.bulkCreate(optionsWithPollId, {
        ...options,
        transaction,
      });
    }
    return this.findById(poll.id, options);
  }
  static getDefaultConfiguration(isAnonymous: boolean): IPollConfigurationDTO {
    return {
      votesCountType: VotesCountType.BY_VOTE,
      guestCanVote: true,
      voterCanSeeResults: false,
      multiAnswer: false,
      guestRequiredInfo: GuestRequiredInfo.NONE,
      isAnonymous
    }
  }

  static async findAnonymousPollByNickname(nickname: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const anonymousPollSecurity = await options.database.anonymousPollSecurity.findOne({
      where: { nickname },
      transaction,
    });
    if (!anonymousPollSecurity) return null;
    const poll = await options.database.poll.findOne({
      where: { id: anonymousPollSecurity.pollId },
      transaction,
    });
    return poll;
  }

  static async authenticateAnonymousPoll(credentials: IAnonymousPollCredentialsDTO, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const anonymousPollSecurity = await options.database.anonymousPollSecurity.findOne({
      where: { nickname: credentials.nickname },
      transaction,
    });
    if (!anonymousPollSecurity) throw new ErrorWithMessage("Invalid nickname or password", 400);
    const poll = await options.database.poll.findOne({
      where: { id: anonymousPollSecurity.pollId },
      transaction,
    });
    if (!poll) throw new ErrorWithMessage("Invalid nickname or password", 400);
    const isPasswordValid = await verifyPassword(credentials.password, anonymousPollSecurity.password)
    if (!isPasswordValid) throw new ErrorWithMessage("Invalid nickname or password", 400);
    return await this.findById(poll.id, options, true);
  }


  static async findById(id: string, options: IRepositoryOptions, authenticatedAnonymousPoll = false): Promise<IPollResponseDTO> {
    const transaction = await SequelizeRepository.getTransaction(options);
    const currentUser = await SequelizeRepository.getCurrentUser(options);
    let pollResponse: IPollResponseDTO;
    let pollOptions: Array<IOptionPollDTO>;
    let stats: IPollStatsResponseDTO;
    const poll = await options.database.poll.findOne({
      where: { id },
      include: [
        {
          model: options.database.pollConfiguration,
          attributes: ["votesCountType", "guestCanVote", "voterCanSeeResults", "multiAnswer", "guestRequiredInfo"],
          as: "configuration",
        },
      ],
      transaction,
    });

    if (!poll) throw new ErrorWithMessage("Poll not found", 404);
    pollResponse = {
      id: poll.id,
      title: poll.title,
      body: poll.body,
      state: poll.state,
      endDate: poll.endDate,
      options: [],
      configuration: poll.configuration,
    }

    const isPollOwner = authenticatedAnonymousPoll || currentUser?.id && (poll.dataValues?.createdByGuestId == currentUser?.id || poll.dataValues?.createdByUserId == currentUser?.id);
    if (isPollOwner || poll.configuration.voterCanSeeResults) {
      stats = await PollStatsRepository.calculatePollVotes(id, options);


      poll.dataValues.stats = isPollOwner ? stats : stats.percentageVotePerOption;
      pollOptions = stats.percentageVotePerOption;
      if (isPollOwner) {
        pollResponse.votesCount = stats.votesCount;
        pollResponse.lastVote = stats.lastVote;
        pollResponse.pollSeen = stats.pollViews;

      }
    } else {
      pollOptions = await poll.getOptions({ attributes: ["id", "value", "order"], transaction });
    }
    pollResponse.options = pollOptions;


    return pollResponse;
  }


  static async findAll(filter: any, include: any, offset: number = 0, limit: number = 10, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    let where: any = {};
    let includeArr: any = [];
    let includeStats = false;
    if (filter) {
      if (filter.title) {
        where.title = {
          [options.database.Sequelize.Op.iLike]: `%${filter.title}%`,
        }
      }
      if (filter.id) {
        where.id = filter.id;
      }
    }
    if (include) {
      if (include.includes("options")) {
        includeArr.push({
          model: options.database.option,
          as: "options",
          attributes: ["id", "value", "order"],
        });
        console.log("includeArr", includeArr);

      }
      if (include.includes("stats")) {
        includeStats = true
      }
    }
    const polls = await options.database.poll.findAndCountAll({
      where,
      include: includeArr,
      attributes: this.commonAttributes,
      offset,
      limit,
      transaction,
    });

    if (includeStats) {
      for (let i = 0; i < polls.rows.length; i++) {
        const currentPoll = polls.rows[i]
        const stats = await PollStatsRepository.getPollGeneralStats(currentPoll, options);
        polls.rows[i].dataValues.stats = stats

      }

    }
    return polls;
  }

  static async isPollOwner(pollId: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const currentUser = await SequelizeRepository.getCurrentUser(options);
    const poll = await options.database.poll.findOne({
      where: { id: pollId },
      transaction,
    });
    return poll && currentUser && (poll.dataValues?.createdByGuestId == currentUser?.id || poll.dataValues?.createdByUserId == currentUser?.id);
  }

  static async delete(id: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const currentUser = SequelizeRepository.getCurrentUser(options);
    const isPollOwner = await this.isPollOwner(id, options) || (currentUser && currentUser?.role == "admin");
    if (!isPollOwner) throw new ErrorWithMessage("Unauthorized", 403);
    const poll = await options.database.poll.destroy({
      where: { id },
      transaction,
    });
    return poll;
  }
}
