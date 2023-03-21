import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Question, QuestionService } from "../../../../lib/repo/question/question.repo";
import { QuestionDetailsProvider } from "../../../index/question-details/providers/question-details-provider";
import { RequestDialog } from "../../common/request-dialog";
import { VideoDialog } from "../../shop-layout/video-dialog";
import { Dialog, DialogProps } from "../../utilities/dialog";
import { Spinner } from "../../utilities/misc";
import { QuestionItem } from "./question-item/question-item";
import { QuestionShareDialog } from "./question-share-dialog";

export function QuestionDetailsDialog({
  isAdmin,
  isExpert,
  ...props
}: DialogProps & {
  isAdmin?: boolean;
  isExpert?: boolean;
}) {
  const toast = useToast();
  const alert = useAlert();
  const router = useRouter();
  const id = useQuery("id");
  const { expert, user, globalCustomer } = useAuth();
  const [question, setQuestion] = useState<Question>();
  const [totalComments, setTotalComments] = useState(0);
  const [openVideoDialog, setOpenVideoDialog] = useState<string>();
  const [openShareDialog, setOpenShareDialog] = useState<Question>();
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  const getQuestionDetails = async () => {
    if (!id) return;

    try {
      const questionData = await QuestionService.getOne({ id });
      setQuestion(questionData);
    } catch (error) {
      console.log(error);
      toast.error("Lấy chi tiết câu hỏi thất bại!", `${error.message}`);
    }
  };

  const handleQuestDel = async (delQuest: Question) => {
    try {
      const res = await alert.danger("Xóa câu hỏi?", "Bạn muốn xóa câu hỏi này?");
      if (!res) return;

      await QuestionService.delete({ id: delQuest.id });
      await router.replace({ pathname: router.pathname, query: {} });
      toast.success("Xóa câu hỏi thành công.");
    } catch (error) {
      console.log(error);
      toast.error("Xóa câu hỏi thất bại.", `${error.message}`);
    }
  };

  const handleTotalCommentsChange = (total: number) => {
    if (total < 0) return;
    setTotalComments(total);
  };

  const handleQuestEdit = (canEditQuest: boolean) => {
    if (!canEditQuest) {
      setOpenRequestDialog(true);
      return;
    }

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          edit: true,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleOpenVideoDialog = (url: string) => setOpenVideoDialog(url);

  const handleOpenShareDialog = (quest: Question) => setOpenShareDialog(quest);

  useEffect(() => {
    getQuestionDetails();
  }, [router.asPath]);

  useEffect(() => {
    setTotalComments(question?.commentCount);
  }, [question?.commentCount]);

  return (
    <Dialog {...props} title={`Xem chi tiết câu hỏi ${question?.code || ""}`} width="820px">
      <Dialog.Body>
        {!question ? (
          <Spinner />
        ) : (
          <QuestionItem
            question={question}
            adminId={user?.id}
            expertId={expert?.id}
            globalCustomerId={globalCustomer?.id}
            isDetails
            {...(isAdmin && {
              canComment: false,
              isQuestDeletable: true,
              isQuestEditable: false,
              canLikeQuest: false,
              onQuestDel: handleQuestDel,

              totalComments,
              onTotalCommentsChange: handleTotalCommentsChange,
              isCommentHidable: true,
              canLikeComment: false,

              onOpenVideoDialog: handleOpenVideoDialog,
              onOpenShareDialog: handleOpenShareDialog,
            })}
            {...(isExpert && {
              canComment: true,
              isQuestDeletable: expert?.id === question.expertId,
              isQuestEditable: expert?.id === question.expertId,
              canLikeQuest: true,
              onQuestDel: handleQuestDel,
              onQuestEdit: handleQuestEdit,

              totalComments: totalComments,
              onTotalCommentsChange: handleTotalCommentsChange,
              isCommentHidable: false,
              canLikeComment: true,

              onOpenVideoDialog: handleOpenVideoDialog,
              onOpenShareDialog: handleOpenShareDialog,
            })}
          />
        )}
      </Dialog.Body>
      <VideoDialog
        videoUrl={openVideoDialog || ""}
        isOpen={!!openVideoDialog}
        onClose={() => setOpenVideoDialog("")}
      />
      <QuestionShareDialog
        question={openShareDialog}
        isOpen={!!openShareDialog}
        onClose={() => setOpenShareDialog(null)}
      />
      <RequestDialog
        isOpen={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        title="Không thể chỉnh sửa câu hỏi đã có người bình luận."
      />
    </Dialog>
  );
}
