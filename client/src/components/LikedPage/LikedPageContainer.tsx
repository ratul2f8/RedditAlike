import {
  IStackTokens,
  MessageBar,
  MessageBarType,
  Spinner,
  Stack,
  Text,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import DootedPost from "../Common/DootedPost";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIfParsing,
  selectIfErrorMessage,
  selectLikedPosts,
  parseLikedPostsThunk,
} from "../../redux/Info/InfoSlice";

interface IProps extends RouteComponentProps {}
const LikedPageContainer: React.FC<IProps> = () => {
  const rootStackToken: IStackTokens = { childrenGap: 20 };
  const errorMessage = useSelector(selectIfErrorMessage);
  const loading = useSelector(selectIfParsing);
  const feeds = useSelector(selectLikedPosts);
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(parseLikedPostsThunk());
  }, [dispatch]);
  return (
    <Stack
      horizontalAlign="center"
      style={{
        height: "auto",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        paddingRight: 10,
        overflow: "auto",
      }}
      tokens={rootStackToken}>
      {loading ? (
        <Spinner label="Loading,Please wait..." />
      ) : (
        <React.Fragment>
          {errorMessage.length !== 0 ? (
            <MessageBar messageBarType={MessageBarType.error}>
              {errorMessage}
            </MessageBar>
          ) : (
            <React.Fragment>
              {feeds.length === 0 ? (
                <Text>You haven't liked any posts yet!</Text>
              ) : (
                <React.Fragment>
                  {feeds.map((feed, index) => (
                    <DootedPost key={index} feed={feed} />
                  ))}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Stack>
  );
};

export default withRouter(LikedPageContainer);
