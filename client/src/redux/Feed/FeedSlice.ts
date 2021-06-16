import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { AppThunk, RootState } from "../store";
import { IFeedResponse } from "./types";

const { REACT_APP_API_ENDPOINT } = process.env;
export interface IInitialState {
  parsedFeeds: {
    [key: number]: IFeedResponse[];
  };
  parsing: boolean;
  parsingFailedMessage: string;
}
const initialState: IInitialState = {
  parsedFeeds: {},
  parsing: false,
  parsingFailedMessage: "",
};

interface IUpdateComment {
  key: number;
  postId: number;
  numberOfComments: number;
}
interface IUpdateDoots {
  key: number;
  postId: number;
  numberOfDoots: number;
}
interface IPlaceFeeds {
  key: number;
  feeds: IFeedResponse[];
}

const feedsSlice = createSlice({
  name: "feeds",
  initialState,
  reducers: {
    parsingStarted: (state) => {
      state.parsingFailedMessage = "";
      state.parsing = true;
    },
    parsingFailed: (state, action: PayloadAction<string>) => {
      state.parsingFailedMessage = action.payload;
      state.parsing = false;
    },
    parsingSuccessful: (state, action: PayloadAction<IPlaceFeeds>) => {
      state.parsedFeeds[action.payload.key] = action.payload.feeds;
      state.parsingFailedMessage = "";
      state.parsing = false;
    },
    updateNumberOfComments: (state, action: PayloadAction<IUpdateComment>) => {
      let currentFeedsArray = state.parsedFeeds[action.payload.key];
      let updatedArray: IFeedResponse[] = currentFeedsArray.map((feed) =>
        feed.id !== action.payload.postId
          ? feed
          : { ...feed, numberOfComments: action.payload.numberOfComments }
      );
      state.parsedFeeds[action.payload.key] = updatedArray;
    },
    updateNumberOfDoots: (state, action: PayloadAction<IUpdateDoots>) => {
      let currentFeedsArray = state.parsedFeeds[action.payload.key];
      let updatedArray: IFeedResponse[] = currentFeedsArray.map((feed) =>
        feed.id !== action.payload.postId
          ? feed
          : { ...feed, dootStatus: action.payload.numberOfDoots }
      );
      state.parsedFeeds[action.payload.key] = updatedArray;
    },
  },
});

//export regular action
export const { updateNumberOfComments, updateNumberOfDoots } =
  feedsSlice.actions;

const { parsingStarted, parsingFailed, parsingSuccessful } = feedsSlice.actions;
//export thunk
export const parseFeedsThunk =
  (from: number): AppThunk =>
  (dispatch) => {
    dispatch(parsingStarted());
    if (from === 0) {
      axios
        .get(`${REACT_APP_API_ENDPOINT}/Feeds`)
        .then((response: AxiosResponse<IFeedResponse[]>) => {
          dispatch(parsingSuccessful({ key: from, feeds: response.data }));
        })
        .catch((err) => dispatch(parsingFailed(err.message + "")));
    } else {
      axios
        .get(`${REACT_APP_API_ENDPOINT}/Feeds/from/${from}`)
        .then((response: AxiosResponse<IFeedResponse[]>) => {
          dispatch(parsingSuccessful({ key: from, feeds: response.data }));
        })
        .catch((err) => dispatch(parsingFailed(err.message + "")));
    }
  };

//export selectors
export const selectIfParsing = (state: RootState) => state.feeds.parsing;
export const selectIfParsingErrorMessages = (state: RootState) =>
  state.feeds.parsingFailedMessage;
export const selectFeedsToRender = (key: number) => (state: RootState) =>
  state.feeds.parsedFeeds[key];

export default feedsSlice.reducer;
