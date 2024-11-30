export interface IParticipationCreateDTO {
    pollId: string
    participantId: string,
    participantType: string,
    optionsId: Array<string>,
    ipAddress: string,
    email?: string,
    name?: string
}