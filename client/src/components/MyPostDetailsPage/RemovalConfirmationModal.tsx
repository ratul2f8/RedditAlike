import {
  FontWeights,
  getTheme,
  IIconProps,
  mergeStyleSets,
  Modal,
  Stack,
  Text,
  PrimaryButton,
  DefaultButton,
  SharedColors,
  MessageBar,
  MessageBarType,
  Spinner,
} from "@fluentui/react";
import { IButtonStyles, IconButton } from "@fluentui/react/lib/Button";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  removePostThunk,
  selectIfRemovalSucessful,
  selectRemovalErrorMessage,
  selectIfRemoving,
} from "../../redux/MyPosts/MyPostSlice";

interface IProps extends RouteComponentProps {
  dismissMe: React.Dispatch<React.SetStateAction<boolean>>;
  feedId: number;
}

const removeIcon: IIconProps = { iconName: "Delete" };

const RemovalConfirmationModal: React.FunctionComponent<IProps> = ({
  dismissMe,
  feedId,
  history,
}) => {
  const dispatch = useDispatch();
  const removing = useSelector(selectIfRemoving);
  const errorMessage = useSelector(selectRemovalErrorMessage);
  const removalSuccesful = useSelector(selectIfRemovalSucessful);
  return (
    <div>
      <Modal
        isOpen={true}
        isBlocking={false}
        isDarkOverlay={true}
        containerClassName={contentStyles.container}>
        <div className={contentStyles.header}>
          <span>{removalSuccesful ? "Done" : "Are you sure ?"} </span>
          <IconButton
            disabled={removing || removalSuccesful}
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            onClick={() => dismissMe(false)}
          />
        </div>
        <div className={contentStyles.body}>
          <Stack
            style={{
              width: "auto",
              height: "auto",
              maxHeight: "60vh",
              overflow: "auto",
            }}
            tokens={{ childrenGap: 15 }}>
            {!removalSuccesful && (
              <Text>
                All of the associated information will also be removed
              </Text>
            )}
            {errorMessage.length !== 0 && (
              <MessageBar messageBarType={MessageBarType.error}>
                {errorMessage}
              </MessageBar>
            )}
            {removing && (
              <Stack verticalAlign="center" horizontalAlign="center">
                <Spinner label="In Progress,Please wait..." labelPosition="left" />
              </Stack>
            )}
            {removalSuccesful ? (
              <React.Fragment>
                <MessageBar messageBarType={MessageBarType.success}>
                  Successfully removed the post!
                </MessageBar>
                <DefaultButton
                  iconProps={{ iconName: "Home" }}
                  onClick={() => history.push("/feeds")}>
                  Home
                </DefaultButton>
              </React.Fragment>
            ) : (
              <Stack
                horizontal
                verticalAlign="center"
                style={{ justifyContent: "space-between" }}>
                <PrimaryButton
                  disabled={removing}
                  iconProps={cancelIcon}
                  onClick={() => dismissMe(false)}>
                  Dismiss
                </PrimaryButton>
                <DefaultButton
                  iconProps={removeIcon}
                  disabled={removing}
                  onClick={() => dispatch(removePostThunk(feedId))}
                  style={{
                    backgroundColor: SharedColors.pinkRed10,
                    color: "white",
                    border: "none",
                  }}>
                  Yes, Remove
                </DefaultButton>
              </Stack>
            )}
          </Stack>
        </div>
      </Modal>
    </div>
  );
};

const cancelIcon: IIconProps = { iconName: "Cancel" };

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    display: "flex",
    flexFlow: "column nowrap",
    alignItems: "stretch",
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: "1 1 auto",
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: "flex",
      alignItems: "center",
      fontWeight: FontWeights.semibold,
      padding: "12px 12px 14px 24px",
    },
  ],
  body: {
    flex: "4 4 auto",
    padding: "0 24px 24px 24px",
    overflowY: "hidden",
    selectors: {
      p: { margin: "14px 0" },
      "p:first-child": { marginTop: 0 },
      "p:last-child": { marginBottom: 0 },
    },
  },
});

const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: "auto",
    marginTop: "4px",
    marginRight: "2px",
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};
export default withRouter(RemovalConfirmationModal);
