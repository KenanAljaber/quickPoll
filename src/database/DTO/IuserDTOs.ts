export interface IUserRegisterDTO{
    firstName: string;
    lastName: string;
    email: string;
    hashedPassword: string;
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
    token: string;
}


export interface IUserUpdateDTO{
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    lastLogin?: Date;
}