import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import LikedPageContainer from "../components/LikedPage/LikedPageContainer";
import { useSelector } from "react-redux";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";
import { MessageBar, MessageBarType, Stack } from "@fluentui/react";

const LikedPage: React.FC<RouteComponentProps> = ({ location }) => {
  const dispatch = useDispatch();
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  React.useEffect(() => {
    dispatch(changeSection(location.pathname))
  }, [dispatch, location.pathname]);
  return (
    <React.Fragment>
      { 
        !authenticatedBefore
        ?
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
          }}>
          <MessageBar messageBarType={MessageBarType.blocked}>
            You need to SignIn to be redirected to this page
          </MessageBar>
        </Stack>
            :
            <LikedPageContainer/>
      }
    </React.Fragment>
  );
};
export default withRouter(LikedPage);
