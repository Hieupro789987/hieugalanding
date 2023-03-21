import { useRouter } from "next/router";
import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { GiSoundWaves } from "react-icons/gi";
import { RiArrowDownSLine, RiCloseLine, RiSearch2Line, RiVideoUploadLine } from "react-icons/ri";
import { useCrud } from "../../../../../lib/hooks/useCrud";
import { useDevice } from "../../../../../lib/hooks/useDevice";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { useAuth } from "../../../../../lib/providers/auth-provider";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { DiseaseService } from "../../../../../lib/repo/disease.repo";
import { ExpertService } from "../../../../../lib/repo/expert/expert.repo";
import { GraphService } from "../../../../../lib/repo/graph.repo";
import { Plant, PlantService } from "../../../../../lib/repo/plant.repo";
import {
  QuestionTopic,
  QuestionTopicService,
} from "../../../../../lib/repo/question/question-topic.repo";
import { Question, QuestionService } from "../../../../../lib/repo/question/question.repo";
import { useQuestionDetailsContext } from "../../../../index/question-details/providers/question-details-provider";
import { ImageUploadField } from "../../../common/image-upload-field";
import { LabelAccent, labelAccentField } from "../../../common/label-accent";
import { TextRequired } from "../../../common/text-required";
import {
  Button,
  Field,
  Form,
  FormProps,
  Input,
  Label,
  Select,
  Textarea,
} from "../../../utilities/form";
import { AddressGroup } from "../../../utilities/form/address-group";
import { Img, Scrollbar, Spinner } from "../../../utilities/misc";
import { Dropdown } from "../../../utilities/popover/dropdown";
import { Popover } from "../../../utilities/popover/popover";
import { useDataTable } from "../../../utilities/table/data-table";
import { useQuestionsContext } from "../../providers/questions-provider";
import { QuestionFormPlant } from "./components/question-form-plant";
import { QuestionFormTopic } from "./components/question-form-topic";
import { QuestionFormTopicAndPlant } from "./components/question-form-topicAndPlant";

export function QuestionForm({ data, ...props }: FormProps & { data?: Question }) {
  const screenLg = useScreen("lg");
  const toast = useToast();
  const router = useRouter();
  const { expert } = useAuth();
  const { loadAll } = useDataTable();
  const [question, setQuestion] = useState<Question>();
  const { questionListCrud } = useQuestionsContext();
  const { getQuestionDetails } = useQuestionDetailsContext();
  const [plants, setPlants] = useState<Plant[]>();
  const [questionTopics, setQuestionTopics] = useState<QuestionTopic[]>();

  const [mode, setMode] = useState<{
    TOPIC_AND_PLANT: boolean;
    QUESTION: boolean;
  }>();

  const getAllTopicsAndPlants = async () => {
    try {
      const query = { query: { limit: 0, order: { createdAt: -1 } } };
      const {
        data: { g0, g1 },
      } = await GraphService.query({
        query: [QuestionTopicService.getAllQuery(query), PlantService.getAllQuery(query)],
      });

      const topicOther = g0.data.find((x) => x.name.toLowerCase() === "khác");
      const plantOther = g1.data.find((x) => x.name.toLowerCase() === "khác");

      const quesTopics = topicOther
        ? [...g0.data.filter((x) => x.name.toLowerCase() !== "khác"), topicOther]
        : g0.data;
      const newPlants = plantOther
        ? [
            ...[
              ...[...g1.data].filter((x) => x.name.toLowerCase() !== "khác").slice(0, 7),
              plantOther,
            ],
            ...[...g1.data.slice(8, g1.data.length)],
          ]
        : g1.data;

      setQuestionTopics(quesTopics);
      // .splice(7, 1, plantOther)
      setPlants(newPlants);
    } catch (error) {
      console.error(error);
    }
  };

  const getQuestion = async () => {
    const id = router.query.id as string;
    if (!id) return;

    try {
      const questionData = await QuestionService.getOne({ id });
      setQuestion(questionData);
    } catch (error) {
      console.log(error);
    }
  };

  const getQuestionBySlug = async () => {
    const id = router.query.id as string;
    if (!id) return;

    try {
      const { data } = await QuestionService.getAll({
        query: { filter: { slug: router.query.slug as string } },
      });
      setQuestion(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTopicsAndPlants();
  }, []);

  useEffect(() => {
    if (router.query?.create) {
      setQuestion(null);
      setMode({ TOPIC_AND_PLANT: true, QUESTION: false });

      return;
    }
    if (router.query?.edit && !!data?.id) {
      setQuestion(data);
      setMode({ TOPIC_AND_PLANT: false, QUESTION: true });
      return;
    }

    if (router.query?.edit && !data?.id) {
      getQuestionBySlug();
      setMode({ TOPIC_AND_PLANT: false, QUESTION: true });
      return;
    }

    if (router.query?.id) {
      getQuestion();
      setMode({ TOPIC_AND_PLANT: false, QUESTION: true });
      return;
    }
  }, [router.query, router.query?.edit, router.query?.create]);

  useEffect(() => {
    if (!!data?.id && !router.query?.edit) {
      setQuestion(data);
      setMode({ TOPIC_AND_PLANT: false, QUESTION: true });
    }
    if (!router.query?.edit && !!router.query?.id) {
      getQuestion();
      setMode({ TOPIC_AND_PLANT: false, QUESTION: true });
    }
  }, [data]);

  useEffect(() => {
    if (!props.onClose && (!!router.query?.edit || !router.query?.id)) {
      setMode({ TOPIC_AND_PLANT: true, QUESTION: false });
    }
  }, [props.onClose]);

  return (
    <Form
      width={794}
      defaultValues={question ? question : {}}
      onSubmit={async (data) => {
        const { address, ...rest } = data;
        let newQues = rest;
        if (rest.diseaseId === "") {
          newQues = { ...rest, diseaseId: null };
          data = { ...data, diseaseId: null };
        }
        if (question) {
          try {
            await QuestionService.updateQuestion(question.id, data);
            !router.pathname.includes("/expert/questions") ? getQuestionDetails() : loadAll();
            screenLg ? props.onClose() : router.back();
          } catch (error) {
            console.log(error);
            toast.error("Chỉnh sửa câu hỏi không thành công", error?.message);
          }
        } else {
          try {
            await QuestionService.createQuestion(data.address.provinceId ? data : newQues);

            screenLg ? props.onClose() : router.back();
            !router.pathname.includes("/expert/questions")
              ? await questionListCrud?.loadAll(true)
              : await loadAll();

            setMode({ ...mode, TOPIC_AND_PLANT: true });
          } catch (error) {
            console.log(error);
            toast.error("Tạo câu hỏi không thành công", error?.message);
          }
        }
      }}
      dialog
      grid
      {...props}
    >
      {screenLg && (
        <div className="flex items-start justify-between col-span-12 mb-8">
          <div className="text-3xl font-extrabold text-accent">
            {question ? "Chỉnh sửa câu hỏi" : "Tạo câu hỏi"}
          </div>
          <Button
            icon={<RiCloseLine />}
            iconClassName="font-extrabold text-3xl text-neutralGrey"
            className="px-0"
            onClick={props.onClose}
            unfocusable
          />
        </div>
      )}

      {mode?.TOPIC_AND_PLANT && (
        // <QuestionFormTopic
        //   onSelectedTopic={(val) =>
        //     !!val && setMode({ TOPIC: false, PLANT: true, QUESTION: true })
        //   }
        // />
        <QuestionFormTopicAndPlant
          questionTopics={questionTopics}
          plants={plants}
          onSelectedTopicAndPlant={() => setMode({ TOPIC_AND_PLANT: false, QUESTION: true })}
        />
      )}

      {mode?.QUESTION && (
        <div className="grid col-span-12 gap-2">
          <FieldSelectTopicAndPlant questionTopics={questionTopics} plants={plants} />

          <Field
            name="title"
            className="pr-3 "
            label="Nội dung câu hỏi"
            cols={12}
            required
            {...labelAccentField}
          >
            <Textarea
              placeholder="Vui lòng nhập nội dung"
              className="p-[18px] shadow-sm resize-none border-gray-300"
              rows={3}
            />
          </Field>

          <ImageUploadField
            maxImage={5}
            label="Hình ảnh đính kèm"
            accept="image/*"
            name="images"
            defaultValue={question?.images}
          />
          {/* <FileUploadField
            label="Video đính kèm"
            accept="video/*"
            icon={<RiVideoUploadLine />}
            subText="Tải lên tệp video"
            iconClassName="text-4xl"
            cols={screenLg ? 6 : 12}
          />
          <FileUploadField
            label="Âm thanh đính kèm"
            accept="audio/*"
            icon={<GiSoundWaves />}
            subText="Tải lên tệp âm thanh"
            iconClassName="text-4xl"
            cols={screenLg ? 6 : 12}
          /> */}
          <div className="col-span-12 mt-2 mb-8">
            <div className="flex items-baseline">
              <span className="mr-5 text-base font-extrabold text-accent min-w-max">
                THÔNG TIN CANH TÁC
              </span>
              <hr className="w-full" />
            </div>
          </div>

          <AddressGroup
            provinceCols={screenLg ? 4 : 12}
            districtCols={screenLg ? 4 : 12}
            wardCols={screenLg ? 4 : 12}
            provinceLabel="Tỉnh/thành canh tác"
            districtLabel="Quận/huyện canh tác"
            wardLabel="Phường/xã canh tác"
            openAddress={false}
            selectClass="shadow-sm border-gray-300"
            labelClassName="text-accent font-extrabold text-sm"
            provinceName="address.provinceId"
            districtName="address.districtId"
            wardName="address.wardId"
            addressName="address.houseNumber"
          />

          <Field
            label="Diện tích canh tác"
            cols={screenLg ? 6 : 12}
            name="cultivatedArea"
            {...labelAccentField}
          >
            <Input number placeholder="0" suffix="ha" className="border-gray-300 shadow-sm" />
          </Field>
          <Field
            label="Sản lượng dự kiến"
            cols={screenLg ? 6 : 12}
            name="expectedOutput"
            {...labelAccentField}
          >
            <Input placeholder="0" className="border-gray-300 shadow-sm" />
          </Field>

          <div className="flex flex-row items-center col-span-12 gap-x-12">
            <TextRequired />
            <Form.Footer
              submitText={
                question || router.pathname.includes("/questions/edit")
                  ? "Lưu thay đổi"
                  : "Tạo câu hỏi"
              }
              cancelText={screenLg ? "Hủy" : ""}
              submitProps={{
                className: "shadow-md h-12",
              }}
            />
          </div>
        </div>
      )}
    </Form>
  );
}

export interface FileUploadFieldProps {
  name?: string;
  maxSize?: number;
  label?: string;
  accept?: string;
  icon?: JSX.Element;
  iconClassName?: string;
  subText?: string;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
}

export function FileUploadField({
  name,
  maxSize = 25,
  iconClassName = "",
  ...props
}: FileUploadFieldProps) {
  const { register, setValue } = useFormContext();
  const ref: MutableRefObject<HTMLInputElement> = useRef();
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const screenLg = useScreen("lg");

  register(name);
  const isValidFile = (size?: number, type?: string): boolean => {
    if (size / (1024 * 1024) > maxSize) {
      toast.info(`kích thước file hiện tại vượt quá ${maxSize}MB`);
      return false;
    }
    return true;
  };
  const onAddFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    if (!isValidFile(file?.size)) return;

    try {
      setLoading(true);
      setTimeout(() => {
        setFile(file);
        setValue(name, file.name);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(`Upload file thất bại. Xin thử lại.`);
    } finally {
      e.target.value = "";
    }
  };
  return (
    <div className={`col-span-${props.cols} mb-6`}>
      {props.label && <LabelAccent text={props.label} />}
      <div className="flex items-center justify-between w-full p-2 border-2 border-dotted rounded-md">
        <div className="flex items-center">
          {file && !loading ? (
            name === "video" ? (
              <Img
                default="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYtfZRhbGQtq2BapB2MXJfWIO2QriO5Wx3qQ&usqp=CAU"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYtfZRhbGQtq2BapB2MXJfWIO2QriO5Wx3qQ&usqp=CAU"
                className="relative object-cover w-20 cursor-pointer"
                showImageOnClick
                ratio169
                rounded
                lazyload
              >
                <Img
                  src="assets/img/play-video.png"
                  className="absolute w-6 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 tranform"
                />
              </Img>
            ) : (
              <i className={`bg-primary-light text-primary py-1 px-5 rounded-md ${iconClassName}`}>
                {props.icon}
              </i>
            )
          ) : loading ? (
            <Spinner className="py-0" />
          ) : (
            <i className={`transition-none mr-3 text-accent-dark pl-0 ${iconClassName}`}>
              {props.icon}
            </i>
          )}

          <div className="flex flex-col ml-2 cursor-pointer" onClick={() => ref.current?.click()}>
            <span className="font-bold lg:text-base text-sm max-w-fit text-ellipsis-1 lg:w-[200px] w-[130px]">
              {file ? file.name : props.subText}
            </span>
            <span className="text-xs lg:text-sm">
              {file ? (file.size / (1024 * 1024)).toFixed(1) : `Tối đa ${maxSize}`}MB
            </span>
          </div>
        </div>
        <Button
          unfocusable
          text={file ? "Xóa" : "Tải lên"}
          className={`px-0 underline ${!screenLg && "text-sm"}`}
          {...(file
            ? {
                onClick: () => {
                  setFile(null);
                  setValue(name, "");
                },
              }
            : { onClick: () => ref.current?.click() })}
        />
        <input hidden type="file" accept={props.accept} ref={ref} onChange={onAddFiles} />
      </div>
    </div>
  );
}

// export function SelectPlantAndDisease({
//   questionDetails,
//   ...props
// }: {
//   questionDetails?: Question;
// }) {
//   const screenLg = useScreen("lg");
//   const { setValue } = useFormContext();
//   const [plantFilter, setPlantFilter] = useState<any>();
//   const [diseaseFilter, setDiseaseFilter] = useState<any>();

//   const choosePlant = (plantId = null) => {
//     let obj = {};
//     if (plantId != null) {
//       obj["plantIds"] = plantId;
//     } else {
//       obj = {};
//     }
//     setDiseaseFilter(obj);
//   };

//   const chooseDisease = (plantIds = null) => {
//     let obj = {};
//     if (plantIds != null) {
//       obj["_id"] = plantIds;
//     } else {
//       obj = {};
//     }
//     setPlantFilter(obj);
//   };

//   const diseaseCurd = useCrud(
//     DiseaseService,
//     {
//       limit: 1000,
//       filter: { ...diseaseFilter },
//     },
//     { fetchingCondition: !!diseaseFilter }
//   );

//   const plantCurd = useCrud(
//     PlantService,
//     {
//       limit: 1000,
//       filter: { ...plantFilter },
//     },
//     { fetchingCondition: !!plantFilter }
//   );

//   useEffect(() => {
//     if (questionDetails?.id) {
//       choosePlant(questionDetails?.plantId);
//       chooseDisease(questionDetails?.disease?.plantIds);
//     } else {
//       choosePlant();
//       chooseDisease();
//     }
//   }, []);

//   useEffect(() => {
//     if (plantFilter && plantFilter != questionDetails?.plantId) {
//       if (!diseaseFilter) {
//         setValue("diseaseId", undefined);
//       }
//     }
//   }, [plantFilter]);

//   return (
//     <>
//       <Field
//         label="Chọn loại cây"
//         cols={screenLg ? 6 : 12}
//         name="plantId"
//         required
//         {...labelAccentField}
//       >
//         <Select
//           placeholder="Vui lòng chọn loại cây"
//           className="border-gray-300 shadow-sm"
//           options={plantCurd?.items?.map((item) => ({ value: item.id, label: item.name }))}
//           onChange={(id, options) => {
//             console.log("plantId", options?.value ?? null);

//             choosePlant(options?.value ?? null);
//           }}
//           clearable
//         />
//       </Field>
//       <Field label="Chọn loại bệnh" cols={screenLg ? 6 : 12} name="diseaseId" {...labelAccentField}>
//         <Select
//           placeholder="Vui lòng chọn loại bệnh"
//           className="border-gray-300 shadow-sm"
//           options={diseaseCurd?.items?.map((item) => ({
//             value: item.id,
//             label: item.name,
//             planIds: item.plantIds,
//           }))}
//           onChange={(id, options) => {
//             console.log("diseaseId", options?.plantIds);

//             chooseDisease(options?.planIds ?? null);
//           }}
//           clearable
//         />
//       </Field>
//     </>
//   );
// }

export function FieldSelectTopicAndPlant({
  questionTopics,
  plants,
  ...props
}: {
  questionTopics: QuestionTopic[];
  plants: Plant[];
}) {
  const { getValues, register, setValue } = useFormContext();
  register("questionTopicId");
  register("plantId");
  const { isMobile } = useDevice();

  const getOnePlant = (plantId: string) => {
    if (!plantId) return;
    const plant = plants.find((x) => x.id === plantId);
    return !plant
      ? {}
      : {
          image: plant.image,
          name: plant.name,
        };
  };

  return (
    <div className="flex flex-row flex-wrap col-span-12 items-center ">
      {!plants || !questionTopics ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-6 border-[3px] rounded border-transparent focus-within:border-primary lg:flex-1 lg:grow-0 lg:basis-1/2 h-fit lg:mb-0 lg:mr-2 ">
            <div className="flex flex-row items-center border -m-[2px]  border-transparent rounded lg:bg-transparent bg-gray-300 focus-within:bg-transparent">
              <div className="z-20 flex flex-row items-center shadow-sm justify-center px-2 py-2 font-normal text-gray-600 bg-gray-300  rounded-l select-none h-fit ">
                Chủ đề
              </div>
              <Select
                native={isMobile}
                options={questionTopics.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues().questionTopicId ? getValues().questionTopicId : ""}
                onChange={(questionTopicId) => setValue("questionTopicId", questionTopicId)}
                controlClassName="form-control !border-transparent !focus-within:border-transparent rounded-l-none z-10"
                className="flex-1 w-auto lg:bg-gray-200  lg:border-transparent shadow-sm"
              />
            </div>
          </div>
          <div className="lg:basis-1/4 shadow-sm">
            <Select
              hasImage
              value={getValues().plantId ? getValues().plantId : ""}
              native={isMobile}
              options={plants.map((item) => ({
                value: item.id,
                label: item.name,
                image: item.image,
              }))}
              className="h-[38px] pl-1 border-gray-200 "
            />
          </div>
        </>
      )}
    </div>
  );
}
