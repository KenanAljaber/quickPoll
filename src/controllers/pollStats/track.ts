import ApiResponse from "../../config/api/apiResponse";
import { IPollTrackingCreateDTO } from "../../database/DTO/iPollStatsDTOs";
import ErrorWithMessage from "../../errors/errorWithMessage";
import PollStatsService from "../../service/pollStatsService";
import GeolocationHelper from "../../utils/geolocationHelper";

export default async (req: any, res: any) => {
    try {
        
        const data: IPollTrackingCreateDTO = req.body;
        if (!data.pollId || !data.visitorId)  throw new ErrorWithMessage("tracking info is missing", 400);
        const ipAddress = GeolocationHelper.extractIpAddress(req);
        data.ipAddress = ipAddress;
        console.log(data);
        
        const payload = await new PollStatsService(req).trackVisitor(data);
        return ApiResponse.Success(res, 200, { data: payload!=null });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}