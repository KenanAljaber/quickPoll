import ApiResponse from "../../config/api/apiResponse";
import FeedbackService from "../../service/feedbackService";

export default async (req: any, res: any) => {
    try {
        const filter = req.query.filter ? JSON.parse(req.query.filter) : null;
        const offset = req.query.offset ? parseInt(req.query.offset) : 0;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const payload = await new FeedbackService(req).findAll(filter, offset, limit);
        return ApiResponse.Success(res, 200, { data: payload });
    } catch (error) {
        return ApiResponse.Error(res, error);
    }
}