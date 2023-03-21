import { useRouter } from "next/router";
import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { RiDeleteBin7Line, RiEdit2Line, RiEyeLine } from "react-icons/ri";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { DiseaseService } from "../../../../lib/repo/disease.repo";
import { PlantService } from "../../../../lib/repo/plant.repo";
import { QuestionTopicService } from "../../../../lib/repo/question/question-topic.repo";
import { Question, QuestionService } from "../../../../lib/repo/question/question.repo";
import { ExpertTransferDialog } from "../../../expert/expert-questions/components/expert-transfer-dialog";
import { RequestDialog } from "../../common/request-dialog";
import { Button, DatePicker, Field, Radio, Select, Switch } from "../../utilities/form";
import { DataTable } from "../../utilities/table/data-table";
import { QuestionForm } from "./question-form/question-form";

export function QuestionDataTable({
  isAdmin,
  isExpert,
  question,
  setQuestion,
  ...props
}: ReactProps & {
  isAdmin?: boolean;
  isExpert?: boolean;
  question?: Question;
  setQuestion?: (question: Question) => void;
}) {
  const router = useRouter();
  const { expert } = useAuth();
  const [filter, setFilter] = useState({
    isDeleted: false,
    expertId: undefined,
    assignedExpertId: undefined,
  });
  const [date, setDate] = useState<any>();
  const [isExpertCommented, setIsExpertCommented] = useState();
  const [openRequestDialog, setOpenRequestDialog] = useState(false);

  const handleFilter = (val: string) => {
    switch (val) {
      case "myQuestion":
        setFilter({
          isDeleted: false,
          expertId: expert?.id,
          assignedExpertId: undefined,
        });
        break;
      case "assignedToMe":
        setFilter({
          isDeleted: false,
          expertId: undefined,
          assignedExpertId: expert?.id,
        });
        break;
      default:
        setFilter({
          isDeleted: false,
          expertId: undefined,
          assignedExpertId: undefined,
        });
    }
  };

  const handleFilterDate = (val) => {
    const obj = { createdAt: val?.startDate && val?.endDate ? {} : undefined };
    if (val?.startDate) {
      obj["createdAt"]["$gte"] = val?.startDate;
    }
    if (val?.endDate) {
      obj["createdAt"]["$lte"] = val?.endDate;
    }
    setDate(obj);
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

  const handleClearQueryRouter = () => router.replace({ pathname: router.pathname, query: {} });

  return (
    <>
      <DataTable<Question>
        crudService={QuestionService}
        order={{ createdAt: -1 }}
        filter={{
          isDeleted: { $ne: true },
          expertId: filter?.expertId,
          assignedExpertId: filter?.assignedExpertId,
          isExpertCommented: isExpertCommented || undefined,
          ...date,
        }}
        updateItem={(item) =>
          router.replace({ pathname: location.pathname, query: { id: item.id } })
        }
      >
        <DataTable.Header>
          <div className="">
            <div className="text-lg font-semibold">Danh sách câu hỏi</div>
            <DataTable.Consumer>
              {({ pagination: { total } }) => (
                <div className="text-sm text-gray-600">{`Tổng ${total || 0} câu hỏi`}</div>
              )}
            </DataTable.Consumer>
          </div>
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            {isExpert && (
              <DataTable.Button primary text="Tạo câu hỏi" href={`/expert/questions?create=true`} />
            )}
          </DataTable.Buttons>
        </DataTable.Header>
        <div className="mt-4">
          <DataTable.Toolbar>
            <DataTable.Search placeholder="Tìm kiếm câu hỏi" />
          </DataTable.Toolbar>
        </div>
        <div className="flex items-start mt-4 gap-x-6">
          <div className="w-80 shrink-0 grow-0">
            <div className="p-4 border rounded">
              <div className="text-lg font-bold uppercase">Bộ lọc</div>

              {/* <DataTable.Filter className="" defaultValues={isExpert ? { typeQuestion: "all" } : {}}> */}
              <DataTable.Filter className="" defaultValues={{}}>
                <div className="gap-2 mt-2 flex-cols">
                  {isExpert && (
                    <Field noError>
                      <Radio
                        className="flex-cols"
                        selectFirst
                        options={[
                          { value: "", label: "Tất cả" },
                          { value: "myQuestion", label: "Câu hỏi của tôi" },
                          // { value: "assignedToMe", label: "Chỉ định cho tôi" },
                        ]}
                        onChange={(val) => handleFilter(val)}
                      />
                    </Field>
                  )}
                  <Field noError>
                    <Switch
                      placeholder="Đã được chuyên gia trả lời"
                      onChange={(val) => setIsExpertCommented(val)}
                    />
                  </Field>
                  <Field noError label="Loại cây" name="plantId">
                    <Select
                      placeholder="Vui lòng chọn loại cây"
                      clearable
                      optionsPromise={() => PlantService.getAllOptionsPromise()}
                    />
                  </Field>
                  {/* <Field noError className="mt-1.5" label="Loại bệnh" name="diseaseId">
                    <Select
                      placeholder="Vui lòng chọn loại bệnh"
                      clearable
                      optionsPromise={() => DiseaseService.getAllOptionsPromise()}
                    />
                  </Field> */}
                  <Field noError className="mt-1.5" label="Chủ đề" name="questionTopicId">
                    <Select
                      placeholder="Vui lòng chọn chủ đề"
                      clearable
                      optionsPromise={() => QuestionTopicService.getAllOptionsPromise()}
                    />
                  </Field>
                  <Field label="Thời gian" noError>
                    <DatePicker
                      selectsRange
                      startOfDay
                      endOfDay
                      onChange={(val) => handleFilterDate(val)}
                    />
                  </Field>
                </div>
              </DataTable.Filter>
            </div>
          </div>
          <div className="flex-1">
            <DataTable.Consumer>
              {({ changeRowData }) => (
                <DataTable.Table disableDbClick>
                  <DataTable.Column
                    label={"Mã câu hỏi"}
                    render={(item: Question) => (
                      <DataTable.CellText
                        className="font-bold"
                        value={item.code}
                        subText={
                          item.isExpertCommented && (
                            <div className="text-primary">Chuyên gia đã bình luận</div>
                          )
                        }
                      />
                    )}
                  />
                  <DataTable.Column
                    label={"Câu hỏi"}
                    render={(item: Question) => (
                      <DataTable.CellText
                        className="max-w-sm"
                        value={<div className="text-ellipsis-2">{item.title}</div>}
                      />
                    )}
                  />
                  <DataTable.Column
                    label={"Loại cây"}
                    center
                    render={(item: Question) => <DataTable.CellText value={item.plant?.name} />}
                  />
                  {/* <DataTable.Column
                    label={"Loại bệnh"}
                    center
                    render={(item: Question) => <DataTable.CellText value={item.disease?.name} />}
                  /> */}
                  <DataTable.Column
                    label={"Chủ đề"}
                    center
                    render={(item: Question) => (
                      <DataTable.CellText value={item.questionTopic?.name} />
                    )}
                  />
                  <DataTable.Column
                    label={"Chuyên gia chỉ định"}
                    center
                    render={(item: Question) => (
                      <DataTable.CellText value={item.assignedExpert?.name} />
                    )}
                  />
                  <DataTable.Column
                    center
                    width={30}
                    className={`${!isAdmin && "hidden"}`}
                    render={(item: Question) => (
                      <DataTable.CellText
                        className="flex justify-center"
                        value={
                          !isAdmin ? (
                            <></>
                          ) : (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              data-tooltip="Ẩn hiện câu hỏi"
                              data-placement="top-center"
                            >
                              <Switch
                                dependent
                                value={!item.isHidden}
                                onChange={async () => {
                                  try {
                                    const res = await QuestionService.questionMarkHidden(
                                      item.id,
                                      !item.isHidden
                                    );
                                    changeRowData(item, "isHidden", res.isHidden);
                                  } catch (err) {
                                    changeRowData(item, "isHidden", item.isHidden);
                                  }
                                }}
                              />
                            </div>
                          )
                        }
                      />
                    )}
                  />
                  <DataTable.Column
                    right
                    render={(item: Question) => (
                      <>
                        {isExpert && expert?.id === item?.expertId && (
                          <Button
                            icon={<RiEdit2Line />}
                            className="px-[0.375rem]"
                            tooltip="Chỉnh sửa câu hỏi"
                            onClick={() => {
                              setQuestion(item);
                              if (item.commentCount > 0) {
                                setOpenRequestDialog(true);
                                return;
                              }

                              router.push(
                                {
                                  pathname: router.pathname,
                                  query: { edit: true },
                                },
                                undefined,
                                { shallow: true }
                              );
                            }}
                          />
                        )}
                        <DataTable.CellButton
                          value={item}
                          icon={<RiEyeLine />}
                          iconClassName="text-lg"
                          tooltip="Xem chi tiết"
                          onClick={() => {
                            setQuestion(item);
                            router.replace({ pathname: router.pathname, query: { id: item.id } });
                          }}
                        />
                        {isExpert && expert?.id === item?.assignedExpertId && (
                          <DataTable.CellButton
                            value={item}
                            icon={<AiOutlineSwap />}
                            tooltip="Đổi chuyên gia chỉ định"
                            onClick={() => {
                              setQuestion(item);
                              router.push(
                                {
                                  pathname: router.pathname,
                                  query: {
                                    transfer: true,
                                  },
                                },
                                undefined,
                                { shallow: true }
                              );
                            }}
                          />
                        )}
                        {(isAdmin || (isExpert && expert?.id === item?.expertId)) && (
                          <DataTable.CellButton
                            value={item}
                            tooltip="Xóa câu hỏi"
                            icon={<RiDeleteBin7Line />}
                            hoverDanger
                            isDeleteButton
                          />
                        )}
                      </>
                    )}
                  />
                </DataTable.Table>
              )}
            </DataTable.Consumer>
          </div>
        </div>
        <DataTable.Pagination />
        <QuestionForm
          isOpen={!!router.query?.create || !!router.query?.edit}
          onClose={() =>
            !!router.query?.create ? handleClearQueryRouter() : handleCloseEditQuestionForm()
          }
          data={!router.query.create && question}
        />
        <ExpertTransferDialog
          isOpen={!!router.query?.transfer}
          onClose={handleClearQueryRouter}
          question={question}
        />
        <RequestDialog
          isOpen={openRequestDialog}
          onClose={() => setOpenRequestDialog(false)}
          title="Không thể chỉnh sửa câu hỏi đã có người bình luận."
          hasRequestLogin={false}
        />
      </DataTable>
    </>
  );
}
