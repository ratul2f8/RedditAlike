import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IRegularComment } from "../Comments/type";
import { IDootedUser, IFeedResponse } from "../Feed/types";
import { AppThunk, RootState } from "../store";
import {
  ICreateCommentResponse,
  IPostCommentRequest,
} from "../FeedDetails/types";

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
  removing: boolean;
  removalSuccessful: boolean;
  removalErrorMessage: string;
}
const initialState: IInitialState = {
  data: initialDetailedFeed,
  loading: false,
  errorMessage: "",
  comment: "",
  commenting: false,
  removalErrorMessage: "",
  removalSuccessful: false,
  removing: false
};
const myPostSlice = createSlice({
  name: "myPost",
  initialState,
  reducers: {
    parsingStarted: (state) => {
      state.loading = true;
      state.errorMessage = "";
      state.data = initialDetailedFeed;
      state.comment = "";
      state.commenting = false;
      state.removalErrorMessage = "";
      state.removing = false;
      state.removalSuccessful = false;
    },
    parsingFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.errorMessage = action.payload;
      state.data = initialDetailedFeed;
      state.comment = "";
      state.commenting = false;
      state.removalErrorMessage = "";
      state.removing = false;
      state.removalSuccessful = false;
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
      state.removalErrorMessage = "";
      state.removing = false;
      state.removalSuccessful = false;
    },
    clearRemovalInfos:(state) => {
      state.removalErrorMessage = "";
      state.removing = false;
      state.removalSuccessful = false;
    },
    removalStarted: (state) => {
      state.removalErrorMessage = "";
      state.removing = true;
      state.removalSuccessful = false;
    },
    removalFailed: (state, action: PayloadAction<string>) => {
      state.removalErrorMessage = action.payload;
      state.removing = false;
      state.removalSuccessful = false;
    },
    removalSuccesssful: (state) => {
      state.removalErrorMessage = "";
      state.removing = false;
      state.removalSuccessful = true;
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
    removeCommentFromMyPost : (state, action: PayloadAction<number>) => {
      let filteredPosts = state.data.comments.filter((comment) => comment.id !== action.payload);
      state.data.comments = filteredPosts;

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
export const { setComment, updateDootsInDetailedView, clearRemovalInfos, removeCommentFromMyPost } = myPostSlice.actions;

//export thunk
const {
  parsingStarted,
  parsingFailed,
  parsingSuccessful,
  commentingFailed,
  commentingStarted,
  commentingSuccessful,
  removalFailed,
  removalStarted,
  removalSuccesssful
} = myPostSlice.actions;
export const parseFeedDetailsThunk =
  (feedId: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(parsingStarted());
    axios
      .get(`${REACT_APP_API_ENDPOINT}/Feeds/${feedId}`)
      .then((response: AxiosResponse<IDetailedFeedResponse>) => {
        if (
          getState().authentication.currentUser.id !==
          response.data.feedInfo.creatorId
        ) {
          dispatch(
            parsingFailed("You aren't authenticated to view this page...")
          );
        } else {
          dispatch(parsingSuccessful(response.data));
        }
      })
      .catch((err) => dispatch(parsingFailed(err.message)));
  };
export const removePostThunk = (feedId: number):AppThunk => (dispatch, getState) => {
  dispatch(removalStarted());
  let config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
    },
  };
  axios
    .delete(`${REACT_APP_API_ENDPOINT}/Feeds/${feedId}`,config)
    .then((response: AxiosResponse<ICreateCommentResponse>) =>
      dispatch(removalSuccesssful())
    )
    .catch((err) => dispatch(removalFailed(err.message)));
}
export const postCommentThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(commentingStarted());
  let request: IPostCommentRequest = {
    FeedId: getState().myPost.data.feedInfo.id,
    Comment: getState().myPost.comment,
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
export const selectFeed = (state: RootState) => state.myPost.data;
export const selectIfFeedParsingError = (state: RootState) =>
  state.myPost.errorMessage;
export const selectIfFeedParsing = (state: RootState) => state.myPost.loading;
export const selectComment = (state: RootState) => state.myPost.comment;
export const selectIfCommenting = (state: RootState) => state.myPost.commenting;
export const selectIfRemoving = (state: RootState) => state.myPost.removing;
export const selectRemovalErrorMessage = (state: RootState) => state.myPost.removalErrorMessage;
export const selectIfRemovalSucessful = (state: RootState) => state.myPost.removalSuccessful;

export default myPostSlice.reducer;
