export interface IUserRegisterDTO{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface IUserLoginDTO{
    email: string;
    password: string;
}

export interface IUserResponseDTO{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    photoUrl: string;
    role: string;
    token: string;
}


export interface IUserUpdateDTO{
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    lastLogin?: Date;
}

export const DEFAULT_ROLE = "user";