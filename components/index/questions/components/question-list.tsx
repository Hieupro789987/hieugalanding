import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { useOnScreen } from "../../../../lib/hooks/useOnScreen";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Question, QuestionService } from "../../../../lib/repo/question/question.repo";
import { RequestDialog } from "../../../shared/common/request-dialog";
import { SearchNotFound } from "../../../shared/common/search-not-found";
import { QuestionForm } from "../../../shared/question/components/question-form/question-form";
import { QuestionItem } from "../../../shared/question/components/question-item/question-item";
import { QuestionShareDialog } from "../../../shared/question/components/question-share-dialog";
import { useQuestionsContext } from "../../../shared/question/providers/questions-provider";
import { VideoDialog } from "../../../shared/shop-layout/video-dialog";
import { Button, Field, Form, Input } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";

export function QuestionList({ ...props }) {
  const toast = useToast();
  const alert = useAlert();
  const router = useRouter();
  const { query } = router;
  const searchQuery = useQuery("search");
  const screenLg = useScreen("lg");
  const { user, expert, globalCustomer } = useAuth();
  const [search, setSearch] = useState("");
  const [openVideoDialog, setOpenVideoDialog] = useState<string>();
  const [openShareDialog, setOpenShareDialog] = useState<Question>();
  const [openRequestDialog, setOpenRequestDialog] = useState<"requestLogin" | "notEditQuest">();

  const {
    questionListCrud: {
      items: questionList,
      loadMore,
      hasMore,
      loading,
      pagination,
      setItems,
      setPagination,
    },
  } = useQuestionsContext();

  const handleSubmitSearch = () => {
    let newQuery = { ...query };
    const searchTrim = search.trim();

    if (!!searchTrim) {
      newQuery = { ...newQuery, search: searchTrim };
    } else {
      delete newQuery["search"];
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCloseEditQuestionForm = () => {
    const { edit, ...rest } = query;

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
      let newQuestionList = [...questionList];
      newQuestionList = newQuestionList.filter((quest) => quest.id !== delQuest.id);
      await setItems(newQuestionList);
      const total = pagination.total - 1;
      await setPagination({
        ...pagination,
        total,
      });
      toast.success("Xóa câu hỏi thành công.");
    } catch (error) {
      console.log(error);
      toast.error("Xóa câu hỏi thất bại.", `${error.message}`);
    }
  };

  const handleOpenVideoDialog = (url: string) => setOpenVideoDialog(url);

  const handleOpenShareDialog = (quest: Question) => setOpenShareDialog(quest);

  const handleRequestLoginDialog = () => setOpenRequestDialog("requestLogin");

  useEffect(() => {
    if (!!searchQuery) setSearch(searchQuery as string);
  }, [searchQuery]);

  const QuestionListContent = () => {
    const ref = useRef();
    const onScreen = useOnScreen(ref, "-4px");

    useEffect(() => {
      if (onScreen && hasMore) {
        loadMore();
      }
    }, [onScreen]);

    return (
      <div className="gap-4 mt-4 transition-all lg:mt-6 flex-cols">
        {!questionList ? (
          <Spinner />
        ) : questionList.length === 0 ? (
          // <NotFound text="Không tìm thấy câu hỏi nào." />
          <SearchNotFound type="câu hỏi"/>
        ) : (
          <>
            {questionList.map((question) => {
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

              return (
                <QuestionItem
                  key={question.id}
                  question={question}
                  adminId={user?.id}
                  expertId={expert?.id}
                  globalCustomerId={globalCustomer?.id}
                  isDetails={false}
                  canComment={!!globalCustomer?.id}
                  isQuestDeletable={globalCustomer?.id === question.globalCustomerId}
                  isQuestEditable={globalCustomer?.id === question.globalCustomerId}
                  canLikeQuest
                  onQuestDel={handleQuestDel}
                  onQuestEdit={handleQuestEdit}
                  isCommentHidable={false}
                  canLikeComment
                  onOpenVideoDialog={handleOpenVideoDialog}
                  onOpenShareDialog={handleOpenShareDialog}
                  onOpenRequestDialog={handleRequestLoginDialog}
                />
              );
            })}

            {loading ? (
              <div className="flex-center">
                <Spinner className="pb-0" />
              </div>
            ) : (
              <div className="h-4" ref={ref}></div>
            )}

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
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 w-full">
      <Form onSubmit={handleSubmitSearch}>
        <Field name="" noError>
          <Input
            clearable
            placeholder="Tìm kiếm câu hỏi"
            className="w-auto lg:w-full py-1 mx-2.5  border-none shadow lg:mx-0"
            prefix={
              <Button
                unfocusable
                submit
                icon={<RiSearchLine />}
                iconClassName="font-semibold cursor-pointer text-primary text-lg"
                className="px-0"
              />
            }
            value={search}
            onChange={(val) => {
              setSearch(val);
              if (!val) {
                let newQuery = { ...query };
                delete newQuery["search"];
                router.push(
                  {
                    pathname: router.pathname,
                    query: newQuery,
                  },
                  undefined,
                  { shallow: true }
                );
              }
            }}
          />
        </Field>
      </Form>
      {!!searchQuery && !loading && (
        <div className="mt-1.5 text-sm ml-3 lg:ml-0">
          Hiển thị <span className="font-semibold">{`${pagination.total}`}</span> kết quả cho{" "}
          <span className="font-semibold">{`"${searchQuery}"`}</span>
        </div>
      )}
      <QuestionListContent />
      <QuestionForm isOpen={!!router.query.edit} onClose={handleCloseEditQuestionForm} />
    </div>
  );
}
