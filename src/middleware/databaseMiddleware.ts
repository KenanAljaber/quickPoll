import initializeModels from "../database";

export default async (req:any, res:any, next:any) => {
    const database= await initializeModels();
    req.database = database;
    next();
};