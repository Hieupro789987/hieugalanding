import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { GraphService } from "../../../../../../lib/repo/graph.repo";
import { Plant, PlantService } from "../../../../../../lib/repo/plant.repo";
import {
  QuestionTopic,
  QuestionTopicService,
} from "../../../../../../lib/repo/question/question-topic.repo";
import { Button } from "../../../../utilities/form";
import { Img, Spinner } from "../../../../utilities/misc";
import { QuestionFormPlant } from "./question-form-plant";
import { QuestionFormTopic } from "./question-form-topic";

export function QuestionFormTopicAndPlant({
  questionTopics,
  plants,
  ...props
}: {
  questionTopics: QuestionTopic[];
  plants: Plant[];
  onSelectedTopicAndPlant: () => void;
}) {
  const { getValues } = useFormContext();

  return (
    <div className="col-span-12">
      {!questionTopics || !plants ? (
        <Spinner />
      ) : (
        <>
          <QuestionFormTopic questionTopics={questionTopics} />
          <QuestionFormPlant plants={plants} />
          <div className="w-full mb-5 text-center mt-7">
            <Button
              primary
              text="Tiếp tục"
              className={`h-14 px-16 ${
                !!getValues().questionTopicId && !!getValues().plantId
                  ? "shadow-md  shadow-green-700/50 "
                  : "!pointer-events-none !border-gray-300 !text-neutralGrey bg-transparent"
              }`}
              onClick={() => props.onSelectedTopicAndPlant()}
            />
          </div>
        </>
      )}
    </div>
  );
}
