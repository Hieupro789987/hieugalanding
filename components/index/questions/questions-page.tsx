import { useScreen } from "../../../lib/hooks/useScreen";
import { ProductAds } from "../../shared/common/product-ads";
import { BreadCrumbs } from "../../shared/utilities/misc";
import { QuestionList } from "./components/question-list";
import { QuestionsFilters } from "./components/questions-filters";
import { QuestionsProvider } from "../../shared/question/providers/questions-provider";

export function QuestionsPage() {
  const screenLg = useScreen("lg");

  return (
    <QuestionsProvider>
      <div className="flex-1 bg-gray-100">
        <div className={`flex-1 text-accent pt-5 lg:pb-20 ${screenLg && "main-container"}`}>
          <div className="pb-4 lg:pb-7 px-2.5 lg:px-0">
            <BreadCrumbs breadcrumbs={[{ label: "Trang chủ", href: `/` }, { label: "Hỏi đáp" }]} />
          </div>
          <div className={`flex lg:flex-row flex-col justify-between items-start gap-4 lg:gap-8`}>
            <QuestionsFilters />
            <QuestionList />
            {screenLg && <div className="w-60 grow-0 shrink-0" />}
          </div>
        </div>
      </div>
    </QuestionsProvider>
  );
}
