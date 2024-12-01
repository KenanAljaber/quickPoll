import { IOptionPollDTO } from "./iOptionDTOs";

export interface IPollCreateDTO {
    title: string;
    body?: string;
    requiredInfo: PollRequiredInfo;
    createdByType: string;
    createdById: string;
    multiAnswer: boolean;
    imageUrl?: string;
    endDate?: Date;
    options: Array<IOptionPollDTO>;
}


export interface IPollResponseDTO {
    id: string;
    title: string;
    body?: string;
    requiredInfo: PollRequiredInfo;
    multiAnswer: boolean;
    imageUrl?: string;
    endDate?: Date;
    options: Array<IOptionPollDTO>;
    votesCount: number;
    lastVote: Date;
    pollSeen: number;
}


export enum PollRequiredInfo {
    NAME = "NAME",
    EMAIL = "EMAIL",
    NONE = "NONE",
    BOTH = "BOTH"
}