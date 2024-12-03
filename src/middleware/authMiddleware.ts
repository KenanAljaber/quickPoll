import jwt from 'jsonwebtoken';
import ApiResponse from '../config/api/apiResponse';
import ErrorWithMessage from '../errors/errorWithMessage';
import initializeModels from '../database';
import UserRepository from '../database/repository/userRepository';
export default async (req:any, res:any, next:any) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        next();
        return;
    }

    try {
        const secret = process.env.JWT_SECRET as string;
        const user:any = jwt.verify(token, secret);
        const models= await initializeModels();
        const userExist = await UserRepository.findById(user.id, {database:models,transaction:null});
        if( !userExist ){
            throw new ErrorWithMessage('Unauthorized',401);
        }
        req.user = {
            id: userExist.id,
            firstName: userExist.firstName,
            lastName: userExist.lastName,
            email: userExist.email,
            photoUrl: userExist.photoUrl,
            token,
            role: userExist.role.name
        };
        req.token = token;
        next();
    } catch (err) {
        ApiResponse.Error(res,new ErrorWithMessage('Unauthorized',401));
    }
};


