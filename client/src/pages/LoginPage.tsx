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
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import {
  setIdentifier,
  setPassword,
  selectIsProgressing,
  selectIfError,
  selectCredentials,
  clearErrorMessage,
  loginThunk,
  bringbackToNeutral,
} from "../redux/User/SignInSlice";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";
import { Redirect } from "react-router-dom";
import * as EmailValidator from "email-validator";
import { openModal, selectIfModalOpen } from "../redux/ChangePassword/ChangePasswordSlice";
import ChangePasswordModal from "../components/Common/ChangePasswordModal";

const LoginPage: React.FC<RouteComponentProps> = ({ history, location }) => {
  const theme = getTheme();
  const dispatch = useDispatch();
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  const stackToken: IStackTokens = { childrenGap: 15 };
  const inProgress = useSelector(selectIsProgressing);
  const errorMessage = useSelector(selectIfError);
  const modalOpen = useSelector(selectIfModalOpen);
  
  const { Email: identifier, Password: password } =
    useSelector(selectCredentials);
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: "80%" },
  };
  const homeIconProps: IIconProps = { iconName: "Home" };
  const signInIconsProps: IIconProps = { iconName: "Signin" };
  const validityCheck = () =>
    password.trim().length > 4 &&
    identifier.trim().length >= 4 &&
    EmailValidator.validate(identifier.trim());

  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
    dispatch(bringbackToNeutral());
  }, [dispatch, location.pathname]);
  return (
    <div className="login-container">
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
            disabled={inProgress}
            iconProps={homeIconProps}
            onClick={() => history.push("/")}
            style={{
              marginLeft: "auto",
              backgroundColor: SharedColors.blueMagenta40,
              color: "white",
            }}>
            Back To Home
          </DefaultButton>
        </Stack>
        <Text variant="xLarge">Sign in...</Text>
        <TextField
          disabled={inProgress}
          borderless
          underlined
          required
          styles={textFieldStyles}
          type="text"
          value={identifier}
          onChange={(_, value) => dispatch(setIdentifier(value + ""))}
          placeholder="Enter a valid email address"
          label="Email"
        />
        <TextField
          disabled={inProgress}
          required
          borderless
          underlined
          styles={textFieldStyles}
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(_, value) => dispatch(setPassword(value + ""))}
          label="Password"
        />
        {inProgress && (
          <Spinner label="Signing in,Please wait..." labelPosition="bottom" />
        )}
        {errorMessage.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={() => dispatch(clearErrorMessage())}>
            {errorMessage}
          </MessageBar>
        )}
        <Stack horizontal horizontalAlign="space-between">
          <ActionButton
            onClick={() => history.push("signup")}
            disabled={inProgress}>
            Click here to SignUp
          </ActionButton>
          <PrimaryButton
            iconProps={signInIconsProps}
            onClick={() => dispatch(loginThunk())}
            disabled={!validityCheck() || inProgress}>
            Sign in
          </PrimaryButton>
        </Stack>
        <Stack horizontal horizontalAlign="center" verticalAlign="center">
          <ActionButton
            onClick={() => dispatch(openModal())}
            disabled={inProgress}>
            Forgot Password?
          </ActionButton>
    
        </Stack>
      </Stack>
      {
        modalOpen && <ChangePasswordModal/>
      }
    </div>
  );
};
export default withRouter(LoginPage);
