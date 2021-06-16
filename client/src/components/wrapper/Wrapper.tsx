import {
  getTheme,
  IconButton,
  IIconProps,
  PrimaryButton,
  Stack,
  TextView,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import ModalMenu from "./ModalMenu";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
import { useSelector, useDispatch } from "react-redux";

import {
  selectCurrentSection,
  selectIfModalMenuOpen,
  toggleModalMenu,
} from "../../redux/Section/Section.Slice";
import { selectIfAuthenticatedBefore, selectExpire } from "../../redux/User/UserSlice";
import SessionExpiredModal from "../Common/SessionExpiredModal";

interface IProps extends RouteComponentProps {
  children?: React.ReactNode;
}
const PageTitlesByPathName: { [key: string]: string } = {
  feeds: "",
  liked: "Posts you like...",
  disliked: "Posts you dislike...",
  profile: "Posts composed by you ...",
  "create-feed": "Compose a post...",
  "edit-post": "Edit post...",
  "read-details": "Read post...",
  "mypost-details": "Details of my post..."
};
const Wrapper: React.FC<IProps> = ({ children, history }) => {
  const theme = getTheme();
  const dispatch = useDispatch();
  const signedUpBefore = useSelector(selectIfAuthenticatedBefore);
  const currentSection = useSelector(selectCurrentSection);
  const shouldGenerateCreatePostBanner = currentSection === "feeds";
  const signedIn = useSelector(selectIfAuthenticatedBefore);
  const isMenuOpen = useSelector(selectIfModalMenuOpen);
  const expire = useSelector(selectExpire);
  const menuOpenIconProps: IIconProps = {
    iconName: "WaffleOffice365",
  };
  const menuCloseIconProps: IIconProps = {
    iconName: "Cancel",
  };
  return (
    <div
      className="wrapper-background"
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        position: "relative",
      }}>
        {
          (signedIn && expire && (expire*1000 < new Date().getTime()))
          &&
          <SessionExpiredModal/>
        }
      {isMenuOpen && <ModalMenu isOpen={isMenuOpen} />}
      <div
        style={{
          width: "42%",
          maxWidth: "220px",
          height: "100%",
          //maxHeight: "700px",
        }}
        className="ms-hiddenSm">
        {signedIn ? <SignedIn /> : <SignedOut />}
      </div>

      <Stack
        style={{
          height: "100%",
          width: "100%",
          margin: 0,
          padding: 0,
        }}>
        {isMenuOpen && (
          <div
            className="ms-hiddenMd ms-hiddenXl ms-hiddenLg ms-hiddenXxl"
            onClick={() => dispatch(toggleModalMenu())}
            style={{
              position: "absolute",
              marginTop: 5,
              right: isMenuOpen ? 6 : "auto",
              zIndex: 20001,
              width: `${isMenuOpen ? "auto" : ""}`,
            }}>
            <IconButton iconProps={menuCloseIconProps} checked={true} />
          </div>
        )}
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="center"
          style={{
            margin: 0,
            padding: 3,
            height: "8%",
            maxHeight: "40px",
            width: "100%",
            justifyContent: "space-between",
          }}>
          {!isMenuOpen && (
            <IconButton
              iconProps={menuOpenIconProps}
              className="ms-hiddenMd ms-hiddenXl ms-hiddenLg ms-hiddenXxl"
              onClick={() => dispatch(toggleModalMenu())}
            />
          )}
          {shouldGenerateCreatePostBanner ? (
            <PrimaryButton
              disabled={!signedUpBefore}
              onClick={() => history.push("/create-feed")}
              style={{
                marginLeft: 8,
                marginRight: 8,
                boxShadow: theme.effects.elevation16,
              }}>
              Express your thoughts...
            </PrimaryButton>
          ) : (
            <TextView style={{ marginLeft: 10, marginRight: 10 }}>
              {PageTitlesByPathName[currentSection]}
            </TextView>
          )}
        </Stack>
        <Stack
          style={{
            height: "100%",
            width: "100%",
            margin: 0,
            padding: 0,
            overflow: "auto",
          }}>
          {children}
        </Stack>
      </Stack>
    </div>
  );
};
export default withRouter(Wrapper);
