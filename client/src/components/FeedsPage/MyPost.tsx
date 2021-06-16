import {
  ActionButton,
  IIconProps,
  IStackTokens,
  Stack,
  Text,
  DefaultButton,
  SharedColors,
} from "@fluentui/react";
import moment from "moment";
import { getTheme } from "@fluentui/style-utilities";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import DootsModal from "../Common/DootsModal";
import CommentsModal from "../Common/CommentsModal";
import RemovalConfirmationModal from "../ProfilePage/RemovalConfirmationModal";
import { IFeedResponse } from "../../redux/Feed/types";

const commentIcon: IIconProps = { iconName: "Comment" };
interface IProps extends RouteComponentProps {
  feed: IFeedResponse;
  whereToStart: number;
}

const MyPost: React.FC<IProps> = ({ history, feed, whereToStart }) => {
  const theme = getTheme();
  const manageIconProps: IIconProps = { iconName: "Repair" };
  const [dootModalOpen, setDootModalOpen] = React.useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = React.useState(false);
  const [isRemovalModalOpen, setRemovalModalOpen] = React.useState(false);
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
          style={{ justifyContent: "space-between" }}
          verticalAlign="center">
          <div>
            <Text
              style={{ color: feed.dootStatus >= 0 ? "#004200" : "#9d0000" }}
              variant="xxLarge">
              {feed.dootStatus}
            </Text>
            <span
              className="action-btn"
              style={{ cursor: "pointer" }}
              onClick={() => setDootModalOpen(true)}>
              {" "}
              geeks
            </span>
          </div>
          <ActionButton
            iconProps={commentIcon}
            onClick={() => setIsCommentsModalOpen(true)}>
            {feed.numberOfComments} comment(s)
          </ActionButton>
        </Stack>
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
      {dootModalOpen && (
        <DootsModal
          dismissMe={setDootModalOpen}
          feed={feed}
          whereToStart={whereToStart}
        />
      )}
      {isCommentsModalOpen && (
        <CommentsModal
          dismissMe={setIsCommentsModalOpen}
          whereToStart={whereToStart}
          feedId={feed.id}
        />
      )}
      {isRemovalModalOpen && (
        <RemovalConfirmationModal dismissMe={setRemovalModalOpen} />
      )}
    </React.Fragment>
  );
};
export default withRouter(MyPost);
