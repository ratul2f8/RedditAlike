import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRegularComment } from "../Comments/type";
import { IDootedUser, IFeedResponse } from "../Feed/types";
import { AppThunk, RootState } from "../store";
import { ICreateCommentResponse, IPostCommentRequest } from "./types";

const { REACT_APP_API_ENDPOINT } = process.env;
export interface IDetailedFeedResponse {
  feedInfo: IFeedResponse;
  downDoots: IDootedUser[];
  upDoots: IDootedUser[];
  comments: IRegularComment[];
}
const initialDetailedFeed: IDetailedFeedResponse = {
  feedInfo: {
    content: "",
    createdAt: "",
    title: "",
    creatorId: "",
    dootStatus: 0,
    numberOfComments: 0,
    id: 0,
    creatorName: "",
    updatedAt: "",
  },
  comments: [],
  upDoots: [],
  downDoots: [],
};
export interface IInitialState {
  loading: boolean;
  errorMessage: string;
  data: IDetailedFeedResponse;
  comment: string;
  commenting: boolean;
}
const initialState: IInitialState = {
  data: initialDetailedFeed,
  loading: false,
  errorMessage: "",
  comment: "",
  commenting: false,
};
const feedDetailsSlice = createSlice({
  name: "feedDetails",
  initialState,
  reducers: {
    parsingStarted: (state) => {
      state.loading = true;
      state.errorMessage = "";
      state.data = initialDetailedFeed;
      state.comment = "";
      state.commenting = false;
    },
    parsingFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
      state.data = initialDetailedFeed;
      state.comment = "";
      state.commenting = false;
    },
    parsingSuccessful: (
      state,
      action: PayloadAction<IDetailedFeedResponse>
    ) => {
      state.data = action.payload;
      state.errorMessage = "";
      state.loading = false;
      state.comment = "";
      state.commenting = false;
    },
    setComment: (state, action: PayloadAction<string>) => {
      state.comment = action.payload;
    },
    commentingStarted: (state) => {
      state.commenting = true;
    },
    commentingFailed: (state) => {
      state.commenting = false;
    },
    commentingSuccessful: (
      state,
      action: PayloadAction<ICreateCommentResponse>
    ) => {
      let { overallNumberOfComments, ...commentToPush } = action.payload;
      let currentNumberOfComments = state.data.feedInfo.numberOfComments;
      let currentComments = state.data.comments;
      state.comment = "";
      state.commenting = false;
      state.data.feedInfo.numberOfComments = currentNumberOfComments + 1;
      state.data.comments = [...currentComments, commentToPush];
    },
    removeComment : (state, action: PayloadAction<number>) => {
      let filteredComments = state.data.comments.filter((comment) => comment.id !== action.payload);
      state.data.comments = filteredComments;
    },
    updateDootsInDetailedView: (
      state,
      action: PayloadAction<{
        numberOfDoots: number;
        middleRequsetSuccess: boolean;
        upDoots: IDootedUser[];
        downDoots: IDootedUser[];
      }>
    ) => {
      const { upDoots, downDoots, middleRequsetSuccess, numberOfDoots } =
        action.payload;
      state.data.feedInfo.dootStatus = numberOfDoots;
      if (middleRequsetSuccess) {
        state.data.upDoots = upDoots;
        state.data.downDoots = downDoots;
      }
    },
  },
});
//export regular actions
export const { setComment, updateDootsInDetailedView, removeComment } =
  feedDetailsSlice.actions;

//export thunk
const {
  parsingStarted,
  parsingFailed,
  parsingSuccessful,
  commentingFailed,
  commentingStarted,
  commentingSuccessful,
} = feedDetailsSlice.actions;
export const parseFeedDetailsThunk =
  (feedId: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(parsingStarted());
    axios
      .get(`${REACT_APP_API_ENDPOINT}/Feeds/${feedId}`)
      .then((response: AxiosResponse<IDetailedFeedResponse>) => {
        if (
          response.data.feedInfo.creatorId ===
          getState().authentication.currentUser.id
        ) {
          dispatch(parsingFailed("Invalid Request"));
        } else {
          dispatch(parsingSuccessful(response.data));
        }
      })
      .catch((err) => dispatch(parsingFailed(err.message)));
  };

export const postCommentThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(commentingStarted());
  let request: IPostCommentRequest = {
    FeedId: getState().feedDetails.data.feedInfo.id,
    Comment: getState().feedDetails.comment,
  };
  let config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
    },
  };
  axios
    .post(`${REACT_APP_API_ENDPOINT}/FeedComments`, request, config)
    .then((response: AxiosResponse<ICreateCommentResponse>) =>
      dispatch(commentingSuccessful(response.data))
    )
    .catch((err) => dispatch(commentingFailed()));
};
//export selectors
export const selectFeed = (state: RootState) => state.feedDetails.data;
export const selectIfFeedParsingError = (state: RootState) =>
  state.feedDetails.errorMessage;
export const selectIfFeedParsing = (state: RootState) =>
  state.feedDetails.loading;
export const selectComment = (state: RootState) => state.feedDetails.comment;
export const selectIfCommenting = (state: RootState) =>
  state.feedDetails.commenting;

export default feedDetailsSlice.reducer;
