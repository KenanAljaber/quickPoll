import ApiResponse from "../../config/api/apiResponse";
import { IVoteCreateDTO } from "../../database/DTO/iVoteDTOs";
import PollService from "../../service/pollService";
import GeolocationHelper from "../../utils/geolocationHelper";

export default async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const requestIpAddress = GeolocationHelper.extractIpAddress(req);
    const pollData: IVoteCreateDTO = req.body;
    pollData.pollId = id;
    pollData.ipAddress = requestIpAddress;
    const payload = await new PollService(req).participate(pollData);
    return ApiResponse.Success(res, 200, { data: payload ? true : false });
  } catch (error) {
    return ApiResponse.Error(res, error);
  }
};