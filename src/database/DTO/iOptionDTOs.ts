export interface IOptionCreateDTO  {
    pollId: string,
    value: string,
    order: number
}

export interface IOptionResponseDTO  {
    id: string,
    value: string,
    order: number
}

export interface IOptionPollDTO  {
    value: string,
    order: number
}