import { getTheme } from "@fluentui/style-utilities";
import {
  IStackTokens,
  ITextFieldStyles,
  Stack,
  TextField,
  Text,
  IIconProps,
  DefaultButton,
  PrimaryButton,
  SharedColors,
  MessageBar,
  MessageBarType,
  ActionButton,
  Spinner,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as EmailValidator from "email-validator";
import {
  setEmail,
  setPassword,
  setFullName as setName,
  selectCredentialsObject,
  selectIfError,
  selectIfLoading,
  selectSignupSuccessfulMessage,
  signUpUserThunk,
  clearSignUpSuccessfulMessage,
  clearErrorMessage,
  bringbackToNeutral,
} from "../redux/User/SignUpSlice";
import { changeSection } from "../redux/Section/Section.Slice";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";

const SignupPage: React.FC<RouteComponentProps> = ({ history, location }) => {
  const theme = getTheme();
  const dispatch = useDispatch();
  const userCreationError = useSelector(selectIfError);
  const userCreationSuccess = useSelector(selectSignupSuccessfulMessage);
  const creatingUserInProgress = useSelector(selectIfLoading);
  const stackToken: IStackTokens = { childrenGap: 15 };
  const {
    FullName: name,
    Email: email,
    Password: password,
  } = useSelector(selectCredentialsObject);
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: "80%" },
  };
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  const homeIconProps: IIconProps = { iconName: "Home" };
  const signInIconsProps: IIconProps = { iconName: "Signin" };
  const validityCheck = () =>
    password.trim().length > 4 &&
    email.trim().length >= 4 &&
    name.trim().length !== 0 &&
    EmailValidator.validate(email.trim());
  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
    dispatch(bringbackToNeutral());
  },[dispatch, location.pathname]);
  return (
    <div className="signup-container">
      {authenticatedBefore && <Redirect to="/feeds" />}
      <Stack
        tokens={stackToken}
        style={{
          boxShadow: theme.effects.elevation64,
          backgroundColor: "white",
          height: "auto",
          width: "95%",
          maxWidth: "500px",
          paddingTop: 30,
          paddingBottom: 30,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <Stack horizontal>
          <DefaultButton
            iconProps={homeIconProps}
            onClick={() => history.push("/")}
            disabled={creatingUserInProgress}
            style={{
              marginLeft: "auto",
              backgroundColor: SharedColors.blueMagenta40,
              color: "white",
            }}>
            Back To Home
          </DefaultButton>
        </Stack>
        <Text variant="xLarge">Sign Up...</Text>
        <TextField
          disabled={creatingUserInProgress}
          borderless
          underlined
          required
          styles={textFieldStyles}
          type="text"
          value={name}
          onChange={(_, value) => dispatch(setName(value + ""))}
          placeholder="Enter your full name"
          label="Name "
        />
        <TextField
          disabled={creatingUserInProgress}
          borderless
          underlined
          required
          styles={textFieldStyles}
          type="text"
          value={email}
          onChange={(_, value) => dispatch(setEmail(value + ""))}
          placeholder="Enter a valid email address"
          label="Email"
        />
        <TextField
          disabled={creatingUserInProgress}
          required
          borderless
          underlined
          styles={textFieldStyles}
          type="password"
          value={password}
          placeholder="Password must be at least 4 characters long"
          onChange={(_, value) => dispatch(setPassword(value + ""))}
          label="Password"
        />
        {creatingUserInProgress && (
          <Spinner label="In progress,Please wait..." labelPosition="bottom" />
        )}
        {userCreationError.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={() => dispatch(clearErrorMessage())}>
            {userCreationError}
          </MessageBar>
        )}
        {userCreationSuccess.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.success}
            onDismiss={() => dispatch(clearSignUpSuccessfulMessage())}>
            {userCreationSuccess}
          </MessageBar>
        )}

        <Stack horizontal horizontalAlign="space-between">
          <ActionButton
            onClick={() => history.push("login")}
            disabled={creatingUserInProgress}>
            Click here to Login
          </ActionButton>
          <PrimaryButton
            onClick={() => dispatch(signUpUserThunk())}
            iconProps={signInIconsProps}
            disabled={!validityCheck() || creatingUserInProgress}>
            Sign Up
          </PrimaryButton>
        </Stack>
      </Stack>
    </div>
  );
};
export default withRouter(SignupPage);
