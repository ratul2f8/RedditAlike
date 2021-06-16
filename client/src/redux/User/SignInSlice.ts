import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { AppThunk, RootState } from "../store";
import { ILoginRequest, ILoginResponse } from "./types";
import { placeAuthenticationCredentials } from "./UserSlice";
const { REACT_APP_API_ENDPOINT } = process.env;

export interface IInitialState{
    Credentials: ILoginRequest,
    inProgress: boolean,
    errorMessage: string
}
const initialLoginRequest: ILoginRequest = {
    Email: "",
    Password: ""
}
const initialState: IInitialState  = {
    Credentials: initialLoginRequest,
    inProgress: false,
    errorMessage: ""
}

const signInSlice = createSlice({
    name: "signin",
    initialState,
    reducers : {
        setIdentifier: (state, action:PayloadAction<string>) => {
            let currentCreedntials = state.Credentials;
            state.Credentials = {
                ...currentCreedntials,
                Email: action.payload
            }
        },
        setPassword: (state, action:PayloadAction<string>) => {
            let currentCreedntials = state.Credentials;
            state.Credentials = {
                ...currentCreedntials,
                Password: action.payload
            }
        },
        signInStarted : (state) => {
            state.errorMessage = "";
            state.inProgress = true;
        },
        signInFailed: (state, action: PayloadAction<string>) => {
            state.errorMessage = action.payload;
            state.inProgress = false;
        },
        signInSuccess: (state) => {
            state.errorMessage = "";
            state.inProgress = false;
            state.Credentials = initialLoginRequest;
        },
        clearErrorMessage : (state) => {
            state.errorMessage = ""
        },
        bringbackToNeutral : (state) => {
            state.Credentials = initialLoginRequest;
            state.errorMessage = "";
            state.inProgress = false;
        }
    }
})

//export regular actions
export const { setIdentifier, setPassword, clearErrorMessage, bringbackToNeutral } = signInSlice.actions;

const { signInFailed, signInStarted, signInSuccess } = signInSlice.actions;
//export thunk
export const loginThunk = ():AppThunk => (dispatch, getState) => {
    dispatch(signInStarted());
    axios.put(`${REACT_APP_API_ENDPOINT}/Users/login`, getState().signin.Credentials)
    .then((response: AxiosResponse<ILoginResponse>) => {
        dispatch(signInSuccess());
        dispatch(placeAuthenticationCredentials(response.data))
    })
    .catch((err) => {
        let message = err.message + "";
        if(message.includes("400") || message.includes("404")){
            dispatch(signInFailed("Password/Email don't match!"))
        }else{
            dispatch(signInFailed(message))
        }
    })
}
//export selectors
export const selectIfError = (state: RootState) => state.signin.errorMessage;
export const selectIsProgressing = (state: RootState) => state.signin.inProgress;
export const selectCredentials = (state: RootState) => state.signin.Credentials;

export default signInSlice.reducer;