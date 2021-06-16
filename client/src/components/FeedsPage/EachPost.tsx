import {
  IIconProps,
  IStackTokens,
  Stack,
  Persona,
  PersonaSize,
  IconButton,
  ActionButton,
  Text,
  PersonaInitialsColor,
} from "@fluentui/react";
import { getTheme } from "@fluentui/style-utilities";
import React from "react";
import DootsModal from "../Common/DootsModal";
import CommentsModal from "../Common/CommentsModal";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { IFeedResponse } from "../../redux/Feed/types";
import {
  selectDootStatusOfTheFeed,
  selectIfAuthenticatedBefore,
} from "../../redux/User/UserSlice";
import moment from "moment";
import {
  dootingStartedThunk,
  selectIfDooting,
} from "../../redux/Doot/DootSlice";

interface IProps extends RouteComponentProps {
  feed: IFeedResponse;
  whereToStart: number;
}
const Post: React.FC<IProps> = ({ history, feed, whereToStart }) => {
  const theme = getTheme();
  const dispatch = useDispatch();
  const stackToken: IStackTokens = { childrenGap: 20 };
  const neutralLike: IIconProps = { iconName: "Like" };
  const neutralDislike: IIconProps = { iconName: "Dislike" };
  const commentIconProps: IIconProps = { iconName: "Comment" };
  const likedIcon: IIconProps = { iconName: "LikeSolid" };
  const dislikedIcon: IIconProps = { iconName: "DislikeSolid" };
  const continuReading: IIconProps = { iconName: "ReadingMode" };
  const [isDootsModalOpen, setDootsModalOpen] = React.useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = React.useState(false);
  const authenticated = useSelector(selectIfAuthenticatedBefore);
  const createdAt = new Date(feed.createdAt).getTime();
  const updatedAt = new Date(feed.updatedAt).getTime();
  const currentDootStatus = useSelector(selectDootStatusOfTheFeed(feed.id));
  const dooting = useSelector(selectIfDooting);
  const shouldGenerateSolidLikedButton = () =>
    currentDootStatus && currentDootStatus === 1;
  const shouldGenerateSolidDisikedButton = () =>
    currentDootStatus && currentDootStatus === -1;
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
          <div>
            <Text
              style={{ color: feed.dootStatus >= 0 ? "#004200" : "#9d0000" }}
              variant="xxLarge">
              {feed.dootStatus}
            </Text>
            <span
              className="action-btn"
              style={{ cursor: "pointer" }}
              onClick={() => setDootsModalOpen(true)}>
              {" "}
              geeks
            </span>
          </div>
        </Stack>

        <div className="short-text">{feed.content}</div>
        <Stack
          horizontal
          style={{ justifyContent: "space-between" }}
          verticalAlign="center">
          <ActionButton
            iconProps={commentIconProps}
            onClick={() => setIsCommentsModalOpen(true)}>
            {feed.numberOfComments} comment(s)
          </ActionButton>
          <Stack
            horizontal
            wrap
            tokens={{ childrenGap: 0 }}
            style={{
              marginRight: "10px",
            }}>
            {
              //handle the updoot
              authenticated && (
                <IconButton
                  disabled={dooting}
                  onClick={() =>
                    dispatch(
                      dootingStartedThunk({
                        DootType: 1,
                        whereToStart: whereToStart,
                        FeedId: feed.id,
                      })
                    )
                  }
                  iconProps={
                    shouldGenerateSolidLikedButton() ? likedIcon : neutralLike
                  }
                />
              )
            }
            {
              //handle the downdoot
              authenticated && (
                <IconButton
                  disabled={dooting}
                  onClick={() =>
                    dispatch(
                      dootingStartedThunk({
                        DootType: -1,
                        whereToStart: whereToStart,
                        FeedId: feed.id,
                      })
                    )
                  }
                  iconProps={
                    shouldGenerateSolidDisikedButton()
                      ? dislikedIcon
                      : neutralDislike
                  }
                />
              )
            }
          </Stack>
        </Stack>
        <Stack
          style={{ width: "100%" }}
          verticalAlign="center"
          horizontalAlign="center">
          <ActionButton
            iconProps={continuReading}
            onClick={() => history.push(`/read-details/${feed.id}`)}>
            Read More / Comment
          </ActionButton>
        </Stack>
      </Stack>
      {isDootsModalOpen && (
        <DootsModal
          dismissMe={setDootsModalOpen}
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
    </React.Fragment>
  );
};
export default withRouter(Post);
