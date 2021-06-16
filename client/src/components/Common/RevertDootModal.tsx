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
  } from "@fluentui/react";
  import { IButtonStyles, IconButton } from "@fluentui/react/lib/Button";
  import * as React from "react";
  import { RouteComponentProps, withRouter } from "react-router";
  
  interface IProps extends RouteComponentProps {
    dismissMe: React.Dispatch<React.SetStateAction<boolean>>;
  }
  
  const yesIcon: IIconProps = { iconName: "HandsFree" };
  
  const RevertDootModal: React.FunctionComponent<IProps> = ({
    dismissMe,
  }) => {
    return (
      <div>
        <Modal
          isOpen={true}
          isBlocking={false}
          isDarkOverlay={true}
          containerClassName={contentStyles.container}>
          <div className={contentStyles.header}>
            <span>Are you sure ? </span>
            <IconButton
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
              <Text>Do you really want to revert your vote?</Text>
              <Stack
                horizontal
                verticalAlign="center"
                style={{ justifyContent: "space-between" }}>
                <PrimaryButton
                  iconProps={cancelIcon}
                  onClick={() => dismissMe(false)}>
                  Dismiss
                </PrimaryButton>
                <DefaultButton
                  iconProps={yesIcon}
                  style={{
                    backgroundColor: SharedColors.pinkRed10,
                    color: "white",
                    border: "none",
                  }}>
                  Yes
                </DefaultButton>
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
  export default withRouter(RevertDootModal);
  