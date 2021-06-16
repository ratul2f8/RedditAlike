import React from "react";
import { Route, Switch } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import WrappedPage from "./pages/WrappedPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

const App: React.FC = () => {
  return(
    <Switch>
      <Route exact path="/login" component={LoginPage}/>
      <Route path="/signup" component={SignupPage}/>
      <Route exact path="/change-password/:token" component={ChangePasswordPage}/>
      <Route path="/" component={WrappedPage}/>
    </Switch>
  )
}
export default App;
