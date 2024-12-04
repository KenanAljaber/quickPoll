import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import ErrorWithMessage from "../../errors/errorWithMessage";
import GeolocationHelper from "../../utils/geolocationHelper";
import { POLL_REQUIRED_INFO } from "../../utils/types";
import { IVoteCreateDTO } from "../DTO/iVoteDTOs";

export default class voteRepository {
 
    static localHostIpAddress = "127.0.0.1";

    static async create(
      data: IVoteCreateDTO,
      options: IRepositoryOptions
    ) {
      const transaction = await SequelizeRepository.getTransaction(options);
      const voteData = {
        pollId: data.pollId,
        createdByUserId:
          data.participantType === "User" ? data.participantId : null,
        createdByGuestId: null,
        ipAddress: data.ipAddress,
      };
      await this.participationControl(data, options);
      await this.checkPollRequiredInfo(data, options);
      await this.checkPollOptionsIntegrity(data, options);
      // if(data.participantType=="Guest"){
      //     await this.checkGuestParticipationIntegrity(data, options);
      // }
      const vote = await options.database.vote.create(voteData, { transaction });
      
      await this.findOrCreateVoteIpAddressGeolocation(data.ipAddress, vote.id, options);
      if (data.optionsId) {
        const optionsWithVoteId = data.optionsId.map((option) => ({
          optionId: option,
          voteId: vote.id,
        }));
         await options.database.optionVotes.bulkCreate(
          optionsWithVoteId,
          {
            ...options,
            transaction,
          }
        );
      }
      await options.database.pollParticipants.create(
        {
          pollId: data.pollId,
          voteId: vote.id,
          userParticipantId:
            data.participantType === "User" ? data.participantId : null,
          guestParticipantId: null,
          ipAddress: data.ipAddress,
        },
        { transaction }
      );
      return vote;
    }
  static async checkPollRequiredInfo(data: IVoteCreateDTO, options: IRepositoryOptions) {
    const transaction = SequelizeRepository.getTransaction(options);
    const poll = options.database.poll.findOne({
      where: { id: data.pollId },
      include:[{
        model: options.database.pollConfiguration,
        as: "configuration",
      }],
      transaction,
    });
    if (!poll) throw new ErrorWithMessage("Invalid poll", 400);
    const requiredInfo = poll.requiredInfo;
    switch (requiredInfo) {
      case POLL_REQUIRED_INFO.NONE:
        break;
      case POLL_REQUIRED_INFO.EMAIL:
        if (!data.email) throw new ErrorWithMessage("Email is required", 400);
        break;
      case POLL_REQUIRED_INFO.NAME:
        if (!data.name) throw new ErrorWithMessage("Name is required", 400);
        break;
      case POLL_REQUIRED_INFO.BOTH:
        if (!data.email) throw new ErrorWithMessage("Email is required", 400);
        if (!data.name) throw new ErrorWithMessage("Name is required", 400);
        break;
      default:
        break;
    }

  }
  
    static async findOrCreateVoteIpAddressGeolocation(ipAddress: string, voteId: string, options: IRepositoryOptions) {
      const transaction = await SequelizeRepository.getTransaction(options);
      const ipAddressLocation = await options.database.geolocationData.findOne({
        where: { ipAddress: ipAddress },
        transaction
      });
      if (ipAddressLocation) {
        await ipAddressLocation.update({ voteId: voteId }, { transaction });
      } else {
        const geolocationData = await GeolocationHelper.getGeolocationData(ipAddress);
        if (geolocationData) {
          await options.database.geolocationData.create({ ...geolocationData, voteId: voteId }, { transaction });
        }
      }
  
    }
  
    static async checkGuestParticipationIntegrity(
      data: IVoteCreateDTO,
      options: IRepositoryOptions
    ) {
      const transaction = await SequelizeRepository.getTransaction(options);
      let guest = await options.database.guest.findOne({
        where: { id: data.participantId },
        transaction,
      });
      const poll = await options.database.poll.findOne({
        where: { id: data.pollId },
        transaction,
      });
      if (!poll) throw new ErrorWithMessage("Invalid poll", 400);
      const requiredInfo = poll.requiredInfo;
      if (!guest) {
        if (requiredInfo != POLL_REQUIRED_INFO.NONE) {
          switch (requiredInfo) {
            case POLL_REQUIRED_INFO.NAME:
              if (!data.name)
                throw new ErrorWithMessage("Guest name is required", 400);
              guest.name = data.name;
              break;
            case POLL_REQUIRED_INFO.EMAIL:
              if (!data.email)
                throw new ErrorWithMessage("Guest email is required", 400);
              guest.email = data.email;
              break;
            case POLL_REQUIRED_INFO.BOTH:
              if (!data.name || !data.email)
                throw new ErrorWithMessage(
                  "Guest name and email are required",
                  400
                );
              guest.name = data.name;
              break;
            default:
              break;
          }
          guest = await options.database.guest.create(guest, { transaction });
        }
      }
      data.participantId = guest.id;
    }
  
    static async checkPollOptionsIntegrity(
      data: IVoteCreateDTO,
      options: IRepositoryOptions
    ) {
      const transaction = await SequelizeRepository.getTransaction(options);
      const poll = await options.database.poll.findOne({
        where: { id: data.pollId },
        include:[{
          model: options.database.pollConfiguration,
          as: "configuration",
        }],
        transaction,
      });
      if (!poll) throw new ErrorWithMessage("Invalid poll", 400);
      if(!data.optionsId) throw new ErrorWithMessage("You must select at least one option", 400);
      if (data.optionsId.length === 0)
        throw new ErrorWithMessage("You must select at least one option", 400);
      if (!poll.configuration.isMultiAnswer && data.optionsId.length > 1)
        throw new ErrorWithMessage("Poll is single answer", 400);
      if (poll.state !== "OPEN")
        throw new ErrorWithMessage("Poll is closed", 400);
      if (poll.endDate < new Date())
        throw new ErrorWithMessage("Poll is closed", 400);
      const pollOptions = await poll.getOptions({ transaction });
      const pollOptionsId = pollOptions.map((option: any) => option.id);
      console.log(pollOptionsId);
  
      data.optionsId.forEach((optionId: any) => {
        if (!pollOptionsId.includes(optionId))
          throw new ErrorWithMessage("Invalid options", 400);
      });
    }
  
    static async participationControl(
      data: IVoteCreateDTO,
      options: IRepositoryOptions
    ) {
      const transaction = await SequelizeRepository.getTransaction(options);
      const voteData = {
        pollId: data.pollId,
        createdByUserId:
          data.participantType === "User" ? data.participantId : null,
        // createdByGuestId: data.participantType === "Guest" ?  data.participantId : null,
        ipAddress: data.ipAddress,
      };
      // if(voteData.ipAddress == this.localHostIpAddress) throw new ErrorWithMessage("Please use the official vote app", 400);
      const vote = await options.database.vote.findOne({
        where: voteData,
        transaction,
      });
      if (voteData.createdByUserId && vote) {
        const lastVoteUserId = vote.createdByUserId;
        if (lastVoteUserId === data.participantId)
          throw new ErrorWithMessage("You have already voted", 400);
        const user = await options.database.user.findOne({
          where: { id: data.participantId },
          transaction,
        });
        if (!user) throw new ErrorWithMessage("Invalid participant", 400);
        return true;
      }
      if (vote) {
        throw new ErrorWithMessage("You have already voted", 400);
      }
      return true;
    }



}