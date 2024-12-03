import { IServiceOptions } from "../config/interfaces/iServiceOptions";
import SequelizeRepository from "../config/sequelizeRepository";
import { IVoteCreateDTO } from "../database/DTO/iVoteDTOs";
import { IAnonymousPollCredentialsDTO, IPollCreateDTO } from "../database/DTO/iPollDTOs";
import ParticipationRepository from "../database/repository/participationRepository";
import PollRepository from "../database/repository/pollRepository";
import voteRepository from "../database/repository/voterepository";

export default class PollService {
  options: IServiceOptions;

  constructor(options: IServiceOptions) {
    this.options = options;
  }

  async create(data: IPollCreateDTO) {
    const transaction = await SequelizeRepository.getTransaction(this.options);
    try {
      const poll = await PollRepository.create(data, {
        ...this.options,
        transaction,
      });
      await SequelizeRepository.commitTransaction(this.options);
      return poll;
    } catch (error) {
      console.log(error);
      await SequelizeRepository.rollbackTransaction(this.options);
      throw error;
    }
  }

  async authenticateAnonymousPoll(credentials: IAnonymousPollCredentialsDTO) {
    try {
      const poll = await PollRepository.authenticateAnonymousPoll(credentials, this.options);
      return poll;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const poll = await PollRepository.findById(id, this.options);
      return poll;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string) {
    const transaction = await SequelizeRepository.getTransaction(this.options);
    try {
      const poll = await PollRepository.delete(id, {
        ...this.options,
        transaction,
      });
      await SequelizeRepository.commitTransaction(this.options);
      return poll;
    } catch (error) {
      console.log(error);
      await SequelizeRepository.rollbackTransaction(this.options);
      throw error;
    }
  }

  async findAll(
    filter: any,
    include: any,
    offset: number = 0,
    limit: number = 10
  ) {
    try {
      const polls = await PollRepository.findAll(
        filter,
        include,
        offset,
        limit,
        this.options
      );
      return polls;
    } catch (error) {
      throw error;
    }
  }

  async participate(data: IVoteCreateDTO) {
    const transaction = await SequelizeRepository.getTransaction(this.options);
    try {
      const poll = await voteRepository.create(data, {
        ...this.options,
        transaction,
      });
      await SequelizeRepository.commitTransaction(this.options);
      return poll;
    } catch (error) {
      console.log(error);
      await SequelizeRepository.rollbackTransaction(this.options);
      throw error;
    }
  }
}


// const create =async (req: any, res: any) => {
//   try {
//     const pollData: IPollCreateDTO = req.body;
//     const payload = await new PollService(req).create(pollData);
//     return ApiResponse.Success(res, 200, { data: payload });
//   } catch (error) {
//     return ApiResponse.Error(res, error);
//   }
// };



