import {
  IconButton,
  IContextualMenuProps,
  IStackTokens,
  SharedColors,
  Stack,
  Text,
  TextField,
  PrimaryButton,
} from "@fluentui/react";
import { Markup } from "interweave";
import moment from "moment";
import { useConst } from "@fluentui/react-hooks";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { IRegularComment } from "../../redux/Comments/type";
import { IDootedUser } from "../../redux/Doot/type";
import { IFeedResponse } from "../../redux/Feed/types";
import RemovalConfirmationModal from "./RemovalConfirmationModal";
import {
  postCommentThunk,
  selectComment,
  selectIfCommenting,
  setComment,
} from "../../redux/MyPosts/MyPostSlice";
import EachComment from "./EachComment";
import OwnDootsModal from "../ReadPostDetails/OwnDootsModal";

interface IProps extends RouteComponentProps {
  upDoots: IDootedUser[];
  downDoots: IDootedUser[];
  feedInfo: IFeedResponse;
  comments: IRegularComment[];
}
const MyPostDetailedView: React.FC<IProps> = ({
  feedInfo,
  upDoots,
  downDoots,
  comments,
  history,
}) => {
  const comment = useSelector(selectComment);
  const [isDootsModalOpen, setDootsModalOpen] = React.useState(false);
  const commenting = useSelector(selectIfCommenting);
  const stackToken: IStackTokens = { childrenGap: 20 };
  const [isRemovalModalOpen, setRemovalModalOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { title, content, createdAt, dootStatus, updatedAt, creatorId } =
    feedInfo;
  const menuProps = useConst<IContextualMenuProps>(() => ({
    shouldFocusOnMount: true,
    shouldFocusOnContainer: true,
    items: [
      {
        key: "edit",
        text: "Edit",
        onClick: () => history.push(`/edit-post/${feedInfo.id}`),
      },
      {
        key: "remove",
        text: "Remove",
        onClick: () => setRemovalModalOpen(true),
      },
    ],
  }));
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
          <Stack horizontal>
            <PrimaryButton
              ariaLabel="More"
              menuProps={menuProps}
              style={{ marginLeft: "auto" }}>
              {" "}
              Manage &nbsp;
            </PrimaryButton>
          </Stack>
          <Text block variant="xLarge">
            {title}
          </Text>
          <Stack
            horizontal
            style={{ justifyContent: "space-between", paddingRight: "10px" }}>
            <Text>{`Posted by you: ${moment(
              new Date(createdAt).getTime()
            ).fromNow()}
          ${
            createdAt === updatedAt
              ? ""
              : " , Updated: " + moment(new Date(updatedAt).getTime()).fromNow()
          }
        `}</Text>
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
                <EachComment
                  key={comment.id}
                  comment={comment}
                  feedCreatorId={creatorId}
                />
              ))}
            </React.Fragment>
          )}
        </Stack>
      </div>
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
      {isDootsModalOpen && (
        <OwnDootsModal
          upDoots={upDoots}
          downDoots={downDoots}
          dismissMe={setDootsModalOpen}
        />
      )}
      {isRemovalModalOpen && (
        <RemovalConfirmationModal
          dismissMe={setRemovalModalOpen}
          feedId={feedInfo.id}
        />
      )}
    </React.Fragment>
  );
};
export default withRouter(MyPostDetailedView);
