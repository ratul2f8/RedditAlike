export interface IFeedResponse{
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    creatorName: string;
    creatorId: string;
    dootStatus: number;
    numberOfComments: number;
}

export interface ICreateFeedRequest{
    Title: string;
    Content: string;
}
export interface IComment{
    id: number;
    comment: string;
    commenterId: string;
    commentedAt: string;
    commenterName: string;
}
export interface IDootedUser{
    id: string;
    email: string;
    fullName: string;
}
export interface IDetailedFeedResponse{
    feedInfo :IFeedResponse,
    downDoots : IDootedUser[],
    upDoots: IDootedUser[],
    comments: IComment[]
}