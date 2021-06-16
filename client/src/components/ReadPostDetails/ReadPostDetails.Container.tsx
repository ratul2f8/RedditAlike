import {
  IStackTokens, MessageBar,
  MessageBarType,
  Spinner, Stack
} from "@fluentui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import {
  parseFeedDetailsThunk, selectFeed,
  selectIfFeedParsing,
  selectIfFeedParsingError
} from "../../redux/FeedDetails/FeedDetailsSlice";
import DetailedView from "./DetailedView";

interface IProps extends RouteComponentProps {
  postId: number;
}
const ReadPostDetailsContainer: React.FC<IProps> = ({ postId }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectIfFeedParsing);
  const errorMessage = useSelector(selectIfFeedParsingError);
  const { feedInfo, downDoots, upDoots, comments } = useSelector(selectFeed);
  const rootStackToken: IStackTokens = { childrenGap: 10 };
  React.useEffect(() => {
    dispatch(parseFeedDetailsThunk(postId));
  },[dispatch, postId]);
  return (
    <React.Fragment>
      <Stack
        horizontalAlign="center"
        style={{
          height: "100%",
          width: "100%",
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
          overflow: "auto",
          position: "relative",
        }}
        tokens={rootStackToken}>
        {loading ? (
          <Spinner label="Loading, Please wait..." labelPosition="left" />
        ) : (
          <React.Fragment>
            {errorMessage.length === 0 ? (
              <DetailedView
                feedInfo={feedInfo}
                upDoots={upDoots}
                downDoots={downDoots}
                comments = {comments}
              />
            ) : (
              <MessageBar messageBarType={MessageBarType.error}>
                {errorMessage}
              </MessageBar>
            )}
          </React.Fragment>
        )}
      </Stack>
    </React.Fragment>
  );
};
export default withRouter(ReadPostDetailsContainer);
