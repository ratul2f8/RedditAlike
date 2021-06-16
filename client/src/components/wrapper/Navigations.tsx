import { INavLinkGroup, INavStyles, INavLink, Nav } from "@fluentui/react";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
const navStyles: Partial<INavStyles> = {
    root: {
      height: "auto",
      width: "100%",
      overflowY: "auto",
      boxSizing: "border-box",
      border: "1px solid #eee",
      margin: 0,
      padding: 0,

    },
  };
  
const navLinkGroups: INavLinkGroup[] = [{
    links: [
        {
            name: "Feeds",
            title: "Feeds",
            icon: "PreviewLink",
            url: "",
            key: "feeds"
        },
        {
            name: "Your Posts",
            title: "profile",
            icon: "EditContact",
            url: "",
            key: "profile",
        },
        {
            name: "Activities",
            title: "Activities",
            url: "",
            key: "activities",
            links: [
                {
                    name: "Liked Posts",
                    title: "Liked Posts",
                    url: "",
                    icon: "Emoji2",
                    key: "liked"
                },
                {
                    name: "Disliked Posts",
                    title: "Disliked Posts",
                    url: "",
                    icon: "EmojiDisappointed",
                    key: "disliked"
                }
            ]
        }
    ]
}];
const NavigationPanel: React.FC<RouteComponentProps> = ({history, location}) => {
    
    const routePath = location.pathname.substring(1).split("/")[0];
    const _onNavLinkClicked = (
        _: any,
        item?: INavLink
    ) => {
        if(item){
            if(item.key !== 'activities'){
                history.push("/" + item.key ?? "");
            }
        }
    }
    
    return (
        <div style={{
            width: "100%",
            height: "auto"
        }}>
        <Nav
         onLinkClick={_onNavLinkClicked}
         groups={navLinkGroups}
         selectedKey={routePath === "" ? "feeds" : routePath}
         styles={navStyles}
        />
        </div>
    )
}
export default withRouter(NavigationPanel);