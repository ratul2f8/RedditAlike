import {
    ActionButton, IIconProps,
    IStackTokens, Persona, PersonaInitialsColor, PersonaSize, Stack, Text
} from "@fluentui/react";
import { getTheme } from "@fluentui/style-utilities";
import moment from "moment";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IDootedPost } from "../../redux/Info/types";
  
  interface IProps extends RouteComponentProps {
    feed: IDootedPost;
  }
  const DootedPost: React.FC<IProps> = ({ history, feed }) => {
    const theme = getTheme();
    const stackToken: IStackTokens = { childrenGap: 20 };
    const createdAt = new Date(feed.createdAt).getTime();
    const updatedAt = new Date(feed.updatedAt).getTime();
    const continuReading: IIconProps = { iconName: "ReadingMode" };
    return (
      <React.Fragment>
        <Stack
          tokens={stackToken}
          style={{
            boxShadow: theme.effects.elevation16,
            padding: 15,
            height: "auto",
            width: "99%",
            maxWidth: "99%",
          }}>
          <Text block variant="xLarge">
            {feed.title}
          </Text>
          <Stack
            horizontal
            style={{ justifyContent: "space-between", paddingRight: "10px" }}>
            <Persona
              size={PersonaSize.size48}
              text={feed.creatorName}
              secondaryText={`Posted: ${moment(createdAt).fromNow()} ${
                feed.createdAt === feed.updatedAt
                  ? ""
                  : " , Updated: " + moment(moment(updatedAt)).fromNow()
              }`}
              initialsColor={PersonaInitialsColor.cyan}
            />
          </Stack>
  
          <div className="short-text">{feed.content}</div>
          <Stack
            style={{ width: "100%" }}
            verticalAlign="center"
            horizontalAlign="center">
            <ActionButton
              iconProps={continuReading}
              onClick={() => history.push(`/read-details/${feed.id}`)}>
              View Details
            </ActionButton>
          </Stack>
        </Stack>
      </React.Fragment>
    );
  };
  export default withRouter(DootedPost);
  