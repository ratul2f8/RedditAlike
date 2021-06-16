import React from "react";
import OwnDootsModal from "./OwnDootsModal";
import { selectIfAuthenticatedBefore,selectDootStatusOfTheFeed } from "../../redux/User/UserSlice";
import { useSelector, useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IDootedUser } from "../../redux/Doot/type";
import { IFeedResponse } from "../../redux/Feed/types";
import {
  IIconProps,
  IStackTokens,
  Stack,
  Persona,
  PersonaSize,
  PersonaInitialsColor,
  IconButton,
  SharedColors,
  TextField,
  MessageBar,
  MessageBarType,
  Text,
} from "@fluentui/react";
import { Markup } from "interweave";
import EachComment from "./EachComment";
import { IRegularComment } from "../../redux/Comments/type";
import moment from "moment";
import {
    dootingStartedThunk,
    selectIfDooting,
  } from "../../redux/Doot/DootSlice";
import { selectComment, selectIfCommenting, setComment, postCommentThunk } from "../../redux/FeedDetails/FeedDetailsSlice";

interface IProps extends RouteComponentProps {
  upDoots: IDootedUser[];
  downDoots: IDootedUser[];
  feedInfo: IFeedResponse;
  comments: IRegularComment[];
}
const DetailedView: React.FC<IProps> = ({
  feedInfo,
  upDoots,
  downDoots,
  comments,
}) => {
  const neutralLike: IIconProps = { iconName: "Like" };
  const neutralDislike: IIconProps = { iconName: "Dislike" };
  const likedIcon: IIconProps = { iconName: "LikeSolid" };
  const dislikedIcon: IIconProps = { iconName: "DislikeSolid" };
  const stackToken: IStackTokens = { childrenGap: 20 };
  const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
  const comment = useSelector(selectComment);
  const [isDootsModalOpen, setDootsModalOpen] = React.useState(false);
  const commenting = useSelector(selectIfCommenting);
  const dispatch = useDispatch();
  const {
    title,
    content,
    createdAt,
    creatorId,
    creatorName,
    dootStatus,
    updatedAt,
    id
  } = feedInfo;
  const currentDootStatus = useSelector(selectDootStatusOfTheFeed(id));
  const dooting = useSelector(selectIfDooting);
  const shouldGenerateSolidLikedButton = () =>
    currentDootStatus && currentDootStatus === 1;
  const shouldGenerateSolidDisikedButton = () =>
    currentDootStatus && currentDootStatus === -1;
  return (
    <React.Fragment>
      <div style={{ width: "100%", height: "auto", overflowY: "auto" }}>
        <Stack
          tokens={stackToken}
          style={{
            padding: 8,
            height: "auto",
            width: "99%",
            maxWidth: "99%",
          }}>
          <Text block variant="xLarge">
            {title}
          </Text>
          <Stack
            horizontal
            style={{ justifyContent: "space-between", paddingRight: "10px" }}>
            <Persona
              key={creatorId}
              size={PersonaSize.size48}
              text={creatorName}
              secondaryText={`Posted: ${moment(
                new Date(createdAt).getTime()
              ).fromNow()} ${
                createdAt === updatedAt
                  ? ""
                  : " , Updated: " + moment(moment(updatedAt)).fromNow()
              }`}
              initialsColor={PersonaInitialsColor.cyan}
            />
          </Stack>

          <Text block>
            <Markup content={content} />
          </Text>
          <Stack
            horizontal
            style={{ justifyContent: "space-between" }}
            verticalAlign="center">
            <div>
              <Text
                style={{ color: dootStatus >= 0 ? "#004200" : "#9d0000" }}
                variant="xxLarge">
                {dootStatus}
              </Text>
              <span
                className="action-btn"
                style={{ cursor: "pointer" }}
                onClick={() => setDootsModalOpen(true)}>
                {" "}
                geeks
              </span>
            </div>
            {authenticatedBefore && (
              <Stack
              horizontal
              wrap
              tokens={{ childrenGap: 0 }}
              style={{
                marginRight: "10px",
              }}>
             {/* handle the up vote */}
              <IconButton
                    disabled={dooting}
                    onClick={() =>
                      dispatch(
                        dootingStartedThunk({
                          DootType: 1,
                          whereToStart: -1,
                          FeedId: id,
                        })
                      )
                    }
                    iconProps={
                      shouldGenerateSolidLikedButton() ? likedIcon : neutralLike
                    }
                  />
                   {/* handle the down vote */}
                  <IconButton
                  disabled={dooting}
                  onClick={() =>
                    dispatch(
                      dootingStartedThunk({
                        DootType: -1,
                        whereToStart: -1,
                        FeedId: id,
                      })
                    )
                  }
                  iconProps={
                    shouldGenerateSolidDisikedButton()
                      ? dislikedIcon
                      : neutralDislike
                  }
                />
            </Stack>
            )}
          </Stack>
          <Stack
            style={{
              height: "1px",
              width: "100%",
              backgroundColor: SharedColors.blue10,
            }}></Stack>
          <Text variant="medium" style={{ fontWeight: 600 }}>
            Comments
          </Text>
          {comments.length === 0 ? (
            <Text> No comments yet! </Text>
          ) : (
            <React.Fragment>
              {comments.map((comment) => (
                <EachComment key={comment.id} comment={comment} feedCreatorId={creatorId}/>
              ))}
            </React.Fragment>
          )}
        </Stack>
      </div>
      {authenticatedBefore ? (
        <Stack
          style={{
            //position: "fixed",
            height: "12%",
            width: "98%",
            bottom: 0,
            left: 0,

            //transform: "translateY(-100%)",
          }}>
          <Stack horizontal style={{ justifyContent: "flex-end" }}>
            <TextField
              placeholder="Enter comment..."
              borderless
              disabled={commenting}
              underlined
              style={{ width: "60vw", marginLeft: "auto" }}
              value={comment}
              onChange={(_, value) => dispatch(setComment(value + ""))}
            />
            <IconButton
              disabled={comment.trim().length === 0 || commenting}
              size={12}
              onClick={() => dispatch(postCommentThunk())}
              iconProps={{ iconName: "Comment" }}
            />
          </Stack>
        </Stack>
      ) : (
        <Stack
          style={{
            //position: "fixed",
            height: "auto",
            width: "98%",
            bottom: 0,
            left: 0,
            //transform: "translateY(-100%)",
          }}>
          <MessageBar messageBarType={MessageBarType.warning}>
            Plase sign in to comment...
          </MessageBar>
        </Stack>
      )}
      {isDootsModalOpen && (
        <OwnDootsModal
          upDoots={upDoots}
          downDoots={downDoots}
          dismissMe={setDootsModalOpen}
        />
      )}
    </React.Fragment>
  );
};
export default withRouter(DetailedView);
