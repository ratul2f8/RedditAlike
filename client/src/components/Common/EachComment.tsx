import { Stack, Persona, PersonaSize, Text } from "@fluentui/react";
import moment from "moment";
import React from "react";
import { getRandomColor } from "../../assets/generateRandomPersonaColor";
import { IRegularComment } from "../../redux/Comments/type";
interface IProps{
  comment: IRegularComment
}
const EachComment: React.FC<IProps> = ({comment}) => {
  return (
    <Stack
      tokens={{ childrenGap: "8" }}
      style={{
        width: "60vw",
        height: "auto",
        minWidth: "60vw",
        padding: "8px",
      }}>
      <Persona
        text={comment.commenterName}
        size={PersonaSize.size48}
        secondaryText={`Posted: ${moment(new Date(comment.commentedAt).getTime()).fromNow()}`}
        initialsColor={getRandomColor()}
      />
      <Text block>
        {
          comment.comment
        }
      </Text>
    </Stack>
  );
};
export default EachComment;
