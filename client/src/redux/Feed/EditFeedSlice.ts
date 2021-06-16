import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { AppThunk, RootState } from "../store";
import {
  ICreateFeedRequest,
  IDetailedFeedResponse,
  IFeedResponse,
} from "./types";
const { REACT_APP_API_ENDPOINT } = process.env;
export interface IInitialState {
  parsedFeeds: {
    [key: number]: IFeedResponse;
  };
  editedFeeds: {
    [key: number]: IFeedResponse;
  };
  inProgress: boolean;
  parsingErrorMessage: string;
  editingInProgress: boolean;
  editingErrorMessage: string;
  editingSuccessfulMessage: string;
}
const initialState: IInitialState = {
  parsedFeeds: {},
  editedFeeds: {},
  inProgress: false,
  parsingErrorMessage: "",
  editingInProgress: false,
  editingErrorMessage: "",
  editingSuccessfulMessage: "",
};

export interface IEditPayload {
  element: "title" | "content";
  feedId: number;
  valueOfTheElement: string;
}

const editSlice = createSlice({
  name: "edit",
  initialState,
  reducers: {
    clearErrorMessage: (state) => {
      state.parsingErrorMessage = "";
      state.editingInProgress = false;
      state.editingErrorMessage = "";
      state.editingSuccessfulMessage = "";
    },
    parsingStarted: (state) => {
      state.inProgress = true;
      state.parsingErrorMessage = "";
      state.editingInProgress = false;
      state.editingErrorMessage = "";
      state.editingSuccessfulMessage = "";
    },
    parsingFailed: (state, action: PayloadAction<string>) => {
      state.inProgress = false;
      state.parsingErrorMessage = action.payload;
      state.editingInProgress = false;
      state.editingErrorMessage = "";
      state.editingSuccessfulMessage = "";
    },
    parsingSuccessful: (state, action: PayloadAction<IFeedResponse>) => {
      let key = action.payload.id;
      state.editedFeeds[key] = action.payload;
      state.parsedFeeds[key] = action.payload;
      state.inProgress = false;
      state.parsingErrorMessage = "";
      state.editingInProgress = false;
      state.editingErrorMessage = "";
      state.editingSuccessfulMessage = "";
    },
    //pass empty string as parameter for clearing out everything
    // filteroutCache : (state, action: PayloadAction<string>) => {
    //     let tempParsedFeedsKey = Object.keys(state.parsedFeeds).map(strElement => Number.parseInt(strElement));
    //     let filteredParsedFeeds : {[key: number] : IFeedResponse} = {};
    //     for(let i = 0; i < tempParsedFeedsKey.length; i++){
    //         let key = tempParsedFeedsKey[i];
    //         if(state.parsedFeeds[key].creatorId === action.payload){
    //             filteredParsedFeeds[key] = state.parsedFeeds[key];
    //         }
    //     }
    //     let tempEditededsKey = Object.keys(state.editedFeeds).map(strElement => Number.parseInt(strElement));
    //     let filteredEditedFeeds : {[key: number] : IFeedResponse} = {};
    //     for(let i = 0; i < tempEditededsKey.length; i++){
    //         let key = tempEditededsKey[i];
    //         if(state.editedFeeds[key].creatorId === action.payload){
    //             filteredEditedFeeds[key] = state.parsedFeeds[key];
    //         }
    //     }
    //     state.editedFeeds = filteredEditedFeeds;
    //     state.parsedFeeds = filteredParsedFeeds;
    // },
    setValueOfTheElement: (state, action: PayloadAction<IEditPayload>) => {
      let foundPost: IFeedResponse = state.editedFeeds[action.payload.feedId];
      foundPost[action.payload.element] = action.payload.valueOfTheElement;
      state.editedFeeds[action.payload.feedId] = foundPost;
    },
    bringbackToNeutral: (state) => {
      state.parsedFeeds = {};
      state.editedFeeds = {};
      state.inProgress = false;
      state.parsingErrorMessage = "";
      state.editingInProgress = false;
      state.editingErrorMessage = "";
      state.editingSuccessfulMessage = "";
    },
    editingStarted: (state) => {
      state.editingInProgress = true;
      state.editingErrorMessage = "";
      state.editingSuccessfulMessage = "";
    },
    editingFailed: (state, action: PayloadAction<string>) => {
      state.editingInProgress = false;
      state.editingErrorMessage = action.payload;
      state.editingSuccessfulMessage = "";
    },
    editingSuccessful: (state, action: PayloadAction<number>) => {
      state.editingInProgress = false;
      state.editingErrorMessage = "";
      state.inProgress = false;
      state.parsingErrorMessage = "";
      state.editingSuccessfulMessage = "Changes successfully saved";
      state.parsedFeeds[action.payload] = state.editedFeeds[action.payload];
    },
    clearEditingErrorMessage: (state) => {
      state.editingErrorMessage = "";
    },
    clearEditingSuccessfulMessage: (state) => {
      state.editingSuccessfulMessage = "";
    },
    resetChanges: (state, action: PayloadAction<number>) => {
      state.editedFeeds[action.payload] = state.parsedFeeds[action.payload];
    },
    stopParsing: (state) => {
      state.inProgress = false;
    }
  },
});

//export regular actions
export const {
  setValueOfTheElement,
  clearErrorMessage,
  bringbackToNeutral,
  clearEditingErrorMessage,
  clearEditingSuccessfulMessage,
  resetChanges,
} = editSlice.actions;

//export selectors
export const selectIfParsingErrorMessage = (state: RootState) =>
  state.edit.parsingErrorMessage;
export const selectIfParsing = (state: RootState) => state.edit.inProgress;
export const selectIfEditing = (state: RootState) =>
  state.edit.editingInProgress;
export const selectIfErrorInEditing = (state: RootState) =>
  state.edit.editingErrorMessage;
export const selectIfeditingSuccessful = (state: RootState) =>
  state.edit.editingSuccessfulMessage;
export const selectEditablePost = (id: number) => (state: RootState) =>
  state.edit.editedFeeds[id];

const { parsingStarted, parsingFailed, parsingSuccessful, stopParsing } = editSlice.actions;
//export thunk
export const parseFeedThunk =
  (feedId: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(parsingStarted());
    if (!Object.keys(getState().edit.editedFeeds).includes(feedId.toString())) {
      
      let currentUserId = getState().authentication.currentUser.id;
      axios
        .get(`${REACT_APP_API_ENDPOINT}/Feeds/${feedId}`)
        .then((response: AxiosResponse<IDetailedFeedResponse>) => {
          let obj = response.data.feedInfo;
          if (obj.creatorId === currentUserId) {
            dispatch(parsingSuccessful(obj));
          } else {
            dispatch(
              parsingFailed("You are not authenticated to edit the post!")
            );
          }
        })
        .catch((err) => {
          dispatch(parsingFailed(err.message + "!"));
        });
    }else{
      dispatch(stopParsing())
    }
  };
const { editingFailed, editingStarted, editingSuccessful } = editSlice.actions;
export const editThunk =
  (feedId: number): AppThunk =>
  (dispatch, getState) => {
    let editedPost = getState().edit.editedFeeds[feedId];
    let reqBody: ICreateFeedRequest = {
      Title: editedPost.title,
      Content: editedPost.content,
    };
    dispatch(editingStarted());
    let config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
      },
    };
    axios
      .put(`${REACT_APP_API_ENDPOINT}/Feeds/${feedId}`, reqBody, config)
      .then(() => dispatch(editingSuccessful(feedId)))
      .catch((err) => dispatch(editingFailed(err.message)));
  };
export default editSlice.reducer;
