import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { updateNumberOfDoots } from "../Feed/FeedSlice";
import { updateDootsInDetailedView } from "../FeedDetails/FeedDetailsSlice";
import { AppThunk, RootState } from "../store";
import { updateDootsMetadata } from "../User/UserSlice";
import {
  IParseDootsRequest,
  IUpdateDootRequest,
  IUpdateDootResponse,
  IWhoLikedResponse,
} from "./type";

export interface IInitialState {
  dooting: boolean;
  parsing: boolean;
  dootsDetails: IWhoLikedResponse;
  parsingError: string;
}

const { REACT_APP_API_ENDPOINT } = process.env;
const initialState: IInitialState = {
  dooting: false,
  parsing: false,
  dootsDetails: {
    downDoots: [],
    upDoots: [],
  },
  parsingError: "",
};

const dootSlice = createSlice({
  name: "doot",
  initialState,
  reducers: {
    dootingStarted: (state) => {
      state.dooting = true;
      state.parsing = false;
      state.parsingError = "";
      state.dootsDetails = {
        downDoots: [],
        upDoots: [],
      };
    },
    dootingFinished: (state) => {
      state.dooting = false;
      state.parsing = false;
      state.parsingError = "";
      state.dootsDetails = {
        downDoots: [],
        upDoots: [],
      };
    },
    parsingDootsStarted: (state) => {
      state.dooting = false;
      state.parsing = true;
      state.parsingError = "";
      state.dootsDetails = {
        downDoots: [],
        upDoots: [],
      };
    },
    parsingDootsFailed: (state, action: PayloadAction<string>) => {
      state.dooting = false;
      state.parsing = false;
      state.parsingError = action.payload;
      state.dootsDetails = {
        downDoots: [],
        upDoots: [],
      };
    },
    parsingDootsSuccessful: (
      state,
      action: PayloadAction<IWhoLikedResponse>
    ) => {
      state.dooting = false;
      state.parsing = false;
      state.parsingError = "";
      state.dootsDetails = action.payload;
    },
  },
});

const {
  dootingStarted,
  dootingFinished,
  parsingDootsStarted,
  parsingDootsFailed,
  parsingDootsSuccessful,
} = dootSlice.actions;
//export thunk
export const dootingStartedThunk =
  (request: IUpdateDootRequest): AppThunk =>
  (dispatch, getState) => {
    dispatch(dootingStarted());
    let config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
      },
    };
    axios
      .put(
        `${REACT_APP_API_ENDPOINT}/DootFeeds`,
        { FeedId: request.FeedId, DootType: request.DootType },
        config
      )
      .then((response: AxiosResponse<IUpdateDootResponse>) => {
        if (request.whereToStart === -1) {
          //bad practices: temporary solution to update doots in detailed view
          axios
            .get(`${REACT_APP_API_ENDPOINT}/Feeds/whoDooted/${request.FeedId}`)
            .then((response2: AxiosResponse<IWhoLikedResponse>) => {
              dispatch(
                updateDootsInDetailedView({
                  downDoots: response2.data.downDoots,
                  upDoots: response2.data.upDoots,
                  middleRequsetSuccess: true,
                  numberOfDoots: response.data.overallDootStatus,
                })
              );
            })
            .catch((err) => {
              dispatch(
                updateDootsInDetailedView({
                  downDoots: [],
                  upDoots: [],
                  middleRequsetSuccess: false,
                  numberOfDoots: response.data.overallDootStatus,
                })
              );
            });
        } else {
          dispatch(
            updateNumberOfDoots({
              key: request.whereToStart,
              postId: request.FeedId,
              numberOfDoots: response.data.overallDootStatus,
            })
          );
        }
        dispatch(
          updateDootsMetadata({
            feedId: request.FeedId.toString(),
            dootType: response.data.updatedDootType,
          })
        );
        dispatch(dootingFinished());
      })
      .catch((error) => {
        dispatch(dootingFinished());
      });
  };

export const parseDootsThunk =
  (request: IParseDootsRequest): AppThunk =>
  (dispatch) => {
    dispatch(parsingDootsStarted());
    axios
      .get(`${REACT_APP_API_ENDPOINT}/Feeds/whoDooted/${request.FeedId}`)
      .then((response: AxiosResponse<IWhoLikedResponse>) => {
        const { upDoots, downDoots } = response.data;
        if (request.whereToStart === -1) {
          //Update Number of doots in myposts page
        } else {
          dispatch(
            updateNumberOfDoots({
              key: request.whereToStart,
              postId: request.FeedId,
              numberOfDoots: upDoots.length - downDoots.length,
            })
          );
        }
        dispatch(parsingDootsSuccessful(response.data));
      })
      .catch((err) => {
        dispatch(parsingDootsFailed(err.message));
      });
  };

//export selectors
export const selectIfDooting = (state: RootState) => state.doot.dooting;
export const selectIfParsing = (state: RootState) => state.doot.parsing;
export const selectParsingError = (state: RootState) => state.doot.parsingError;
export const selectParsedDoots = (state: RootState) => state.doot.dootsDetails;

export default dootSlice.reducer;
