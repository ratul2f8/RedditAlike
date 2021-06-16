import {
  ActionButton,
  CompoundButton,
  getTheme,
  IIconProps,
  IStackTokens,
  Persona,
  PersonaInitialsColor,
  PersonaPresence,
  PersonaSize,
  Stack
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";

interface IProps extends RouteComponentProps {
  
}
const signUpIconProps: IIconProps = { iconName: "AddFriend" };
const SignedOut: React.FC<IProps> = ({ history }) => {
  const theme = getTheme();
  const stackToken: IStackTokens = { childrenGap: 20 };
  return (
    <React.Fragment>
      <Stack
        tokens={stackToken}
        style={{
          // height: "70%",
          height: "100%",
          overflow: "hidden",
          boxShadow: theme.effects.elevation64,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        {/* <TextView as="h3">Hello there...</TextView> */}
        <div
          style={{
            width: "100%",
            overflow: "hidden",
            paddingLeft: "20%",
            paddingTop: 20,
            marginTop: 0,
          }}>
          <Persona
            imageAlt="avatar-logo"
            presence={PersonaPresence.blocked}
            initialsColor={PersonaInitialsColor.gray}
            size={PersonaSize.size100}
          />
        </div>
        <CompoundButton
          onClick={() => history.push("/login")}
          primary
          secondaryText="Please sign in to explore more...">
          Sign In
        </CompoundButton>
        <Stack
          style={{
            marginTop: "auto",
            marginBottom: 10,
          }}>
          <ActionButton
            iconProps={signUpIconProps}
            onClick={() => history.push("/signup")}>
            Create an account
          </ActionButton>
          <a target="blank" href="https://github.com/ratul2f8">
            <ActionButton iconProps={{ iconName: "GitGraph" }}>
              Creator's GitHub Profile
            </ActionButton>
          </a>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};
export default withRouter(SignedOut);
