import ApiResponse from "../../config/api/apiResponse";
import { IAnonymousPollCredentialsDTO } from "../../database/DTO/iPollDTOs";
import ErrorWithMessage from "../../errors/errorWithMessage";
import PollService from "../../service/pollService";

export default async (req: any, res: any) => {
    try {
        const credentials:IAnonymousPollCredentialsDTO= req.body;
        if(!credentials.nickname || !credentials.password) throw new ErrorWithMessage('Credentials are required',400);
        const payload = await new PollService(req).authenticateAnonymousPoll(credentials);
        return ApiResponse.Success(res, 200, { data: payload });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}