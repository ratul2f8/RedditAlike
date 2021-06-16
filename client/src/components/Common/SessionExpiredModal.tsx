import {
    FontWeights,
    getTheme, mergeStyleSets,
    Modal, PrimaryButton, Stack,
    Text
} from "@fluentui/react";
import * as React from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { logOutThunk } from "../../redux/User/UserSlice";

interface IProps extends RouteComponentProps {}
const SessionExpiredModal: React.FunctionComponent<IProps> = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <Modal
        isOpen={true}
        isBlocking={false}
        isDarkOverlay={true}
        containerClassName={contentStyles.container}>
        <div className={contentStyles.header}>
          <span>Session expired...</span>
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
            Please logout and login again
                </Text>
            <Stack>
              <PrimaryButton onClick={() => dispatch(logOutThunk())}
              iconProps={{iconName: "FollowUser"}}
              >
                Sign Out
              </PrimaryButton>
            </Stack>
          </Stack>
        </div>
      </Modal>
    </div>
  );
};
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

export default withRouter(SessionExpiredModal);
