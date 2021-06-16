import React from "react";
import { Switch, Route } from "react-router-dom";
import Wrapper from "../components/wrapper/Wrapper";
import DislikedPage from "./DislikedPage";
import FeedsPage from "./FeedsPage";
import LikedPage from "./LikedPage";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import CreateFeedsPage from "./CreateFeedsPage";
import EditPage from "./EditPage";
import ReadPostDetailsPage from "./ReadPostDetailsPage";
import FeedsPagePaginated from "./FeedsPagePaginated";
import MyPostDetailsPage from "./MyPostDetailsPage";

const WrappedPage: React.FC = () => {
 
  return (
    <Wrapper>
      <Switch>
        <Route exact path="/" component={FeedsPage} />
        <Route exact path="/feeds" component={FeedsPage} />
        <Route exact path="/feeds/from/:whereToStart" component={FeedsPagePaginated} />
        <Route exact path="/login" component={LoginPage}/>
        <Route exact path="/profile" component={ProfilePage} />
        <Route exact path="/liked" component={LikedPage} />
        <Route exact path="/disliked" component={DislikedPage} />
        <Route exact path="/create-feed" component={CreateFeedsPage}/>
        <Route exact path="/edit-post/:postId" component={EditPage}/>
        <Route exact path="/read-details/:postId" component={ReadPostDetailsPage}/>
        <Route exact path="/mypost-details/:postId" component={MyPostDetailsPage}/>
      </Switch>
    </Wrapper>
  );
};
export default WrappedPage;
