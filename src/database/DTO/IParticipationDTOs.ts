export interface IParticipationCreateDTO {
    pollId: string
    participantId: string,
    participantType: string,
    optionsId: Array<string>,
    ipAddress: string,
    requiredInfo?: string
}