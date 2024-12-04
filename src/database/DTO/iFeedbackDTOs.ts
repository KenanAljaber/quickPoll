export interface IFeedbackCreateDTO {
    content: string,
    userId?: string
}

export interface IFeedbackUpdateDTO {
    archived: boolean
}

export interface IFeedbackResponseDTO {
    id: string,
    content: string,
    createdAt: Date,
}