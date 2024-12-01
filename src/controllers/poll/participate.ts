import ApiResponse from "../../config/api/apiResponse";
import { IParticipationCreateDTO } from "../../database/DTO/IParticipationDTOs";
import PollService from "../../service/pollService";
import GeolocationHelper from "../../utils/geolocationHelper";

export default async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const ipAddress = GeolocationHelper.extractIpAddress(req);
    const pollData: IParticipationCreateDTO = req.body;
    pollData.pollId = id;
    pollData.ipAddress = ipAddress;
    const payload = await new PollService(req).participate(pollData);
    return ApiResponse.Success(res, 200, { data: payload });
  } catch (error) {
    return ApiResponse.Error(res, error);
  }
};