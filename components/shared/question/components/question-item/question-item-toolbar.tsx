import { RiMessage2Line, RiShareForwardLine, RiThumbUpFill, RiThumbUpLine } from "react-icons/ri";
import { Question } from "../../../../../lib/repo/question/question.repo";
import { Button } from "../../../utilities/form";
import { focusElement, scrollSmooth } from "./question-item";

interface QuestionItemToolbarProps extends ReactProps {
  question: Question;
  wasQuestLiked: boolean;
  canLikeQuest: boolean;
  canComment: boolean;
  onQuestLike: (wasLiked: boolean) => void;
  onOpenShareDialog: (quest: Question) => void;
  onOpenRequestDialog: (canEditQuest?: boolean) => void;
  globalCustomerId: string;
  adminId: string;
}

export function QuestionItemToolbar({
  question,
  wasQuestLiked,
  canLikeQuest,
  canComment,
  onQuestLike,
  onOpenShareDialog,
  onOpenRequestDialog,
  globalCustomerId,
  adminId,
  ...props
}: QuestionItemToolbarProps) {
  return (
    <div className="flex items-center justify-around gap-2 py-3 my-3 lg:gap-0 border-y">
      <Button
        text="Thích"
        icon={wasQuestLiked ? <RiThumbUpFill /> : <RiThumbUpLine />}
        iconClassName={`text-lg text-primary`}
        className={`text-sm px-0 lg:px-5 lg:text-base ${
          wasQuestLiked ? "text-primary" : "text-accent"
        } ${!canLikeQuest && "opacity-50 pointer-events-none"}`}
        onClick={() => onQuestLike?.(!wasQuestLiked)}
        isLoading={false}
        asyncLoading={false}
      />
      <Button
        text="Bình luận"
        icon={<RiMessage2Line />}
        iconClassName="text-lg text-primary"
        className={`text-sm lg:text-base px-0 lg:px-5 ${
          !canComment && adminId && "opacity-50 pointer-events-none"
        }`}
        onClick={() => {
          if (!globalCustomerId && onOpenRequestDialog) {
            onOpenRequestDialog();
            return;
          }

          scrollSmooth(`${question.id}-commentInputDiv`, "center");
          focusElement(`${question.id}-commentInput`);
        }}
      />
      <Button
        text="Chia sẻ"
        icon={<RiShareForwardLine />}
        iconClassName="text-lg text-primary"
        className="px-0 text-sm lg:text-base lg:px-5"
        onClick={() => onOpenShareDialog?.(question)}
      />
    </div>
  );
}
