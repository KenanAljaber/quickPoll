import ApiResponse from "../../config/api/apiResponse";
import { IFeedbackCreateDTO } from "../../database/DTO/iFeedbackDTOs";
import ErrorWithMessage from "../../errors/errorWithMessage";
import FeedbackService from "../../service/feedbackService";

export default async (req: any, res: any) => {
    try {
        const feedbackData: IFeedbackCreateDTO = req.body;
        if(!feedbackData || !feedbackData.content ) throw new ErrorWithMessage('Content is required',400);
        const payload = await new FeedbackService(req).create(feedbackData);
        return ApiResponse.Success(res, 200, { data: payload });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}