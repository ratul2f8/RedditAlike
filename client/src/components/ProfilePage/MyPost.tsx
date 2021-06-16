import {
  DefaultButton, IIconProps,
  IStackTokens, SharedColors, Stack,
  Text
} from "@fluentui/react";
import { getTheme } from "@fluentui/style-utilities";
import moment from "moment";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { IComposedPost } from "../../redux/Info/types";


interface IProps extends RouteComponentProps {
  feed: IComposedPost;
}

const MyPost: React.FC<IProps> = ({ history, feed }) => {
  const theme = getTheme();
  const manageIconProps: IIconProps = { iconName: "Repair" };

  const stackToken: IStackTokens = { childrenGap: 20 };
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
        <Text>{`Posted by you: ${moment(
          new Date(feed.createdAt).getTime()
        ).fromNow()}
            ${
              feed.createdAt === feed.updatedAt
                ? ""
                : " , Updated: " +
                  moment(new Date(feed.updatedAt).getTime()).fromNow()
            }
          `}</Text>
        <div className="short-text">{feed.content}</div>
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="center"
          style={{ width: "100%" }}>
          <DefaultButton
            ariaLabel="More"
            iconProps={manageIconProps}
            onClick={() => history.push(`/mypost-details/${feed.id}`)}
            style={{ color: "white", backgroundColor: SharedColors.cyan40 }}>
            Manage / Details
          </DefaultButton>
        </Stack>
      </Stack>
    </React.Fragment>
  );
};
export default withRouter(MyPost);
