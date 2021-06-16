import { createSlice } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig } from "axios";
import { removeComment } from "../FeedDetails/FeedDetailsSlice";
import { AppThunk, RootState } from "../store";
import { removeCommentFromMyPost } from "../MyPosts/MyPostSlice";

export interface IInitialState {
  removing: boolean;
}

const initialState: IInitialState = {
  removing: false,
};

const { REACT_APP_API_ENDPOINT } = process.env;

const commentRemovalSlice = createSlice({
  name: "removeComment",
  initialState,
  reducers: {
    removingStarted: (state) => {
      state.removing = true;
    },
    removalFailed: (state) => {
      state.removing = false;
    },
    removalSuccessful: (state) => {
      state.removing = false;
    },
  },
});

//export thunk
const { removalFailed, removalSuccessful, removingStarted } =
  commentRemovalSlice.actions;
export const removeCommentThunk =
  (commentId: number): AppThunk =>
  (dispatch, getState) => {
    dispatch(removingStarted());
    let config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${getState().authentication.currentUser.jwt}`,
      },
    };
    axios
      .delete(`${REACT_APP_API_ENDPOINT}/FeedComments/${commentId}`, config)
      .then(() => {
        dispatch(removeComment(commentId));
        dispatch(removeCommentFromMyPost(commentId));
        dispatch(removalSuccessful());
      })
      .catch((err) => {
        dispatch(removalFailed());
      });
  };
//export selectors
export const selectIFRemoving = (state: RootState) => state.comment.removing;

export default commentRemovalSlice.reducer;
