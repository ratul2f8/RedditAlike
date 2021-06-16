import {
    DefaultButton, IIconProps, Persona,
    PersonaSize, PrimaryButton, Stack, Text
} from "@fluentui/react";
import { Dialog, DialogType } from "@fluentui/react/lib/Dialog";
import * as React from "react";
import { getRandomColor } from "../../assets/generateRandomPersonaColor";
import { IDootedUser } from "../../redux/Doot/type";
  
  const dialogContentProps = {
    type: DialogType.close,
    title: "Doots...",
    //   subText: ''
  };
  
  interface IProps {
    dismissMe: React.Dispatch<React.SetStateAction<boolean>>;
    upDoots: IDootedUser[],
    downDoots: IDootedUser[]
  }
  const OwnDootsModal: React.FunctionComponent<IProps> = ({
    dismissMe,
    upDoots,
    downDoots
  }) => {
    const [currentTab, setCurrentTab] = React.useState("liked");
    const neutralLike: IIconProps = { iconName: "Like" };
    const neutralDislike: IIconProps = { iconName: "Dislike" };
    const UpDoots: React.FC = () => {
      return (
        <>
          {upDoots.length === 0 ? (
            <Stack horizontalAlign="center" verticalAlign="center"
             style={{marginTop: 10}}
            >
              <Text>No UpDoots yet</Text>
            </Stack>
          ) : (
            <React.Fragment>
              {upDoots.map((doot, _index) => (
                <Persona
                  key={`doot : ${doot.id}`}
                  size={PersonaSize.size48}
                  text={doot.fullName}
                  secondaryText={doot.email}
                  initialsColor={getRandomColor()}
                />
              ))}
            </React.Fragment>
          )}
        </>
      );
    };
    const DownDoots: React.FC = () => {
      return (
        <>
          {downDoots.length === 0 ? (
            <Stack horizontalAlign="center" verticalAlign="center"
            style={{marginTop: 10}}
           >
             <Text>No DownDoots yet</Text>
           </Stack>
          ) : (
            <React.Fragment>
              {downDoots.map((doot, _index) => (
                <Persona
                  key={`doot : ${doot.id}`}
                  size={PersonaSize.size48}
                  text={doot.fullName}
                  secondaryText={doot.email}
                  initialsColor={getRandomColor()}
                />
              ))}
            </React.Fragment>
          )}
        </>
      );
    };
    return (
      <Dialog
        hidden={false}
        onDismiss={() => dismissMe(false)}
        dialogContentProps={dialogContentProps}
        // modalProps={modalProps}
      >
        <React.Fragment>
                <Stack
                  horizontal
                  tokens={{ childrenGap: 0 }}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                  }}>
                  {currentTab === "liked" ? (
                    <PrimaryButton
                      style={{ border: "none" }}
                      iconProps={neutralLike}>
                      UpDoots
                    </PrimaryButton>
                  ) : (
                    <DefaultButton
                      style={{ border: "none" }}
                      iconProps={neutralLike}
                      onClick={() => setCurrentTab("liked")}>
                      UpDoots
                    </DefaultButton>
                  )}
                  {currentTab === "disliked" ? (
                    <PrimaryButton
                      style={{ border: "none" }}
                      iconProps={neutralDislike}>
                      DownDoots
                    </PrimaryButton>
                  ) : (
                    <DefaultButton
                      style={{ border: "none" }}
                      iconProps={neutralDislike}
                      onClick={() => setCurrentTab("disliked")}>
                      DownDoots
                    </DefaultButton>
                  )}
                </Stack>
                <Stack
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "60vh",
                    overflow: "auto",
                  }}
                  tokens={{ childrenGap: 8 }}>
                  {currentTab === "liked" ? <UpDoots /> : <DownDoots />}
                </Stack>
              </React.Fragment>
      </Dialog>
    );
  };
  export default OwnDootsModal;
  