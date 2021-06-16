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
  Spinner,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";
import { Redirect } from "react-router-dom";
import {
  selectIfError,
  selectIfLoading,
  changePasswordThunk,
  selectSuccessfulMessage,
} from "../redux/ChangePassword/ChangePasswordSlice";

const ChangePasswordPage: React.FC<
  RouteComponentProps<{
    token: string;
  }>
> = ({ history, location, match }) => {
  const theme = getTheme();
  const { token } = match.params;
  const dispatch = useDispatch();
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  const stackToken: IStackTokens = { childrenGap: 15 };
  const inProgress = useSelector(selectIfLoading);
  const errorMessage = useSelector(selectIfError);
  const [password, setPassword] = React.useState("");
  const successfulMessage = useSelector(selectSuccessfulMessage);
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: "80%" },
  };
  const homeIconProps: IIconProps = { iconName: "Home" };
  const signInIconsProps: IIconProps = { iconName: "Signin" };
  const validityCheck = () => password.trim().length <= 4;

  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
  }, [dispatch, location.pathname]);
  return (
    <div className="changepassword-container">
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
        <Text variant="xLarge">Change Password...</Text>

        <TextField
          disabled={inProgress || successfulMessage.length !== 0}
          required
          borderless
          underlined
          styles={textFieldStyles}
          type="password"
          value={password}
          placeholder="Enter password"
          onChange={(_, value) => setPassword(value + "")}
          label="Password"
        />
        {inProgress && (
          <Spinner label="In Progress,Please wait..." labelPosition="bottom" />
        )}
        {errorMessage.length !== 0 && (
          <MessageBar messageBarType={MessageBarType.error}>
            {errorMessage}
          </MessageBar>
        )}
        {successfulMessage.length !== 0 && (
          <MessageBar messageBarType={MessageBarType.success}>
            {successfulMessage}
          </MessageBar>
        )}
        <Stack horizontal horizontalAlign="center" verticalAlign="center">
          <PrimaryButton
            iconProps={signInIconsProps}
            onClick={() => {
              dispatch(changePasswordThunk(password, token));
              setPassword("");
            }}
            disabled={
              validityCheck() || inProgress || successfulMessage.length !== 0
            }>
            Change Password
          </PrimaryButton>
        </Stack>
      </Stack>
    </div>
  );
};
export default withRouter(ChangePasswordPage);
