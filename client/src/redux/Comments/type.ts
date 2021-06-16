export interface IRegularComment{
    id: number;
    comment: string;
    commenterId: string;
    commentedAt: string;
    commenterName: string;
}

export interface IParseCommentsRequest{
    FeedId: number;
    whereToStart: number;
}