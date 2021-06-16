import {
  IStackTokens, MessageBar,
  MessageBarType, Spinner, Stack
} from "@fluentui/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { clearErrorMessage, parseFeedThunk, selectIfParsing, selectIfParsingErrorMessage } from "../../redux/Feed/EditFeedSlice";
import EditFeedForm from "./EditFeedForm";


  interface IProps extends RouteComponentProps {
     feedId : number
  }
  const EditPageContainer: React.FC<IProps> = ({ feedId }) => {
    const rootStackToken: IStackTokens = { childrenGap: 20 };
    const dispatch = useDispatch();
    React.useEffect(() => {
      dispatch(clearErrorMessage())
      dispatch(parseFeedThunk(feedId))
    }, [feedId, dispatch]);
    const isParsing = useSelector(selectIfParsing);
    const parsingErrorMessage = useSelector(selectIfParsingErrorMessage);
    return (
      <Stack
        horizontalAlign="center"
        style={{
          height: "auto",
          width: "100%",
          paddingTop: 0,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
          overflow: "auto",
        }}
        tokens={rootStackToken}>
        {
          isParsing
          ?
          <Spinner label="Loading,Please wait.." labelPosition="left"/>
          :
          <React.Fragment>
            {
              parsingErrorMessage.length === 0
              ? 
              (<EditFeedForm feedId={feedId}/>)
              :
              (<MessageBar messageBarType={MessageBarType.error}>
                {parsingErrorMessage}
              </MessageBar>)
            }
          </React.Fragment>
        }
      </Stack>
    );
  };
  
  export default withRouter(EditPageContainer);
  