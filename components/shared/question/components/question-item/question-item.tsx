import { useEffect, useState } from "react";
import { FeedBackService } from "../../../../../lib/repo/question/feedback.repo";
import { Question } from "../../../../../lib/repo/question/question.repo";
import { Spinner } from "../../../utilities/misc";
import { useCheckEditQuest } from "../../custom-hooks/use-check-edit-quest";
import { QuestionCommentsProvider } from "../../providers/question-comments-provider";
import { QuestionCommentInput } from "../question-comments/question-comment-input";
import { QuestionCommentList } from "../question-comments/question-comment-list";
import { QuestionItemContent } from "./question-item-content";
import { QuestionItemToolbar } from "./question-item-toolbar";

export function QuestionItem({
  adminId,
  expertId,
  globalCustomerId,
  question,
  isDetails,
  canComment,
  isQuestEditable,
  isQuestDeletable,
  canLikeQuest,
  isCommentHidable,
  canLikeComment,
  viewCount,
  onQuestDel,
  onQuestEdit,
  onIncreaseViews,
  onOpenVideoDialog,
  onOpenShareDialog,
  onOpenRequestDialog,
  ...props
}: ReactProps & {
  adminId: string | null;
  expertId: string | null;
  globalCustomerId: string | null;
  question: Question;
  isDetails: boolean;
  canComment: boolean;
  viewCount?: number;
  isQuestEditable: boolean;
  isQuestDeletable: boolean;
  canLikeQuest: boolean;
  isCommentHidable: boolean;
  canLikeComment: boolean;
  onQuestDel: (quest: Question) => void;
  onQuestEdit: (canEditQuest: boolean) => void;
  onIncreaseViews?: () => void;
  onOpenVideoDialog: (url: string) => void;
  onOpenShareDialog: (quest: Question) => void;
  onOpenRequestDialog?: (canEditQuest?: boolean) => void;
}) {
  const [totalComments, setTotalComments] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [editCommentId, setEditCommentId] = useState<string>();
  const [wasQuestLiked, setWasQuestLiked] = useState(false);
  const canEditQuest = useCheckEditQuest(totalComments);
  let [timeout] = useState<any>();

  useEffect(() => {
    if (!!viewCount) {
      setTotalViews(viewCount);
      return;
    }

    setTotalViews(question.viewCount);
  }, [viewCount, question.viewCount]);

  const handleEditCommentIdChange = (val: string) => setEditCommentId(val);

  const sendFeedbackAPI = async (val: boolean) => {
    try {
      const data = { questionId: question.id, type: "NONE" };
      if (!val && totalLikes >= 0) {
        setWasQuestLiked(false);
        setTotalLikes(totalLikes - 1);
        await FeedBackService.feedbackReact(data);
        return;
      }

      data.type = "LIKE";
      await FeedBackService.feedbackReact(data);
      setWasQuestLiked(true);
      setTotalLikes(totalLikes + 1);
    } catch (error) {
      console.debug(error);

      const data = { questionId: question.id, type: wasQuestLiked ? "NONE" : "LIKE" };
      await FeedBackService.feedbackReact(data);
      const newTotalLikes = wasQuestLiked ? totalLikes - 1 : totalLikes + 1;
      setTotalLikes(newTotalLikes);
    }
  };

  const handleTotalCommentsChange = (total: number) => {
    if (total < 0) return;
    setTotalComments(total);
  };

  const handleQuestLike = async (val: boolean) => {
    if (!globalCustomerId && onOpenRequestDialog) {
      onOpenRequestDialog();
      return;
    }

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      sendFeedbackAPI(val);
    }, 150);
  };

  useEffect(() => {
    if (!question?.id) return;

    setTotalComments(question.commentCount);
    setTotalLikes(question.likeCount);
    if (question?.feedbackType === "LIKE") {
      setWasQuestLiked(true);
      return;
    }

    if (question?.feedbackType === "NONE") {
      setWasQuestLiked(false);
      return;
    }
  }, [question]);

  if (!question) return <Spinner />;

  return (
    <div
      className={`lg:p-4 py-5 overflow-hidden bg-white rounded lg:shadow transition-all px-2.5 ${
        question.hidden && "hidden"
      }`}
    >
      <QuestionItemContent
        question={question}
        isDetails={isDetails}
        isQuestEditable={isQuestEditable}
        isQuestDeletable={isQuestDeletable}
        canEditQuest={canEditQuest}
        onQuestEdit={onQuestEdit}
        onQuestDel={onQuestDel}
        totalComments={totalComments}
        totalLikes={totalLikes}
        totalViews={totalViews}
        onOpenVideoDialog={onOpenVideoDialog}
        onOpenShareDialog={onOpenShareDialog}
      />

      <QuestionItemToolbar
        question={question}
        wasQuestLiked={wasQuestLiked}
        canLikeQuest={canLikeQuest}
        canComment={canComment}
        onQuestLike={handleQuestLike}
        onOpenShareDialog={onOpenShareDialog}
        globalCustomerId={globalCustomerId}
        adminId={adminId}
        onOpenRequestDialog={onOpenRequestDialog}
      />

      <QuestionCommentsProvider
        questionId={question.id}
        isDetails={isDetails}
        onTotalCommentsChange={handleTotalCommentsChange}
        isCommentHidable={isCommentHidable}
        canLikeComment={canLikeComment}
        adminId={adminId}
        expertId={expertId}
        globalCustomerId={globalCustomerId}
        onOpenRequestDialog={onOpenRequestDialog}
        editCommentId={editCommentId}
        onEditCommentIdChange={handleEditCommentIdChange}
      >
        <QuestionCommentList />
        {canComment && !editCommentId && (
          <div className="" id={`${question.id}-commentInputDiv`}>
            <QuestionCommentInput
              globalCustomerId={globalCustomerId}
              questionId={question.id}
              isDetails={isDetails}
              onTotalCommentsChange={handleTotalCommentsChange}
              onOpenRequestDialog={onOpenRequestDialog}
            />
          </div>
        )}
      </QuestionCommentsProvider>
    </div>
  );
}

export const scrollSmooth = (id: string, block: ScrollLogicalPosition = "center") => {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block });
};

export const focusElement = (id: string) => {
  const el = document.getElementById(id);
  el?.focus({
    preventScroll: true,
  });
};

export const countLines = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const divHeight = el.offsetHeight;
  const lineHeight = parseInt(
    document.defaultView.getComputedStyle(el, null).getPropertyValue("line-height")
  );
  const lines = Math.floor(divHeight / lineHeight);
  return lines;
};
