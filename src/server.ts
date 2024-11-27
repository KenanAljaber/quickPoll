import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import routes from './controllers/index';
import models from './database';
import { RoleRepository } from './database/repository/roleRepository';
import SequelizeRepository from './config/sequelizeRepository';
import databaseMiddleware from './middleware/databaseMiddleware';
dotenv.config({path:"development.env"});



const app = express();
const router=express.Router();
 routes(router);
models().then(async (res) => {
    try {
        // const transaction= await SequelizeRepository.getTransaction(res);
        // await RoleRepository.create('admin', {database: res, transaction: transaction});
        // await SequelizeRepository.commitTransaction(res);
    } catch (error) {
        
    }
});
app.use(bodyParser.json());
app.use(databaseMiddleware);
app.use('/api/v1', router);
// app.use('/auth', authRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
