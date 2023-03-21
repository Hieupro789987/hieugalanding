import { useFormContext } from "react-hook-form";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { QuestionTopic } from "../../../../../../lib/repo/question/question-topic.repo";
import { Img, NotFound, Spinner } from "../../../../utilities/misc";

export function QuestionFormTopic({
  questionTopics,
  ...props
}: {
  questionTopics: QuestionTopic[];
}) {
  const { register, setValue, getValues } = useFormContext();
  register("questionTopicId");

  return (
    <>
      <div className="mb-4 font-bold text-center lg:text-2xl ">Chọn chủ đề bạn muốn hỏi?</div>
      <div className="flex flex-row flex-wrap justify-center -mx-2 lg:justify-start lg:mx-0 animate-emerge-up">
        {questionTopics?.length > 0 ? (
          questionTopics.map((item) => (
            <QuestionFormTopicItem
              topic={item}
              key={item.id}
              onClickChoose={(topicId) => setValue("questionTopicId", topicId)}
              selected={getValues().questionTopicId}
            />
          ))
        ) : (
          <NotFound text="Danh sách chủ đề trống" />
        )}
      </div>
    </>
  );
}

export function QuestionFormTopicItem({
  topic,
  selected,
  ...props
}: {
  topic: QuestionTopic;
  onClickChoose: (id: string) => void;
  selected: string;
}) {
  return (
    <div className="p-2 lg:p-1 lg:basis-1/5  lg:shrink-[1] basis-2/6">
      <div
        className={`p-3 pb-3 lg:p-5 h-full transition border border-gray-300 rounded-md shadow-sm cursor-pointer hover:border-primary hover:bg-primary-light hover:text-primary ${
          selected === topic.id ? "border-primary text-primary bg-primary-light" : ""
        }`}
        onClick={() => props.onClickChoose(topic.id)}
      >
        <Img src={topic.image} className="mx-auto shadow-sm w-14 h-14 lg:h-20 lg:w-20" />
        <div className="mt-3 text-sm font-medium text-center lg:text-base">{topic.name}</div>
      </div>
    </div>
  );
}
