import React from "react";
import { useSelector } from "react-redux";
import { selectIfAuthenticatedBefore } from "../../redux/User/UserSlice";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";

interface IProps {
  isOpen: boolean;
}

const ModalMenu: React.FC<IProps> = () => {
  const signedIn = useSelector(selectIfAuthenticatedBefore);
  return (
    <div
    className="ms-hiddenMd ms-hiddenXl ms-hiddenLg ms-hiddenXxl"
      style={{
        position: "absolute",
        zIndex: 2000,
        top: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        padding: 0,
        margin: 0,
        background: "white"
      }}>
      <div
        style={{
          height: "100%",
          width: "60%"
        }}>
        {signedIn ? (
          <SignedIn />
        ) : (
          <SignedOut  />
        )}
      </div>
    </div>
  );
};
export default ModalMenu;
