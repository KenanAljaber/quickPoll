import { IRepositoryOptions } from "../../config/interfaces/iRepositoryOptions";
import SequelizeRepository from "../../config/sequelizeRepository";
import { IPollCreateDTO } from "../DTO/iPollDTOs";
import OptionRepository from "./optionRepository";

export default class PollRepository {

  static commonAttributes: any = ["id", "title", "body",  "state", "multiAnswer","endDate"];
  static async create(data: IPollCreateDTO, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const poll = await options.database.poll.create(
      { ...data, state: "OPEN" },
      { transaction }
    );
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
    return poll;
  }


  static async findById(id: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const poll = await options.database.poll.findOne({
      where: { id },
      attributes: this.commonAttributes,
      transaction,
    });
    return poll;
  }

  static async findAll(filter: any,include: any, offset: number = 0, limit: number = 10, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    let where: any = {};
    let includeArr: any = [];
    let includeStats=false;
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
    if(include) {
      if(include.includes("options")) {
        includeArr.push({
          model: options.database.option,
          as: "options",
          attributes: ["id", "value", "order"],
        });
        console.log("includeArr", includeArr);
        
      }
      if(include.includes("stats")) {
        includeStats=true
      }
    }
    const polls = await options.database.poll.findAndCountAll({
      where,
      include:includeArr,
      attributes: this.commonAttributes,
      offset,
      limit,
      transaction,
    });

    if(includeStats){
      for(let i=0;i<polls.rows.length;i++) {
        const currentPoll=polls.rows[i]
        const stats=await this.getPollStats(currentPoll, options); 
        polls.rows[i].dataValues.stats=stats
        
      }

    }
    return polls;
  }

  static async getPollStats(poll: any, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const votesCount= await options.database.vote.count({
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

  static async delete(id: string, options: IRepositoryOptions) {
    const transaction = await SequelizeRepository.getTransaction(options);
    const poll = await options.database.poll.destroy({
      where: { id },
      transaction,
    });
    return poll;
  }
}
