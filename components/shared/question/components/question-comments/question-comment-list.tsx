import { Button } from "../../../utilities/form";
import { useQuestionCommentsContext } from "../../providers/question-comments-provider";
import { QuestionCommentItem } from "./question-comment-item";

export function QuestionCommentList({ ...props }: ReactProps & {}) {
  const {
    displayQuestionCommentList,
    questionCommentListCrud,
    isDetails,
    adminId,
    expertId,
    globalCustomerId,
  } = useQuestionCommentsContext();

  if (!displayQuestionCommentList || displayQuestionCommentList?.length === 0) return <></>;

  return (
    <div className="mt-3">
      {questionCommentListCrud.hasMore && !isDetails && (
        <Button
          className="pl-0 font-semibold text-primary"
          text="Xem bình luận cũ hơn"
          onClick={() => questionCommentListCrud.loadMore()}
          isLoading={questionCommentListCrud.loadingMore}
        />
      )}
      <div className="flex-cols">
        {displayQuestionCommentList.map((cmt, index) => (
          <QuestionCommentItem
            key={cmt.id}
            index={index}
            comment={cmt}
            isCommentEditable={
              globalCustomerId === cmt.globalCustomerId || expertId === cmt.expertId
            }
            isCommentDeletable={
              !!adminId || globalCustomerId === cmt.globalCustomerId || expertId === cmt.expertId
            }
            showHiddenComment={
              !!adminId || globalCustomerId === cmt.globalCustomerId || expertId === cmt.expertId
            }
          />
        ))}
      </div>
    </div>
  );
}
