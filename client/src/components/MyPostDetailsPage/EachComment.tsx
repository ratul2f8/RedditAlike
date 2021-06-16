import {
    Stack,
    Persona,
    PersonaSize,
    Text,
    PersonaInitialsColor,
    ProgressIndicator,
    ActionButton,
    SharedColors
  } from "@fluentui/react";
  import { IRegularComment } from "../../redux/Comments/type";
  import moment from "moment";
  import { useSelector, useDispatch } from "react-redux";
  import {
    selectAuthInfo,
    selectIfAuthenticatedBefore,
  } from "../../redux/User/UserSlice";
  import React from "react";
  import {
    selectIFRemoving,
    removeCommentThunk,
  } from "../../redux/Comments/CommentSlice";
  
  interface IProps {
    comment: IRegularComment;
    feedCreatorId: string;
  }
  const EachComment: React.FC<IProps> = ({ comment, feedCreatorId }) => {
    const authenticatedBefore = useSelector(selectIfAuthenticatedBefore);
    const removing = useSelector(selectIFRemoving);
    const { id: curretUserId } = useSelector(selectAuthInfo);
    const dispatch = useDispatch();
    return (
      <Stack
        tokens={{ childrenGap: "8" }}
        style={{
          width: "100%",
          height: "auto",
          padding: "8px",
        }}>
        {authenticatedBefore && (
          <React.Fragment>
            {(comment.commenterId === curretUserId ||
              feedCreatorId === curretUserId) && (
              <React.Fragment>
                {removing && <ProgressIndicator />}
              </React.Fragment>
            )}
          </React.Fragment>
        )}
        <Stack horizontal style={{ justifyContent: "space-between" }}>
          <Persona
            key={comment.commenterId}
            text={comment.commenterName}
            size={PersonaSize.size40}
            secondaryText={`Posted: ${moment(
              new Date(comment.commentedAt).getTime()
            ).fromNow()}`}
            initialsColor={PersonaInitialsColor.cyan}
          />
          {authenticatedBefore && (
            <React.Fragment>
              {(comment.commenterId === curretUserId ||
                feedCreatorId === curretUserId) && (
                <ActionButton
                  disabled={removing}
                  onClick={() => dispatch(removeCommentThunk(comment.id))}
                  style={{
                    color: SharedColors.red20,
                  }}>
                  Remove
                </ActionButton>
              )}
            </React.Fragment>
          )}
        </Stack>
        <Text block variant="medium">
          {comment.comment}
        </Text>
      </Stack>
    );
  };
  export default EachComment;
  