import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { RiThumbUpFill, RiThumbUpLine } from "react-icons/ri";
import { useDebounce } from "../../../../../lib/hooks/useDebounce";
import { useAlert } from "../../../../../lib/providers/alert-provider";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { FeedBackService } from "../../../../../lib/repo/question/feedback.repo";
import {
  QuestionComment,
  QuestionCommentService,
} from "../../../../../lib/repo/question/question-comment.repo";
import { Button } from "../../../utilities/form";
import { useQuestionCommentsContext } from "../../providers/question-comments-provider";
import { QuestionCommentInput } from "./question-comment-input";
import { QuestionCommentItemData } from "./question-comment-item-data";

export function QuestionCommentItem({
  comment,
  index,
  isCommentEditable,
  isCommentDeletable,
  showHiddenComment,
  ...props
}: ReactProps & {
  comment: QuestionComment;
  index: number;
  isCommentEditable: boolean;
  isCommentDeletable: boolean;
  showHiddenComment: boolean;
}) {
  const toast = useToast();
  const {
    expertId,
    displayQuestionCommentList,
    questionCommentListCrud,
    onTotalCommentsChange,
    questionId,
    globalCustomerId,
    isDetails,
    isCommentHidable,
    canLikeComment,
    onOpenRequestDialog,
    editCommentId,
    onEditCommentIdChange,
  } = useQuestionCommentsContext();
  const alert = useAlert();
  const [wasCommentLiked, setWasCommentLiked] = useState(false);
  let [timeout] = useState<any>();

  useEffect(() => {
    if (comment?.feedbackType === "LIKE") {
      setWasCommentLiked(true);
      return;
    }

    if (comment?.feedbackType === "NONE") {
      setWasCommentLiked(false);
      return;
    }
  }, [comment?.feedbackType]);

  const sendFeedbackAPI = async (val: boolean) => {
    try {
      const data = { questionCommentId: comment.id, type: "NONE" };

      // dislike
      if (!val) {
        await FeedBackService.feedbackReact(data);
        setWasCommentLiked(false);
        return;
      }

      //like
      data.type = "LIKE";
      await FeedBackService.feedbackReact(data);
      setWasCommentLiked(true);
    } catch (error) {
      console.debug(error);

      const data = { questionCommentId: comment.id, type: wasCommentLiked ? "NONE" : "LIKE" };
      await FeedBackService.feedbackReact(data);
    }
  };

  const hiddenClass = useMemo(() => {
    let className = "";
    if (comment.isHidden) {
      className += " hidden opacity-50";
    }
    if (showHiddenComment) {
      className = className.replace("hidden", "");
    }

    return className;
  }, [showHiddenComment, comment]);

  const handleCommentLike = async (val: boolean) => {
    if (!globalCustomerId && onOpenRequestDialog) {
      onOpenRequestDialog();
      return;
    }

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      sendFeedbackAPI(val);
    }, 150);
  };

  const handleDeleteComment = async (deletedComment: QuestionComment) => {
    try {
      if (expertId) {
        const res = await alert.danger("Xóa bình luận", "Bạn muốn xóa bình luận này.");
        if (!res) return;
      }

      await QuestionCommentService.delete({ id: deletedComment.id });
      const newCommentList = [...displayQuestionCommentList];
      const filteredCommentList = newCommentList.filter((cmt) => cmt.id !== deletedComment.id);
      const total = questionCommentListCrud.pagination.total - 1;
      questionCommentListCrud.setPagination({
        ...questionCommentListCrud.pagination,
        total,
      });
      questionCommentListCrud.setItems(filteredCommentList);
      onTotalCommentsChange(total);
      toast.success("Xóa bình luận thành công");
    } catch (error) {
      console.debug(error);
      toast.error("Xóa bình luận thất bại", `${error.message}`);
    }
  };

  const handleHiddenComment = async (hiddenComment: QuestionComment) => {
    try {
      await QuestionCommentService.questionCommentMarkHidden(
        hiddenComment.id,
        !hiddenComment.isHidden
      );
      const newCommentList = [...displayQuestionCommentList];
      const index = newCommentList.findIndex((cmt) => cmt.id === hiddenComment.id);
      newCommentList[index] = {
        ...newCommentList[index],
        isHidden: !hiddenComment.isHidden,
      };
      questionCommentListCrud.setItems(newCommentList);
      toast.success(`${hiddenComment.isHidden ? "Hiện" : "Ẩn"} bình luận thành công`);
    } catch (error) {
      console.debug(error);
      toast.error(
        `${hiddenComment.isHidden ? "Hiện" : "Ẩn"} bình luận thất bại`,
        `${error.message}`
      );
    }
  };

  return (
    <div className={`transition-all group border-b pt-3 pb-2`}>
      {editCommentId === comment?.id ? (
        <QuestionCommentInput
          globalCustomerId={globalCustomerId}
          questionId={questionId}
          comment={comment}
          isDetails={isDetails}
          editCommentId={editCommentId}
          onEditCommentIdChange={onEditCommentIdChange}
          onOpenRequestDialog={onOpenRequestDialog}
        />
      ) : (
        <QuestionCommentItemData
          comment={comment}
          onDeleteComment={handleDeleteComment}
          editCommentId={editCommentId}
          onEditCommentIdChange={onEditCommentIdChange}
          isDetails={isDetails}
          onHiddenComment={handleHiddenComment}
          isCommentEditable={isCommentEditable}
          isCommentDeletable={isCommentDeletable}
          isCommentHidable={isCommentHidable}
          hiddenClass={hiddenClass}
        />
      )}
      <div className={`flex items-center gap-5 mt-2 text-sm  ${hiddenClass}`}>
        <Button
          text="Thích"
          isLoading={false}
          asyncLoading={false}
          icon={wasCommentLiked ? <RiThumbUpFill /> : <RiThumbUpLine />}
          iconClassName={`text-lg text-primary`}
          className={`text-sm pl-0 ${wasCommentLiked ? "text-primary" : "text-accent"} first-letter:
          ${!canLikeComment && "opacity-50 pointer-events-none"}
          `}
          onClick={() => handleCommentLike(!wasCommentLiked)}
        />
        <div className="text-gray-600 -mt-0.5">
          {formatDistanceToNowStrict(new Date(comment?.createdAt), {
            locale: vi,
            addSuffix: true,
            roundingMethod: "ceil",
          })}
        </div>
      </div>
    </div>
  );
}
