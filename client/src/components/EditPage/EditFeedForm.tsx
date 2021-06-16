import {
  IIconProps,
  IStackTokens,
  Stack,
  TextField,
  DefaultButton,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SharedColors,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  selectEditablePost,
  setValueOfTheElement,
  clearEditingErrorMessage,
  clearEditingSuccessfulMessage,
  selectIfEditing,
  selectIfErrorInEditing,
  selectIfeditingSuccessful,
  resetChanges,
  editThunk,
} from "../../redux/Feed/EditFeedSlice";

interface IProps extends RouteComponentProps {
  feedId: number;
}
const createIconProps: IIconProps = { iconName: "Accept" };
const homeIconProps: IIconProps = { iconName: "Home" };
const EditFeedForm: React.FC<IProps> = ({ feedId, history }) => {
  const obj = useSelector(selectEditablePost(feedId));
  const { title, content } = {
    title: obj?.title ? obj.title : "",
    content: obj?.content ? obj.content : "",
  };
  const stackToken: IStackTokens = { childrenGap: 8 };
  const dispatch = useDispatch();
  const editingErrorMessage = useSelector(selectIfErrorInEditing);
  const editingSuccessfulMessage = useSelector(selectIfeditingSuccessful);
  const inProgress = useSelector(selectIfEditing);
  const validityCheck = () =>
    title.trim().length > 0 && content.trim().length > 0;
  return (
    <React.Fragment>
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
          resizable={false}
          value={title}
          disabled={inProgress}
          onChange={(_, value) =>
            dispatch(
              setValueOfTheElement({
                element: "title",
                feedId,
                valueOfTheElement: value + "",
              })
            )
          }
          label="Title"
          style={{ fontWeight: 600 }}
          placeholder="Enter title of the post..."
        />
        <TextField
          multiline
          required
          resizable={false}
          value={content}
          disabled={inProgress}
          onChange={(_, value) =>
            dispatch(
              setValueOfTheElement({
                element: "content",
                feedId,
                valueOfTheElement: value + "",
              })
            )
          }
          label="Content"
          rows={20}
          placeholder="Enter contents of the post..."
        />
        {inProgress && (
          <Spinner label="Saving Changes,Please wait..." labelPosition="bottom" />
        )}
        {editingErrorMessage.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.error}
            onDismiss={() => dispatch(clearEditingErrorMessage())}>
            {editingErrorMessage}
          </MessageBar>
        )}
        {editingSuccessfulMessage.length !== 0 && (
          <MessageBar
            messageBarType={MessageBarType.success}
            onDismiss={() => dispatch(clearEditingSuccessfulMessage())}>
            {editingSuccessfulMessage}
          </MessageBar>
        )}
        <Stack horizontal style={{ justifyContent: "space-between" }}>
          <DefaultButton
            iconProps={homeIconProps}
            style={{ border: "none" }}
            disabled={inProgress}
            onClick={() => history.push("/")}>
            Home
          </DefaultButton>
          <Stack tokens={{ childrenGap: 4 }} horizontal>
            <PrimaryButton
              style={{ border: "none", background: SharedColors.magenta20}}
              disabled={inProgress}
              onClick={() => dispatch(resetChanges(feedId))}
              iconProps={{ iconName: "RevToggleKey" }}>
              Reset
            </PrimaryButton>
            <PrimaryButton
              style={{ border: "none" }}
              onClick={() => dispatch(editThunk(feedId))}
              disabled={inProgress || !validityCheck()}
              iconProps={createIconProps}>
              Save
            </PrimaryButton>
          </Stack>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};
export default withRouter(EditFeedForm);
