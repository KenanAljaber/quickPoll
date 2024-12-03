import { IOptionPollDTO } from "./iOptionDTOs";
import { VotesCountType } from "./iVoteDTOs";

export interface IPollCreateDTO {
    title: string;
    body?: string;
    createdByType: string;
    createdById: string;
    imageUrl?: string;
    endDate?: Date;
    options: Array<IOptionPollDTO>;
    configuration: IPollConfigurationDTO;
    // security
    nickname?: string;
    password?: string;
}


export interface IPollResponseDTO {
    // poll fields
    id: string;
    title: string;
    state: PollState;
    body?: string;
    imageUrl?: string;
    endDate?: Date;
    // options
    options: Array<IOptionPollDTO>;
    // configurations
    configuration?: IPollConfigurationDTO;
    // stats
    votesCount?: number;
    lastVote?: Date;
    pollSeen?: number;

}

export interface IPollConfigurationDTO {
    votesCountType: VotesCountType;
    multiAnswer: boolean;
    guestCanVote: boolean;
    voterCanSeeResults: boolean;
    guestRequiredInfo: GuestRequiredInfo;
    isAnonymous: boolean
}

export interface IAnonymousPollCredentialsDTO{
    nickname: string;
    password: string
}



export enum GuestRequiredInfo {
    NAME = "NAME",
    EMAIL = "EMAIL",
    NONE = "NONE",
    BOTH = "BOTH"
}

export enum PollState {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export enum CreatedByType {
    USER = "USER",
    GUEST = "GUEST",
    ANONYMOUS = "ANONYMOUS"
}