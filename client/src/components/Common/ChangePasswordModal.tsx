import {
    FontWeights,
    getTheme,
    IIconProps, ITextFieldStyles, mergeStyleSets,
    Modal, PrimaryButton, Spinner, Stack, Text, TextField
} from "@fluentui/react";
import { IButtonStyles, IconButton } from "@fluentui/react/lib/Button";
import * as EmailValidator from "email-validator";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import {
    closeModal, getTokenThunk, selectIfLoading
} from "../../redux/ChangePassword/ChangePasswordSlice";

interface IProps extends RouteComponentProps {}
const ChangePasswordModal: React.FunctionComponent<IProps> = () => {
  const dispatch = useDispatch();
  const inProgress = useSelector(selectIfLoading);
  const [email, setEmail] = React.useState("");
  const textFieldStyles: Partial<ITextFieldStyles> = {
    fieldGroup: { width: "80%" },
  };

  const validityCheck = () => EmailValidator.validate(email.trim());
  return (
    <div>
      <Modal
        isOpen={true}
        isBlocking={false}
        isDarkOverlay={true}
        onDismiss={() => dispatch(closeModal())}
        containerClassName={contentStyles.container}>
        <div className={contentStyles.header}>
          <span>Change Password</span>
          <IconButton
            styles={iconButtonStyles}
            iconProps={cancelIcon}
            ariaLabel="Close popup modal"
            disabled={inProgress}
            onClick={() => dispatch(closeModal())}
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
            <Text>
              Enter the email used while creating the account. We will send an
              email with the link to change your password
            </Text>
            <TextField
              disabled={inProgress}
              borderless
              underlined
              required
              styles={textFieldStyles}
              type="text"
              value={email}
              onChange={(_, value) => setEmail(value + "")}
              placeholder="Enter a valid email address"
              label="Email"
            />
            {inProgress && <Spinner label="Please wait" />}
            <Stack horizontal>
              <PrimaryButton
                iconProps={{iconName: "Send"}}
                disabled={inProgress || !validityCheck()}
                onClick={() => dispatch(getTokenThunk(email))}>
                Send
              </PrimaryButton>
            </Stack>
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
export default withRouter(ChangePasswordModal);
