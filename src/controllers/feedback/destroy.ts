import ApiResponse from "../../config/api/apiResponse";
import FeedbackService from "../../service/feedbackService";

export default async (req: any, res: any) => {
    try {
        const id = req.params.id;
        const payload = await new FeedbackService(req).delete(id);
        return ApiResponse.Success(res, 200, { data: payload });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}