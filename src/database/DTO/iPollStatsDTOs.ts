import { IOptionPollDTO } from "./iOptionDTOs";

export interface IPollTrackingCreateDTO {
    pollId: string,
    visitorId: string,
    ipAddress: string
}

export interface IPollStatsResponseDTO {
    pollViews: number,
    votesCount: number,
    lastVote?: Date,
    participationCount: number,
    percentageVotePerOption: Array<IOptionPollDTO>,
}

// export interface IOptionVotesPercentageDTO {
//     optionId: string,
//     optionValue: string,
//     percentage: string
// }