import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";
import axios, { AxiosResponse } from "axios";

export interface IInitialState {
  loading: boolean;
  open: boolean;
  successfulMessage: string;
  errorMessage: string;
}
const initialState: IInitialState = {
  loading: false,
  open: false,
  successfulMessage: "",
  errorMessage: "",
};

const {
  REACT_APP_API_ENDPOINT,
  REACT_APP_SERVICE_KEY,
  REACT_APP_TEMPLATE_ID,
  REACT_APP_CURRENT_APPLICATION_URL,
  REACT_APP_EMAILJS_USER_ID,
  REACT_APP_EMAILJS_API_ENDPOINT,
} = process.env;
const changePasswordSlice = createSlice({
  name: "change-password",
  initialState,
  reducers: {
    openModal: (state) => {
      state.loading = false;
      state.open = true;
      state.successfulMessage = "";

      state.errorMessage = "";
    },
    closeModal: (state) => {
      state.loading = false;
      state.open = false;
      state.successfulMessage = "";
      state.errorMessage = "";
    },
    processStarted: (state) => {
      state.loading = true;
      state.successfulMessage = "";
      state.errorMessage = "";
    },
    processFailed: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.open = false;
      state.successfulMessage = "";
      state.errorMessage = action.payload;
    },
    processSuccessful: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.open = false;
      state.successfulMessage = action.payload;
      state.errorMessage = "";
    },
  },
});
export const {
  closeModal,
  openModal,
  processStarted,
  processSuccessful,
  processFailed,
} = changePasswordSlice.actions;
const sendEmailThunk =
  (token: string, email: string): AppThunk =>
  (dispatch) => {
    let url = `${window.location.origin}/change-password/${token}`;
    var data = {
      service_id: REACT_APP_SERVICE_KEY,
      template_id: REACT_APP_TEMPLATE_ID,
      user_id: REACT_APP_EMAILJS_USER_ID,
      template_params: {
        to_email: email,
        message: url,
      },
    };
    axios
      .post(`${REACT_APP_EMAILJS_API_ENDPOINT}`, data)
      .then(() => dispatch(closeModal()))
      .catch((err) => {
        console.log(err.message);
        dispatch(closeModal());
      });
  };
//export thunk
export const changePasswordThunk =
  (password: string, token: string): AppThunk =>
  (dispatch) => {
    dispatch(processStarted());
    axios
      .put(`${REACT_APP_API_ENDPOINT}/Users/changepassword`, {
        Token: token,
        Password: password,
      })
      .then(() => dispatch(processSuccessful("Password changed successfully")))
      .catch((err) => dispatch(processFailed(err.message)));
  };

export const getTokenThunk =
  (email: string): AppThunk =>
  (dispatch) => {
    dispatch(processStarted());
    axios
      .put(`${REACT_APP_API_ENDPOINT}/Users/gettoken`, { Email: email })
      .then((response: AxiosResponse<string>) =>
        dispatch(sendEmailThunk(response.data, email))
      )
      .catch((err) => dispatch(closeModal()));
  };
//export selectors
export const selectIfError = (state: RootState) =>
  state.changePassword.errorMessage;
export const selectIfLoading = (state: RootState) =>
  state.changePassword.loading;
export const selectSuccessfulMessage = (state: RootState) =>
  state.changePassword.successfulMessage;
export const selectIfModalOpen = (state: RootState) =>
  state.changePassword.open;
export default changePasswordSlice.reducer;
