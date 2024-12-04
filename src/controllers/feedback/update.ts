import ApiResponse from "../../config/api/apiResponse";
import { IFeedbackUpdateDTO } from "../../database/DTO/iFeedbackDTOs";
import FeedbackService from "../../service/feedbackService";

export default async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const feedbackData: IFeedbackUpdateDTO = req.body;
        const payload = await new FeedbackService(req).update(id, feedbackData);
        return ApiResponse.Success(res, 200, { data: payload });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}