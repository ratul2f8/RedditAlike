export interface IPostCommentRequest {
  FeedId: number;
  Comment: string;
}
export interface ICreateCommentResponse {
  comment: string;
  commentedAt: string;
  id: number;
  commenterName: string;
  commenterId: string;
  overallNumberOfComments: number;
}
