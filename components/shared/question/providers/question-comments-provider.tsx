import { createContext, useContext, useMemo } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import {
  QuestionComment,
  QuestionCommentService,
} from "../../../../lib/repo/question/question-comment.repo";

export const QuestionCommentsContext = createContext<
  Partial<{
    adminId: string | null;
    expertId: string | null;
    globalCustomerId: string | null;
    questionId: string;
    isDetails: boolean;
    displayQuestionCommentList: QuestionComment[];
    setQuestionCommentList: (displayQuestionCommentList: QuestionComment[]) => void;
    questionCommentListCrud: CrudProps<QuestionComment>;
    onTotalCommentsChange: (total: number) => void;
    isCommentHidable: boolean;
    canLikeComment: boolean;
    onOpenRequestDialog: () => void;
    editCommentId: string;
    onEditCommentIdChange: (editCommentId: string) => void;
  }>
>({});

interface CommentsProviderProps extends ReactProps {
  adminId: string | null;
  expertId: string | null;
  globalCustomerId: string | null;
  questionId: string;
  isDetails?: boolean;
  onTotalCommentsChange?: (total: number) => void;
  isCommentHidable: boolean;
  canLikeComment: boolean;
  onOpenRequestDialog?: () => void;
  editCommentId: string;
  onEditCommentIdChange: (editCommentId: string) => void;
}

export function QuestionCommentsProvider({
  adminId,
  expertId,
  globalCustomerId,
  questionId,
  isDetails = false,
  onTotalCommentsChange,
  isCommentHidable,
  canLikeComment,
  onOpenRequestDialog,
  editCommentId,
  onEditCommentIdChange,
  ...props
}: CommentsProviderProps) {
  const LIMIT = isDetails ? 1000 : 3;

  const questionCommentListCrud = useCrud(
    QuestionCommentService,
    {
      limit: LIMIT,
      order: { createdAt: -1 },
      filter: { questionId },
    },
    { fetchingCondition: !!questionId }
  );

  const displayQuestionCommentList = useMemo(() => {
    if (!questionCommentListCrud.items) return;

    return questionCommentListCrud.items
      .slice(0)
      .sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
  }, [questionCommentListCrud.items]);

  return (
    <QuestionCommentsContext.Provider
      value={{
        adminId,
        expertId,
        globalCustomerId,
        displayQuestionCommentList,
        questionCommentListCrud,
        questionId,
        isDetails,
        isCommentHidable,
        canLikeComment,
        onTotalCommentsChange,
        onOpenRequestDialog,
        editCommentId,
        onEditCommentIdChange,
      }}
    >
      {props.children}
    </QuestionCommentsContext.Provider>
  );
}

export const useQuestionCommentsContext = () => useContext(QuestionCommentsContext);
