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
    id?: string,
    value: string,
    order: number,
    percentage?: string
}