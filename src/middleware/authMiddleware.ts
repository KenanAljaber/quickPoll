import jwt from 'jsonwebtoken';
import ApiResponse from '../config/api/apiResponse';
import ErrorWithMessage from '../errors/errorWithMessage';
export default (req:any, res:any, next:any) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        next();
        return;
    }

    try {
        const secret = process.env.JWT_SECRET as string;
        const user = jwt.verify(token, secret);
        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        ApiResponse.Error(res,new ErrorWithMessage('Unauthorized',401));
    }
};


