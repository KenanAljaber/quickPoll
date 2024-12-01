import ApiResponse from "../../config/api/apiResponse";
import { IPollTrackingDTO } from "../../database/DTO/iPollStatsDTOs";
import PollStatsService from "../../service/pollStatsService";
import GeolocationHelper from "../../utils/geolocationHelper";

export default async (req: any, res: any) => {
    try {
        const ipAddress = GeolocationHelper.extractIpAddress(req);
        const data: IPollTrackingDTO = req.body;
        data.ipAddress = ipAddress;
        console.log(data);
        
        const payload = await new PollStatsService(req).trackVisitor(data);
        return ApiResponse.Success(res, 200, { data: payload!=null });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}