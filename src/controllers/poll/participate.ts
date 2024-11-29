import ApiResponse from "../../config/api/apiResponse";
import { IParticipationCreateDTO } from "../../database/DTO/IParticipationDTOs";
import PollService from "../../service/pollService";

export default async (req: any, res: any) => {
  try {
    const id = req.params.id;
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const ipAddress = rawIp.startsWith('::ffff:') ? rawIp.split(':').pop() : rawIp;
    console.log("IP address:", ipAddress);
    
    const pollData: IParticipationCreateDTO = req.body;
    pollData.pollId = id;
    pollData.ipAddress = ipAddress;
    const payload = await new PollService(req).participate(pollData);
    return ApiResponse.Success(res, 200, { data: payload });
  } catch (error) {
    return ApiResponse.Error(res, error);
  }
};