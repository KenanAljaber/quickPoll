export interface IVoteCreateDTO {
    pollId: string
    participantId: string, // this will be user id or guest id
    participantType: string, // this will be user or guest
    optionsId: Array<string>,
    ipAddress: string,
    email?: string, // this value is optional depending on the poll's required info
    name?: string // this value is optional depending on the poll's required info
}

export enum VotesCountType {
    BY_VOTE = "VOTE",
    BY_PARTICIPANT = "PARTICIPANT"
}
