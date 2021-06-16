import {
  getTheme,
  IIconProps,
  IStackTokens,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  PersonaSize,
  PrimaryButton,
  Stack,
  ActionButton
} from "@fluentui/react";
import React from "react";
import NavigationPanel from "./Navigations";
import { useDispatch, useSelector } from "react-redux";
import { logOutThunk, selectAuthInfo } from "../../redux/User/UserSlice";

interface IProps {
  
}

const signOutIconProps: IIconProps = { iconName: "UserRemove" };

const SignedIn: React.FC<IProps> = () => {
  const theme = getTheme();
  const stackToken: IStackTokens = { childrenGap: 20 };
  const dispatch = useDispatch();
  const { fullName } = useSelector(selectAuthInfo);
  return (
    <Stack
      tokens={stackToken}
      style={{
        height: "100%",
        overflow: "auto",
        boxShadow: theme.effects.elevation64,
        paddingLeft: 10,
        paddingRight: 10,
        zIndex: 2000,
      }}>
      {/* <TextView as="h3">Welcome</TextView> */}
      <div style={{ marginTop: 0, paddingTop: 20, width: "100%" }}>
        <Persona
          imageAlt="avatar-logo"
          presence={PersonaPresence.online}
          text={fullName}
          initialsColor={PersonaInitialsColor.darkGreen}
          size={PersonaSize.size56}
        />
      </div>
      <NavigationPanel />
      <Stack
        style={{
          marginTop: "auto",
          marginBottom: 10,
        }}>
        <PrimaryButton
          onClick={() => dispatch(logOutThunk())}
          iconProps={signOutIconProps}
          primary>
          Sign Out
        </PrimaryButton>
        <a target="blank" href="https://github.com/ratul2f8">
          <ActionButton iconProps={{ iconName: "GitGraph" }}>
            Creator's GitHub Profile
          </ActionButton>
        </a>
      </Stack>
    </Stack>
  );
};
export default SignedIn;
