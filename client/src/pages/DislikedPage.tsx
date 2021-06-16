import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import DislikedpageContainer from "../components/DislikedPage/DislikedpageContainer";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";
import { MessageBar, MessageBarType, Stack } from "@fluentui/react";
import { useSelector } from "react-redux";

const DisikedPage: React.FC<RouteComponentProps> = ({ location }) => {
  const dispatch = useDispatch();
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
  });
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
            <DislikedpageContainer/>
      }
    </React.Fragment>
  );
};
export default withRouter(DisikedPage);
