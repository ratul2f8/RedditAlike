import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
export interface ISectionState {
  currentSection: string;
  isModalMenuOpen: boolean;
}
const initialState: ISectionState = {
  currentSection: "feeds",
  isModalMenuOpen: false,
};

export const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    changeSection: (state, action: PayloadAction<string>) => {
      let extractedFirstPath = action.payload.substring(1).split("/")[0];
      state.currentSection =
        extractedFirstPath === "" ? "feeds" : extractedFirstPath;
      state.isModalMenuOpen = false;
    },
    toggleModalMenu: (state) => {
      let previousState = state.isModalMenuOpen;
      state.isModalMenuOpen = !previousState;
    },
  },
});
export const selectCurrentSection = (state: RootState) =>
  state.section.currentSection;
export const selectIfModalMenuOpen = (state: RootState) =>
  state.section.isModalMenuOpen;
export const { changeSection, toggleModalMenu } = sectionSlice.actions;
export default sectionSlice.reducer;
