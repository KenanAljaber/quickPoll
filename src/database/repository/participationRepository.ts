import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import ErrorWithMessage from "../../errors/errorWithMessage";
import { POLL_REQUIRED_INFO } from "../../utils/types";
import { IParticipationCreateDTO } from "../DTO/IParticipationDTOs";

export default class ParticipationRepository {

    static localHostIpAddress = "127.0.0.1";

    static async create (data: IParticipationCreateDTO, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const voteData= {
            pollId: data.pollId,
            createdByUserId: data.participantType === "User" ?  data.participantId : null,
            createdByGuestId:  null,
            ipAddress: data.ipAddress,
        }
        await this.participationControl(data, options);
        await this.checkPollOptionsIntegrity(data, options);
        // if(data.participantType=="Guest"){
        //     await this.checkGuestParticipationIntegrity(data, options);
        // }
        const vote = await options.database.vote.create(voteData, { transaction });
        if (data.optionsId) {
            const optionsWithVoteId = data.optionsId.map((option) => ({
                optionId: option,
                voteId: vote.id,
            }));
            const result = await options.database.optionVotes.bulkCreate(optionsWithVoteId, {
                ...options,
                transaction,
            });
        }
        await options.database.pollParticipants.create({
            pollId: data.pollId,
            voteId: vote.id,
            userParticipantId: data.participantType === "User" ?  data.participantId : null,
            guestParticipantId:  null,
            ipAddress: data.ipAddress,
        }, { transaction });
        return vote;

    }

    static async checkGuestParticipationIntegrity(data: IParticipationCreateDTO, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        let guest = await options.database.guest.findOne({
            where: { id: data.participantId },
            transaction,
        });
        const poll = await options.database.poll.findOne({
            where: { id: data.pollId },
            transaction,
        });
        if(!poll)  throw new ErrorWithMessage("Invalid poll", 400);
        const requiredInfo= poll.requiredInfo;
        if (!guest)  {
            if(requiredInfo != POLL_REQUIRED_INFO.NONE){
                switch(requiredInfo){
                    case POLL_REQUIRED_INFO.NAME:
                        if(!data.name)  throw new ErrorWithMessage("Guest name is required", 400);
                        guest.name=data.name;
                        break;
                    case POLL_REQUIRED_INFO.EMAIL:
                        if(!data.email)  throw new ErrorWithMessage("Guest email is required", 400);
                        guest.email=data.email;
                        break;
                    case POLL_REQUIRED_INFO.BOTH:
                        if(!data.name || !data.email)  throw new ErrorWithMessage("Guest name and email are required", 400);
                        guest.name=data.name;
                        break;
                    default:
                        break;
                }
               guest= await options.database.guest.create(guest, { transaction });
            }
        }
        data.participantId=guest.id;


    }

    static async checkPollOptionsIntegrity(data: IParticipationCreateDTO, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const poll = await options.database.poll.findOne({
            where: { id: data.pollId },
            transaction,
        });
        if (!poll)  throw new ErrorWithMessage("Invalid poll", 400);
        if(data.optionsId.length === 0)  throw new ErrorWithMessage("You must select at least one option", 400);
        if(!poll.isMultiAnswer && data.optionsId.length > 1)  throw new ErrorWithMessage("Poll is single answer", 400);
        if(poll.state !== "OPEN")  throw new ErrorWithMessage("Poll is closed", 400);
        if (poll.endDate < new Date())  throw new ErrorWithMessage("Poll is closed", 400);
        const pollOptions = await poll.getOptions({ transaction });
        const pollOptionsId= pollOptions.map((option:any) => option.id);
        console.log(pollOptionsId);
        
        data.optionsId.forEach((optionId:any) => {
            if (!pollOptionsId.includes(optionId))  throw new ErrorWithMessage("Invalid options", 400);
        })
    }

    static async participationControl(data: IParticipationCreateDTO, options: IRepositoryOptions) {
        const transaction = await SequelizeRepository.getTransaction(options);
        const voteData = {
            pollId: data.pollId,
            // createdByUserId: data.participantType === "User" ?  data.participantId : null,
            // createdByGuestId: data.participantType === "Guest" ?  data.participantId : null,
            ipAddress: data.ipAddress,
        }
        // if(voteData.ipAddress == this.localHostIpAddress) throw new ErrorWithMessage("Please use the official vote app", 400);
        const vote = await options.database.vote.findOne({
            where: voteData,
            transaction,
        });
        if (vote) {
            await SequelizeRepository.rollbackTransaction(options);
            throw new ErrorWithMessage("You have already voted", 400);
        }
        return true;
    }


}