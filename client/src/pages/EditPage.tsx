import React from "react";
import { MessageBar, MessageBarType, Stack } from "@fluentui/react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import EditPageContainer from "../components/EditPage/EditPageContainer";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";

const EditPage: React.FC<RouteComponentProps> = ({ location }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
  },[dispatch, location.pathname]);
  const arr = location.pathname.split("/");
  const operand = arr[arr.length - 1];
  const validatePathName = () => {
    if (Number.isNaN(Number.parseInt(operand))) {
      return false;
    }
    if (operand.split(".").length > 1) {
      return false;
    }
    // if (Number.parseFloat(operand) !== Number.parseInt(operand)) {
    //   return false;
    // }
    return true;
  };
  const signedUpBefore = useSelector(selectIfAuthenticatedBefore);
  return (
    <React.Fragment>
      {signedUpBefore ? (
        <React.Fragment>
          {validatePathName() ? (
            <EditPageContainer feedId={Number.parseInt(operand)} />
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
                Invalid PathName
              </MessageBar>
            </Stack>
          )}
        </React.Fragment>
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
export default withRouter(EditPage);
