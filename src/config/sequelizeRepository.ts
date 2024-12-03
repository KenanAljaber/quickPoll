import { Sequelize,Transaction } from "sequelize";
import { IServiceOptions } from "./interfaces/iServiceOptions";
import { IRepositoryOptions } from "./interfaces/iRepositoryOptions";
export default class SequelizeRepository {

    constructor() {}
    static transaction=null;
    static async  getTransaction(options: any) {
        const database=options.database
        if(this.transaction) return this.transaction    
         this.transaction = await database.sequelize.transaction();
        return this.transaction
    }


    static async commitTransaction(options: any) {
        const transaction:any = await this.getTransaction(options);
        await transaction.commit();
        this.transaction=null
    }

    static async rollbackTransaction(options: any) {
        const transaction:any = await this.getTransaction(options);
        await transaction.rollback();
        this.transaction=null
    }
    static getCurrentUser(options: IRepositoryOptions) {
        if (options.user) {
          return options.user;
        }
        return null;
      }

}