import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import { selectIfAuthenticatedBefore } from "../redux/User/UserSlice";
import MyPostDetailsContainer from "../components/MyPostDetailsPage/MyPostDetails.Container";
import { Stack, MessageBar, MessageBarType } from "@fluentui/react";

const MyPostDetailsPage: React.FC<
  RouteComponentProps<{
    postId: string;
  }>
> = ({ location, match }) => {
  const dispatch = useDispatch();
  const { postId: operand } = match.params;
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  const validatePathName = () => {
    if (Number.isNaN(Number.parseInt(operand))) {
      return false;
    }
    if (operand.split(".").length > 1) {
      return false;
    }
    if (Number.parseInt(operand) <= 0) {
      return false;
    }
    // if (Number.parseFloat(operand) !== Number.parseInt(operand)) {
    //   return false;
    // }
    return true;
  };
  React.useEffect(() => {
    dispatch(changeSection(location.pathname));
  }, [dispatch, location.pathname]);
  return (
    <React.Fragment>
      {authenticatedBefore ? (
        <React.Fragment>
          {validatePathName() ? (
            <MyPostDetailsContainer postId={Number.parseInt(operand)} />
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
            You need to authenticate yourself..
          </MessageBar>
        </Stack>
      )}
    </React.Fragment>
  );
};
export default withRouter(MyPostDetailsPage);
