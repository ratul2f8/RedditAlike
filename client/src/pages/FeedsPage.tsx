import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changeSection } from "../redux/Section/Section.Slice";
import FeedsPageContainer from "../components/FeedsPage/FeedsPageContainer";
import { Redirect } from "react-router-dom";


const FeedsPage: React.FC<RouteComponentProps> = ({ location }) => {
  const dispatch = useDispatch();
  React.useEffect(() => {
    dispatch(changeSection(location.pathname))
  },[dispatch, location.pathname]);
  return (
    <React.Fragment>
      {
        location.pathname === "/"
        &&
        (<Redirect to="/feeds"/>)
      }
      <FeedsPageContainer whereToStart={0}/>
    </React.Fragment>
  );
};
export default withRouter(FeedsPage);
