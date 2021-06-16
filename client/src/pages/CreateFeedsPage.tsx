import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { changeSection } from "../redux/Section/Section.Slice";
import CreateFeedsPageContainer from "../components/CreateFeedsPage/CreateFeedsPageContainer";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";
import { MessageBar, MessageBarType, Stack } from "@fluentui/react";

interface IProps extends RouteComponentProps {}
const CreateFeedsPage: React.FC<IProps> = ({ location }) => {
  const dispatch = useDispatch();
  const signedUpBefore = useSelector(selectIfAuthenticatedBefore);
  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
  },[dispatch, location.pathname]);
  return (
    <React.Fragment>
      {signedUpBefore ? (
        <CreateFeedsPageContainer />
      ) : (
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
      )}
    </React.Fragment>
  );
};
export default withRouter(CreateFeedsPage);
