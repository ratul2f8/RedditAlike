import {
  IStackTokens,
  MessageBar,
  MessageBarType,
  Spinner,
  Stack,
  DefaultButton,
  SharedColors,
  PrimaryButton,
} from "@fluentui/react";
import React from "react";
import Post from "./EachPost";
import { useSelector, useDispatch } from "react-redux";
import {
  selectIfParsing,
  selectIfParsingErrorMessages,
  parseFeedsThunk,
  selectFeedsToRender,
} from "../../redux/Feed/FeedSlice";
import { RouteComponentProps, withRouter } from "react-router";
import MyPost from "./MyPost";
import { selectAuthInfo } from "../../redux/User/UserSlice";
interface IProps extends RouteComponentProps {
  whereToStart: number;
}

const FeedsPageContainer: React.FC<IProps> = ({ whereToStart, history }) => {
  const rootStackToken: IStackTokens = { childrenGap: 20 };
  const dispatch = useDispatch();
  const inProgress = useSelector(selectIfParsing);
  React.useEffect(() => {
    dispatch(parseFeedsThunk(whereToStart));
  }, [whereToStart, dispatch]);
  const feedsToRender = useSelector(selectFeedsToRender(whereToStart));
  const errorMessage = useSelector(selectIfParsingErrorMessages);
  const {id: userId } = useSelector(selectAuthInfo);
  const checkIfToGenerateNextButton = () =>
    feedsToRender && feedsToRender.length === 10;
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
      {inProgress ? (
        <Spinner label="Loading,Please wait.." labelPosition="left" />
      ) : (
        <React.Fragment>
          {errorMessage.length === 0 ? (
            <React.Fragment>
              {feedsToRender && (
                <React.Fragment>
                  {feedsToRender.map((feed, index) => (
                     index === 9
                     ?
                     null
                     :
                     (<React.Fragment key={`frag: ${index}`}>
                       {
                         userId === feed.creatorId
                         ?
                         <MyPost key={`myfeed:${feed.id}`} feed={feed} whereToStart={whereToStart}/>
                         :
                         <Post key={`feed:${feed.id}`} feed={feed} whereToStart={whereToStart}/>
                       }
                       </React.Fragment>)
                  ))}
                  <Stack
                    horizontal
                    style={{
                      height: "auto",
                      width: "99%",
                      maxWidth: "99%",
                    }}>
                    <Stack
                      horizontal
                      style={{ marginLeft: "auto" }}
                      tokens={{ childrenGap: 3 }}>
                      {whereToStart !== 0 && (
                        <DefaultButton
                          style={{
                            border: "none",
                            backgroundColor: SharedColors.magenta20,
                            color: "white",
                          }}
                          onClick={() => history.goBack()}>
                          Previous
                        </DefaultButton>
                      )}
                      <PrimaryButton
                        disabled={!checkIfToGenerateNextButton()}
                        style={{
                          border: "none",
                        }}
                        onClick={() =>
                          history.push(`/feeds/from/${feedsToRender[feedsToRender.length - 1].id}`)
                        }>
                        Next
                      </PrimaryButton>
                    </Stack>
                  </Stack>
                </React.Fragment>
              )}
            </React.Fragment>
          ) : (
            <MessageBar messageBarType={MessageBarType.error}>
              {errorMessage}
            </MessageBar>
          )}
        </React.Fragment>
      )}
    </Stack>
  );
};

export default withRouter(FeedsPageContainer);
