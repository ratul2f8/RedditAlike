import {
  FontWeights,
  getTheme,
  IIconProps,
  mergeStyleSets,
  Modal,
  Stack,
  MessageBar,
  MessageBarType,
  Text,
  Spinner
} from "@fluentui/react";
import EachComment from "./EachComment";
import { IButtonStyles, IconButton } from "@fluentui/react/lib/Button";
import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { parseCommentsThunk, selectIfParsing, selectParsedComments, selectParsingErrorMessage } from "../../redux/Comments/CommentsSlice";

interface IProps extends RouteComponentProps {
  dismissMe: React.Dispatch<React.SetStateAction<boolean>>;
  whereToStart: number;
  feedId: number;
}
const CommentsModal: React.FunctionComponent<IProps> = ({ dismissMe, whereToStart, feedId }) => {
  const comments = useSelector(selectParsedComments);
  const errorMessage = useSelector(selectParsingErrorMessage);
  const loading = useSelector(selectIfParsing);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(parseCommentsThunk({whereToStart: whereToStart, FeedId: feedId}))
  }, [feedId, dispatch, whereToStart])
  return (
    <div>
      <Modal
        isOpen={true}
        isBlocking={false}
        isDarkOverlay={true}
        onDismiss={() => dismissMe(false)}
        containerClassName={contentStyles.container}>
        <div className={contentStyles.header}>
          <span>Comments...</span>
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
            <React.Fragment>
              {
                loading
                ?
                <Spinner label="Loading, Please wait..."/>
                :
                (
                  <React.Fragment>
                    {
              errorMessage.length !== 0
              ?
              (<MessageBar messageBarType={MessageBarType.error}>{errorMessage}</MessageBar>)
              :
              (
                <React.Fragment>
                  {
                    comments.length === 0
                    ?
                    <Text> No comments yet!</Text>
                    :
                    (
                      <React.Fragment>
                        {
                          comments.map((comment,index) => (<EachComment key={`comment: ${index}`}
                          comment={comment}
                          />))
                        }
                        </React.Fragment>
                    )
                  }
                  </React.Fragment>
              )
            }
                    </React.Fragment>
                )
              }
            </React.Fragment>
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
export default withRouter(CommentsModal);
