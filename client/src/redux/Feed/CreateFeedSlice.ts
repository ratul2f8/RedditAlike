import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import { AppThunk, RootState } from "../store";
import { ICreateFeedRequest } from "./types";
export interface IInitialState {
  Feed: ICreateFeedRequest;
  creationInProgress: boolean;
  creationError: string;
  creatingSuccessfulMessage: string;
}
const { REACT_APP_API_ENDPOINT } = process.env;
const initialFeed: ICreateFeedRequest = {
  Title: "",
  Content: "",
};
const initialState: IInitialState = {
  Feed: initialFeed,
  creatingSuccessfulMessage: "",
  creationError: "",
  creationInProgress: false,
};

const createFeedSlice = createSlice({
  name: "create",
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      state.creationError = "";
    },
    clearSuccessfulMessage: (state) => {
      state.creatingSuccessfulMessage = "";
    },
    feedCreationStarted: (state) => {
      state.creationInProgress = true;
      state.creatingSuccessfulMessage = "";
      state.creationError = "";
    },
    feedCreationFailed: (state, action: PayloadAction<string>) => {
      state.creationInProgress = false;
      state.creatingSuccessfulMessage = "";
      state.creationError = action.payload;
    },
    feedCreationSuccessful: (state) => {
      state.creationInProgress = false;
      state.creatingSuccessfulMessage = "Successfully created the post";
      state.creationError = "";
      state.Feed = initialFeed;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      let currentStatus = state.Feed;
      state.Feed = {
        ...currentStatus,
        Title: action.payload,
      };
    },
    setContent: (state, action: PayloadAction<string>) => {
      let currentStatus = state.Feed;
      state.Feed = {
        ...currentStatus,
        Content: action.payload,
      };
    },
    clearMessages: (state) => {
      state.creatingSuccessfulMessage = "";
      state.creationError = "";
    },
    bringbackToNeutral: (state) => {
      state.creatingSuccessfulMessage = "";
      state.creationError = "";
      state.Feed = initialFeed;
      state.creationInProgress = false;
    },
  },
});
//export selectors
export const selectIfInProgress = (state: RootState) =>
  state.create.creationInProgress;
export const selectFeedStatus = (state: RootState) => state.create.Feed;
export const selectIfError = (state: RootState) => state.create.creationError;
export const selectSuccessfulMessage = (state: RootState) =>
  state.create.creatingSuccessfulMessage;

//export regular actions
export const {
  clearErrorMessage,
  clearSuccessfulMessage,
  setTitle,
  setContent,
  clearMessages,
  bringbackToNeutral,
} = createFeedSlice.actions;

const { feedCreationStarted, feedCreationFailed, feedCreationSuccessful } =
  createFeedSlice.actions;
//export thunk
export const createFeedThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(feedCreationStarted());
  let config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
    },
  };
  axios
    .post(`${REACT_APP_API_ENDPOINT}/Feeds`, getState().create.Feed, config)
    .then(() => dispatch(feedCreationSuccessful()))
    .catch((err) => dispatch(feedCreationFailed(err.message)));
};

export default createFeedSlice.reducer;
