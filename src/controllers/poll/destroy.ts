import ApiResponse from "../../config/api/apiResponse";
import PollService from "../../service/pollService";

export default async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const payload = await new PollService(req).delete(id);
    return ApiResponse.Success(res, 200, { data: payload });
  } catch (error) {
    return ApiResponse.Error(res, error);
  }
};