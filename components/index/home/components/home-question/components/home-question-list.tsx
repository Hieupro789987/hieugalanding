import { LegacyRef } from "react";
import { useScreen } from "../../../../../../lib/hooks/useScreen";
import { Question } from "../../../../../../lib/repo/question/question.repo";
import { Button } from "../../../../../shared/utilities/form";
import { HomeQuestionItem } from "./home-question-item";

export function HomeQuestionList({
  questions,
  heightRef,
  ...props
}: {
  questions: Question[];
  heightRef?: LegacyRef<HTMLDivElement>;
}) {
  const isLg = useScreen("lg");
  return (
    <div
      className="p-3 bg-white rounded-sm lg:p-0 lg:shadow-sm shrink-0 flex-1 lg:w-auto w-full"
      ref={heightRef}
    >
      {questions.map((question, index) => (
        <HomeQuestionItem
          question={question}
          key={question.id}
          className={`${index !== questions.length - 1 && "border-b border-b-gray-200"}`}
        />
      ))}
      {isLg && (
        <div className="flex flex-row justify-end w-full p-3 border-t border-t-gray-200">
          <Button
            text="Xem thêm"
            href={"/questions"}
            className="px-1 text-sm text-primary md:text-base"
          />
        </div>
      )}
    </div>
  );
}
