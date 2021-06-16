import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { AppThunk, RootState } from "../store";
import { ICreateUserRequest } from "./types";
const { REACT_APP_API_ENDPOINT } = process.env;
export interface IInitialState {
  Credentials: ICreateUserRequest;
  signingUp: boolean;
  errorinSigningUp: string;
  signUpSuccessfulMessage: string;
}

const initialUserCredential: ICreateUserRequest = {
  FullName: "",
  Email: "",
  Password: "",
};
const initialState: IInitialState = {
  Credentials: initialUserCredential,
  signingUp: false,
  errorinSigningUp: "",
  signUpSuccessfulMessage: "",
};

const signUpSlice = createSlice({
  name: "sign-up",
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      let curreentCredential = { ...state.Credentials };
      state.Credentials = {
        ...curreentCredential,
        Email: action.payload,
      };
    },
    setPassword: (state, action: PayloadAction<string>) => {
      let curreentCredential = { ...state.Credentials };
      state.Credentials = {
        ...curreentCredential,
        Password: action.payload,
      };
    },
    setFullName: (state, action: PayloadAction<string>) => {
      let curreentCredential = { ...state.Credentials };
      state.Credentials = {
        ...curreentCredential,
        FullName: action.payload,
      };
    },
    signUpStarted: (state) => {
      state.signingUp = true;
      state.errorinSigningUp = "";
      state.signUpSuccessfulMessage = "";
    },
    signUpFailed: (state, action: PayloadAction<string>) => {
      state.signingUp = false;
      state.errorinSigningUp = action.payload;
      state.signUpSuccessfulMessage = "";
    },
    signUpSuccessful: (state) => {
      state.signingUp = false;
      state.errorinSigningUp = "";
      state.signUpSuccessfulMessage =
        "User creation successful! Please login to continue...";
      state.Credentials = initialUserCredential;
    },
    clearSignUpSuccessfulMessage: (state) => {
      state.signUpSuccessfulMessage = "";
    },
    clearErrorMessage: (state) => {
      state.errorinSigningUp = "";
    },
    bringbackToNeutral: (state) => {
      state.Credentials = initialUserCredential;
      state.errorinSigningUp = "";
      state.signUpSuccessfulMessage = "";
      state.signingUp = false;
    }
  },
});
//export regular actions
export const {
  clearSignUpSuccessfulMessage,
  setEmail,
  setFullName,
  setPassword,
  clearErrorMessage,
  bringbackToNeutral
} = signUpSlice.actions;

const { signUpFailed, signUpStarted, signUpSuccessful } = signUpSlice.actions;
//export thunk
export const signUpUserThunk = (): AppThunk => (dispatch, getState) => {
  dispatch(signUpStarted());
  console.log(REACT_APP_API_ENDPOINT);
  axios
    .post(`${REACT_APP_API_ENDPOINT}/Users`, getState().signup.Credentials)
    .then(() => dispatch(signUpSuccessful()))
    .catch((err) => {
      let message = err.message + "!";
      if (message.includes("400")) {
        dispatch(signUpFailed("Email already taken!"));
      } else {
        dispatch(signUpFailed(message));
      }
    });
};

//export selectors
export const selectCredentialsObject = (state: RootState) =>
  state.signup.Credentials;
export const selectIfLoading = (state: RootState) => state.signup.signingUp;
export const selectIfError = (state: RootState) =>
  state.signup.errorinSigningUp;
export const selectSignupSuccessfulMessage = (state: RootState) =>
  state.signup.signUpSuccessfulMessage;
export default signUpSlice.reducer;