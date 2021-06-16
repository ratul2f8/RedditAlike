export interface ILoginRequest{
    "Email" : string;
    "Password": string;
}
export interface ICreateUserRequest{
    "FullName": string;
    "Email": string;
    "Password": string;
}
export interface ILoginResponse{
    "email": string;
    "fullName": string;
    "createdAt": string;
    "updatedAt": string;
    "jwt": string;
    "id": string;
    dootsMetadata: {
        [key: string] : number
    }
}