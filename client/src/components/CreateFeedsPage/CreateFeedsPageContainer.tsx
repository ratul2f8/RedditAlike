import {
  DefaultButton,
  IIconProps,
  IStackTokens,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  Stack,
  TextField,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  selectFeedStatus,
  selectIfError,
  selectIfInProgress,
  selectSuccessfulMessage,
  createFeedThunk,
  setContent,
  setTitle,
  clearErrorMessage,
  clearSuccessfulMessage,
  clearMessages,
} from "../../redux/Feed/CreateFeedSlice";

const createIconProps: IIconProps = { iconName: "Accept" };
const goBackIconProps: IIconProps = { iconName: "Back" };
interface IProps extends RouteComponentProps {}
const CreateFeedsPageContainer: React.FC<IProps> = ({ history }) => {
  const rootStackToken: IStackTokens = { childrenGap: 20 };
  const dispatch = useDispatch();
  const { Title: title, Content: content } = useSelector(selectFeedStatus);
  const inProgress = useSelector(selectIfInProgress);
  const stackToken: IStackTokens = { childrenGap: 8 };
  const creationInProgress = useSelector(selectIfInProgress);
  const creationErrorMessage = useSelector(selectIfError);
  const successfulMessage = useSelector(selectSuccessfulMessage);
  const validityCheck = () =>
    title.trim().length !== 0 && content.trim().length !== 0;
  React.useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);
  return (
    <Stack
      horizontalAlign="center"
      style={{
        height: "auto",
        width: "100%",
        paddingTop: 0,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        overflow: "auto",
      }}
      tokens={rootStackToken}>
      <Stack
        tokens={stackToken}
        style={{
          padding: 15,
          height: "auto",
          width: "99%",
          maxWidth: "99%",
        }}>
        <TextField
          multiline
          required
          disabled={inProgress}
          resizable={false}
          value={title}
          onChange={(_, value) => dispatch(setTitle(value + ""))}
          label="Title"
          style={{ fontWeight: 600 }}
          placeholder="Enter title of the post..."
        />
        <TextField
          multiline
          disabled={inProgress}
          required
          resizable={false}
          value={content}
          onChange={(_, value) => dispatch(setContent(value + ""))}
          label="Content"
          rows={15}
          placeholder="Enter contents of the post..."
        />
        {creationInProgress && (
          <Spinner label="In progress,Please wait..." labelPosition="bottom" />
        )}
        {creationErrorMessage.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={() => dispatch(clearErrorMessage())}>
            {creationErrorMessage}
          </MessageBar>
        )}
        {successfulMessage.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.success}
            onDismiss={() => dispatch(clearSuccessfulMessage())}>
            {successfulMessage}
          </MessageBar>
        )}
        <Stack horizontal style={{ justifyContent: "space-between" }}>
          <DefaultButton
            disabled={inProgress}
            iconProps={goBackIconProps}
            style={{ border: "none" }}
            onClick={() => history.goBack()}>
            Go Back
          </DefaultButton>
          <PrimaryButton
            onClick={() => dispatch(createFeedThunk())}
            disabled={inProgress || !validityCheck()}
            iconProps={createIconProps}>
            Create
          </PrimaryButton>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default withRouter(CreateFeedsPageContainer);
