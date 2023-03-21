import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { RiArrowLeftLine, RiFilter2Line, RiPencilLine } from "react-icons/ri";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { DiseaseService } from "../../../../lib/repo/disease.repo";
import { PlantService } from "../../../../lib/repo/plant.repo";
import { QuestionTopicService } from "../../../../lib/repo/question/question-topic.repo";
import { LabelAccent } from "../../../shared/common/label-accent";
import { RequestDialog } from "../../../shared/common/request-dialog";
import { TitleDialog } from "../../../shared/dialog/title-dialog";
import { QuestionForm } from "../../../shared/question/components/question-form/question-form";
import { useQuestionsContext } from "../../../shared/question/providers/questions-provider";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog";
import { Button, Field, Form, Label, Select, Switch } from "../../../shared/utilities/form";

export function QuestionsFilters({ isDetails, ...props }: ReactProps & { isDetails?: boolean }) {
  const router = useRouter();
  const screenLg = useScreen("lg");
  const { globalCustomer } = useAuth();
  const [openFiltersMobileDialog, setOpenFiltersMobileDialog] = useState(false);
  const [openRequestLoginDialog, setOpenRequestLoginDialog] = useState(false);

  const handleClose = () => router.replace({ pathname: router.pathname, query: {} });

  const isMobileModeDetailsPage = !screenLg && isDetails;
  const isMobileModeListPage = !screenLg && !isDetails;
  const isDesktopModeDetailsPage = screenLg && isDetails;

  const filterCount = useMemo(() => {
    if ((router.query.sortBy as string) === "latest") {
      return Object.keys(router.query).length - 1;
    }

    return Object.keys(router.query).length;
  }, [router.query]);

  return (
    <div className="w-full lg:w-60 grow-0 shrink-0 px-2.5 lg:px-0 lg:sticky lg:top-10">
      {screenLg && <div className="my-3 text-3xl font-bold">Hỏi đáp</div>}
      <div className="flex flex-row gap-3 lg:flex-col">
        {!isMobileModeDetailsPage && (
          <Button
            text="Tạo câu hỏi"
            icon={<RiPencilLine />}
            iconClassName="text-xl"
            className="w-full h-12"
            primary
            {...(globalCustomer
              ? screenLg
                ? { href: `/questions?create=true` }
                : { href: "/questions/create" }
              : {
                  onClick: () => setOpenRequestLoginDialog(true),
                })}
          />
        )}
        {isMobileModeListPage && (
          <Button
            text="Bộ lọc"
            icon={<RiFilter2Line />}
            iconClassName="text-2xl"
            className={`relative h-12 font-bold text-gray-500 whitespace-nowrap ${
              filterCount ? "bg-primary-light border-primary text-primary" : "bg-white"
            }`}
            onClick={() => setOpenFiltersMobileDialog(true)}
          >
            {filterCount > 0 && (
              <div className="absolute top-0 z-20 w-5 h-5 text-xs text-white border-2 border-white rounded-full flex-center bg-danger left-8">
                {filterCount}
              </div>
            )}
          </Button>
        )}
      </div>
      <hr className="hidden my-4 lg:inline-block" />
      {isDesktopModeDetailsPage ? (
        <Button
          text="Quay lại danh sách câu hỏi"
          textPrimary
          className="px-0 lg:hover:underline"
          icon={<RiArrowLeftLine />}
          iconClassName="text-xl"
          href="/questions"
        />
      ) : (
        <>
          {screenLg && (
            <>
              <div className="mb-2 text-lg font-bold">Lọc theo</div>
              <FiltersBody />
            </>
          )}
        </>
      )}
      <QuestionForm isOpen={!!router?.query?.create} onClose={handleClose} />
    
      <FiltersMobileDialog
        isOpen={openFiltersMobileDialog}
        onClose={() => setOpenFiltersMobileDialog(false)}
      />
      <RequestDialog
        isOpen={openRequestLoginDialog}
        onClose={() => setOpenRequestLoginDialog(false)}
        title="Vui lòng đăng nhập để tạo câu hỏi mới"
        hasRequestLogin
      />
    </div>
  );
}

function FiltersBody() {
  const router = useRouter();
  const { query } = router;
  const { globalCustomer } = useAuth();
  const { onFilterChange } = useQuestionsContext();

  return (
    <>
      {!!globalCustomer?.id && (
        <div className="flex items-center justify-between mt-3 lg:mt-0">
          <Label text="Câu hỏi của tôi" />
          <Switch
            //value of query is string
            value={query.ownQuestion === "true"}
            onChange={(val) => onFilterChange({ ownQuestion: val })}
          />
        </div>
      )}
      <Select
        clearable
        optionsPromise={() => PlantService.getAllOptionsPromise()}
        placeholder="Loại cây"
        className="w-full mt-2 lg:border-none"
        value={query.plantId}
        onChange={(val) => onFilterChange({ plantId: val })}
      />
      {/* <Select
        clearable
        optionsPromise={() => DiseaseService.getAllOptionsPromise()}
        placeholder="Loại bệnh"
        className="w-full mt-3 lg:border-none"
        value={query.diseaseId}
        onChange={(val) => onFilterChange({ diseaseId: val })}
      /> */}
            <Select
        clearable
        optionsPromise={() => QuestionTopicService.getAllOptionsPromise()}
        placeholder="Chủ đề"
        className="w-full mt-3 lg:border-none"
        value={query.questionTopicId}
        onChange={(val) => onFilterChange({ questionTopicId: val })}
      />
      <div className="mt-5 mb-2 text-lg font-bold">Sắp xếp</div>
      <Select
        options={SORT_OPTIONS}
        className="w-full mt-3 lg:border-none"
        value={query.sortBy || "latest"}
        onChange={(val) => onFilterChange({ sortBy: val })}
      />
    </>
  );
}

function FiltersMobileDialog({ ...props }: DialogProps) {
  return (
    <Dialog slideFromBottom="mobile-only" {...props}>
      <Dialog.Body>
        <TitleDialog title="Bộ lọc" onClose={props.onClose} />
        <FiltersBodyMobile onClose={props.onClose} />
      </Dialog.Body>
    </Dialog>
  );
}

function FiltersBodyMobile({ ...props }: DialogProps) {
  const router = useRouter();
  const { query } = router;
  const { globalCustomer } = useAuth();
  const { onFilterChange } = useQuestionsContext();

  const handleSubmit = (data) => {
    onFilterChange(data);
    props.onClose();
  };

  return (
    <Form onSubmit={handleSubmit}>
      {!!globalCustomer?.id && (
        <div className="flex items-center justify-between mt-3 lg:mt-0">
          <LabelAccent text="Câu hỏi của tôi" />
          <Field label="" name="ownQuestion" noError>
            <Switch defaultValue={query?.ownQuestion} className="mb-1" />
          </Field>
        </div>
      )}
      <Field label="Loại cây" name="plantId" labelClassName="text-accent" noError className="mt-1">
        <Select
          clearable
          searchable={false}
          optionsPromise={() => PlantService.getAllOptionsPromise()}
          placeholder="Loại cây"
          className="w-full lg:border-none"
          defaultValue={query?.plantId}
        />
      </Field>
      {/* <Field
        label="Loại bệnh"
        name="diseaseId"
        labelClassName="text-accent"
        noError
        className="mt-4"
      >
        <Select
          clearable
          searchable={false}
          optionsPromise={() => DiseaseService.getAllOptionsPromise()}
          placeholder="Loại bệnh"
          className="w-full lg:border-none"
          defaultValue={query?.diseaseId}
        />
      </Field> */}
       <Field
        label="Chủ đề"
        name="questionTopicId"
        labelClassName="text-accent"
        noError
        className="mt-4"
      >
        <Select
          clearable
          searchable={false}
          optionsPromise={() => QuestionTopicService.getAllOptionsPromise()}
          placeholder="Chủ đề"
          className="w-full lg:border-none"
          defaultValue={query?.questionTopicId}
        />
      </Field>
      <div className="pt-2.5 mt-5 mb-2 text-lg font-bold border-t">Sắp xếp</div>
      <Field
        label="Loại sắp xếp"
        name="sortBy"
        labelClassName="text-accent"
        noError
        className="mt-2"
      >
        <Select
          searchable={false}
          options={SORT_OPTIONS}
          className="w-ful lg:border-none"
          defaultValue={query?.sortBy || "latest"}
        />
      </Field>
      <Button
        primary
        text="Xác nhận"
        className="w-full mt-6 shadow h-14 shadow-green-700/50"
        submit
      />
    </Form>
  );
}

const SORT_OPTIONS = [
  { value: "latest", label: "Mới nhất" },
  { value: "mostLike", label: "Like nhiều nhất" },
  { value: "mostComment", label: "Bình luận nhiều nhất" },
];
