import {
  IStackTokens,
  Stack,
  Spinner,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import MyPost from "./MyPost";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIfParsing,
  selectIfErrorMessage,
  parseComposedPostsThunk,
  selectComposedPosts,
} from "../../redux/Info/InfoSlice";

interface IProps extends RouteComponentProps {}
const FeedsPageContainer: React.FC<IProps> = () => {
  const rootStackToken: IStackTokens = { childrenGap: 20 };
  const errorMessage = useSelector(selectIfErrorMessage);
  const loading = useSelector(selectIfParsing);
  const dispatch = useDispatch();
  const feeds = useSelector(selectComposedPosts);
  React.useEffect(() => {
    dispatch(parseComposedPostsThunk());
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
                <Text>You haven't composed any posts yet!</Text>
              ) : (
                <React.Fragment>
                  {feeds.map((feed, index) => (
                    <MyPost key={index} feed={feed} />
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

export default withRouter(FeedsPageContainer);
