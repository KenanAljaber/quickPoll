import ApiResponse from "../../config/api/apiResponse";
import { IPollCreateDTO } from "../../database/DTO/iPollDTOs";
import PollService from "../../service/pollService";

export default async (req: any, res: any) => {
  try {
    const pollData: IPollCreateDTO = req.body;
    const payload = await new PollService(req).create(pollData);
    return ApiResponse.Success(res, 200, { data: payload });
  } catch (error) {
    return ApiResponse.Error(res, error);
  }
};
