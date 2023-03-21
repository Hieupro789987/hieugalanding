import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { Question, QuestionService } from "../../../lib/repo/question/question.repo";
import { RequestDialog } from "../../shared/common/request-dialog";
import { QuestionForm } from "../../shared/question/components/question-form/question-form";
import { QuestionItem } from "../../shared/question/components/question-item/question-item";
import { QuestionShareDialog } from "../../shared/question/components/question-share-dialog";
import { VideoDialog } from "../../shared/shop-layout/video-dialog";
import { BreadCrumbs, Spinner } from "../../shared/utilities/misc";
import { QuestionsFilters } from "../questions/components/questions-filters";
import {
  QuestionDetailsProvider,
  useQuestionDetailsContext,
} from "./providers/question-details-provider";

export function QuestionDetailsPage() {
  return (
    <QuestionDetailsProvider>
      <div className="flex-1 bg-white lg:bg-gray-100">
        <QuestionDetailsBody />
      </div>
    </QuestionDetailsProvider>
  );
}

interface QuestionDetailsBodyProps extends ReactProps {}

function QuestionDetailsBody({ ...props }: QuestionDetailsBodyProps) {
  const toast = useToast();
  const alert = useAlert();
  const router = useRouter();
  const screenLg = useScreen("lg");
  const { user, expert, globalCustomer } = useAuth();
  const { question } = useQuestionDetailsContext();
  const [openVideoDialog, setOpenVideoDialog] = useState<string>();
  const [openShareDialog, setOpenShareDialog] = useState<Question>();
  const [openRequestDialog, setOpenRequestDialog] = useState<"requestLogin" | "notEditQuest">();
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    if (!question?.id) return;

    increaseQuestionView();
    setTotalViews(question?.viewCount + 1);
  }, [question]);

  const increaseQuestionView = async () => {
    try {
      await QuestionService.increaseQuestionView(question.id);
    } catch (error) {
      console.debug(error);
    }
  };

  const handleCloseEditQuestionForm = () => {
    const { edit, ...rest } = router.query;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...rest,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleQuestDel = async (delQuest: Question) => {
    try {
      const res = await alert.danger("Xóa câu hỏi?", "Bạn muốn xóa câu hỏi này?");
      if (!res) return;

      await QuestionService.delete({ id: delQuest.id });
      await router.replace("/questions");
      toast.success("Xóa câu hỏi thành công.");
    } catch (error) {
      console.log(error);
      toast.error("Xóa câu hỏi thất bại.", `${error.message}`);
    }
  };

  const handleQuestEdit = (canEditQuest: boolean) => {
    if (!canEditQuest) {
      setOpenRequestDialog("notEditQuest");
      return;
    }

    if (!screenLg) {
      router.push(
        {
          pathname: "/questions/edit",
          query: { id: question.id },
        },
        "/questions/edit"
      );
      return;
    }

    router.push(
      {
        pathname: `/questions/${question.slug}`,
        query: {
          edit: true,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleOpenVideoDialog = (url: string) => setOpenVideoDialog(url);

  const handleOpenShareDialog = (quest: Question) => setOpenShareDialog(quest);

  const handleRequestLoginDialog = () => setOpenRequestDialog("requestLogin");

  if (!question) return <Spinner />;

  return (
    <div className={`flex-1 text-accent pt-5 lg:pb-16 main-container`}>
      <div className="lg:pb-7">
        <BreadCrumbs
          breadcrumbs={[
            { label: "Trang chủ", href: `/` },
            { label: "Hỏi đáp", href: `/questions` },
            { label: `${question?.title}` },
          ]}
        />
      </div>
      <div className={`flex lg:flex-row flex-col justify-between items-start lg:gap-8`}>
        <div className="w-60 grow-0 shrink-0">
          <QuestionsFilters isDetails />
        </div>
        <div className="flex-1 w-full lg:w-auto">
          <QuestionItem
            question={question}
            adminId={user?.id}
            expertId={expert?.id}
            globalCustomerId={globalCustomer?.id}
            isDetails
            canComment={!!globalCustomer?.id}
            isQuestDeletable={globalCustomer?.id === question.globalCustomerId}
            isQuestEditable={globalCustomer?.id === question.globalCustomerId}
            viewCount={totalViews}
            onIncreaseViews={increaseQuestionView}
            canLikeQuest
            onQuestDel={handleQuestDel}
            onQuestEdit={handleQuestEdit}
            isCommentHidable={false}
            canLikeComment
            onOpenVideoDialog={handleOpenVideoDialog}
            onOpenShareDialog={handleOpenShareDialog}
            onOpenRequestDialog={handleRequestLoginDialog}
          />
        </div>
        {screenLg && <div className="w-60 grow-0 shrink-0" />}
      </div>
      <QuestionForm
        isOpen={!!router.query.edit}
        onClose={handleCloseEditQuestionForm}
        data={question}
      />
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
        isOpen={!!openRequestDialog}
        onClose={() => setOpenRequestDialog(null)}
        title={
          openRequestDialog === "requestLogin"
            ? "Vui lòng đăng nhập để tương tác."
            : "Không thể chỉnh sửa câu hỏi đã có người bình luận."
        }
        {...(openRequestDialog === "requestLogin" && { hasRequestLogin: true })}
      />
    </div>
  );
}
