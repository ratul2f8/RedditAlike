import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import sectionReducer from "../redux/Section/Section.Slice";
import { combineReducers } from 'redux'; 
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import userReducer from "../redux/User/UserSlice";
import storage from "redux-persist/lib/storage";
import signupReducer from "../redux/User/SignUpSlice";
import signinReducer from "../redux/User/SignInSlice";
import createFeedReducer from "./Feed/CreateFeedSlice"
import editSlice from "./Feed/EditFeedSlice";
import feedsReducer from "./Feed/FeedSlice";
import dootSliceReducer from "./Doot/DootSlice";
import feedSliceReducer from "./FeedDetails/FeedDetailsSlice";
import myPostSliceReducer from "./MyPosts/MyPostSlice";
import commentSliceReducer from "./Comments/CommentsSlice";
import infoSliceReducer from "./Info/InfoSlice";
import commentRemovalSlice from "./Comments/CommentSlice";
import changePasswordSlice from "./ChangePassword/ChangePasswordSlice";

const reducers = combineReducers({
  section: sectionReducer,
  authentication: userReducer,
  signup: signupReducer,
  signin: signinReducer,
  create: createFeedReducer,
  edit: editSlice,
  feeds: feedsReducer,
  doot: dootSliceReducer,
  feedDetails: feedSliceReducer,
  myPost: myPostSliceReducer,
  comments: commentSliceReducer,
  info: infoSliceReducer,
  comment: commentRemovalSlice,
  changePassword: changePasswordSlice
})
const persistConfig = {
  key : "root",
  storage: storage,
  whitelist: ["authentication", "create", "edit"]
}
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  })
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
