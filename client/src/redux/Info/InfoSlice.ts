import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AppThunk, RootState } from "../store";
import { IDootedPost, IComposedPost } from "./types";
export interface IInitialSatte {
  parsing: boolean;
  parsingErrorMessage: string;
  composed: IComposedPost[];
  liked: IDootedPost[];
  disliked: IDootedPost[];
}
const initialState: IInitialSatte = {
  parsing: false,
  parsingErrorMessage: "",
  composed: [],
  liked: [],
  disliked: [],
};
const { REACT_APP_API_ENDPOINT } = process.env;
const infoSlice = createSlice({
  name: "info",
  initialState,
  reducers: {
    parsingStaretd: (state) => {
      state.parsing = true;
      state.composed = [];
      state.liked = [];
      state.disliked = [];
      state.parsingErrorMessage = "";
    },
    parsingFailed: (state, action: PayloadAction<string>) => {
      state.parsing = false;
      state.composed = [];
      state.liked = [];
      state.disliked = [];
      state.parsingErrorMessage = action.payload;
    },
    parsedComposedPosts: (state, action: PayloadAction<IComposedPost[]>) => {
      state.parsing = false;
      state.composed = action.payload;
      state.liked = [];
      state.disliked = [];
      state.parsingErrorMessage = "";
    },
    parsedLikdPosts: (state, action: PayloadAction<IDootedPost[]>) => {
      state.parsing = false;
      state.composed = [];
      state.liked = action.payload;
      state.disliked = [];
      state.parsingErrorMessage = "";
    },
    parsedDislikdPosts: (state, action: PayloadAction<IDootedPost[]>) => {
      state.parsing = false;
      state.composed = [];
      state.liked = [];
      state.disliked = action.payload;
      state.parsingErrorMessage = "";
    },
  },
});

const {
  parsingStaretd,
  parsingFailed,
  parsedComposedPosts,
  parsedDislikdPosts,
  parsedLikdPosts,
} = infoSlice.actions;

//export thunks
export const parseComposedPostsThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(parsingStaretd());
  let config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
    },
  };
  axios
    .get(`${REACT_APP_API_ENDPOINT}/Users/composed`, config)
    .then((response: AxiosResponse<IComposedPost[]>) =>
      dispatch(parsedComposedPosts(response.data))
    )
    .catch((err) => dispatch(parsingFailed(err.message)));
};
export const parseLikedPostsThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(parsingStaretd());
  let config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
    },
  };
  axios
    .get(`${REACT_APP_API_ENDPOINT}/Users/updooted`, config)
    .then((response: AxiosResponse<IDootedPost[]>) =>
      dispatch(parsedLikdPosts(response.data))
    )
    .catch((err) => dispatch(parsingFailed(err.message)));
};
export const parseDislikedPostThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(parsingStaretd());
  let config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
    },
  };
  axios
    .get(`${REACT_APP_API_ENDPOINT}/Users/downdooted`, config)
    .then((response: AxiosResponse<IDootedPost[]>) =>
      dispatch(parsedDislikdPosts(response.data))
    )
    .catch((err) => dispatch(parsingFailed(err.message)));
};

//export selectors
export const selectIfParsing = (state: RootState) => state.info.parsing;
export const selectIfErrorMessage = (state: RootState) =>
  state.info.parsingErrorMessage;
export const selectLikedPosts = (state: RootState) => state.info.liked;
export const selectDislikedPosts = (state: RootState) => state.info.disliked;
export const selectComposedPosts = (state: RootState) => state.info.composed;

export default infoSlice.reducer;
