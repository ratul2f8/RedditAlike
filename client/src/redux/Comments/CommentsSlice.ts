import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { AppThunk, RootState } from "../store";
import { IParseCommentsRequest, IRegularComment } from "./type";
import { updateNumberOfComments } from "../Feed/FeedSlice";

const { REACT_APP_API_ENDPOINT } = process.env;
export interface IInitialState {
  parsing: boolean;
  comments: IRegularComment[];
  parsingErrorMessage: string;
}

const initialState: IInitialState = {
  parsing: false,
  comments: [],
  parsingErrorMessage: "",
};

const commentsSlice = createSlice({
  name: "commentSlce",
  initialState,
  reducers: {
    parsingStarted: (state) => {
      state.parsing = true;
      state.parsingErrorMessage = "";
      state.comments = [];
    },
    parsingFailed: (state, action: PayloadAction<string>) => {
      state.parsing = false;
      state.parsingErrorMessage = action.payload;
      state.comments = [];
    },
    parsingSuccessful: (state, action: PayloadAction<IRegularComment[]>) => {
      state.parsing = false;
      state.parsingErrorMessage = "";
      state.comments = action.payload;
    },
  },
});

//export thunk
const { parsingFailed, parsingStarted, parsingSuccessful } =
  commentsSlice.actions;
export const parseCommentsThunk =
  (request: IParseCommentsRequest): AppThunk =>
  (dispatch) => {
    dispatch(parsingStarted());
    axios
      .get(`${REACT_APP_API_ENDPOINT}/FeedComments/${request.FeedId}`)
      .then((response: AxiosResponse<IRegularComment[]>) => {
        dispatch(
            updateNumberOfComments({
            key: request.whereToStart,
            numberOfComments: response.data.length,
            postId: request.FeedId,
          })
        );
        dispatch(parsingSuccessful(response.data));
      })
      .catch((err) => dispatch(parsingFailed(err.message)));
  };
//export selectors
export const selectIfParsing = (state: RootState) => state.comments.parsing;
export const selectParsingErrorMessage = (state: RootState) => state.comments.parsingErrorMessage;
export const selectParsedComments = (state: RootState) => state.comments.comments;
export default commentsSlice.reducer;
