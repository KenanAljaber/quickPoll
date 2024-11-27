import { Sequelize,Transaction } from "sequelize";

export interface IServiceOptions {
    database: any,
    transaction:Transaction | null,
    token?: string,
    user?:any

}