import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { AppThunk, RootState } from "../store";
import { bringbackToNeutral } from "../Feed/CreateFeedSlice";
import { bringbackToNeutral as initializeEditState} from "../Feed/EditFeedSlice";
import { ILoginResponse } from "./types";

export interface IInitialState {
  currentUser: ILoginResponse;
  authenticatedBefore: boolean;
  expire: number | undefined;
}
export interface IUpdateDootStatus{
  feedId: string;
  dootType: number
}
const initialAuthInfo : ILoginResponse = {
  fullName: "",
    createdAt: "",
    updatedAt: "",
    email: "",
    id: "",
    jwt: "",
    dootsMetadata: {}
}
const initialState: IInitialState = {
  currentUser: initialAuthInfo,
  authenticatedBefore: false,
  expire: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    placeAuthenticationCredentials: (
      state,
      action: PayloadAction<ILoginResponse>
    ) => {
      let extractedInfo = jwt_decode<JwtPayload>(action.payload.jwt);
      state.currentUser = action.payload;
      state.expire = extractedInfo.exp;
      state.authenticatedBefore = true;
    },
    logout: (state) => {
      state.currentUser = initialAuthInfo;
      state.authenticatedBefore = false;
      state.expire = undefined
    },
    updateDootsMetadata: (state, action:PayloadAction<IUpdateDootStatus>) => {
      state.currentUser.dootsMetadata[action.payload.feedId] = action.payload.dootType
    }
  },
});
//export regular actions
export const { placeAuthenticationCredentials , logout, updateDootsMetadata} = userSlice.actions;
//export thunk
export const logOutThunk = ():AppThunk => (dispatch) => {
  dispatch(bringbackToNeutral());
  dispatch(initializeEditState());
  dispatch(logout());
}

//export selectors//
export const selectExpire = (state: RootState) => state.authentication.expire;
export const selectAuthInfo = (state: RootState) =>
  state.authentication.currentUser;
export const selectIfAuthenticatedBefore = (state: RootState) =>
  state.authentication.authenticatedBefore;
export const selectDootStatusOfTheFeed = (feedId: number) => (state: RootState) => state.authentication.currentUser.dootsMetadata[feedId.toString()]

export default userSlice.reducer;
