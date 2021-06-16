export interface IUpdateDootRequest{
    FeedId: number;
    DootType: number;
    whereToStart: number;
}
export interface IParseDootsRequest{
    FeedId: number;
    whereToStart: number;
}

export interface IUpdateDootResponse{
    updatedDootType: number
    overallDootStatus: number
}
export interface IDootedUser{
    id: string;
    email: string;
    fullName: string;
}
export interface IWhoLikedResponse{
    upDoots: IDootedUser[];
    downDoots: IDootedUser[];
}