import { useRouter } from "next/router";
import { useEffect } from "react";
import { useScreen } from "../../../lib/hooks/useScreen";
import { QuestionForm } from "../../shared/question/components/question-form/question-form";
import { BreadCrumbs } from "../../shared/utilities/misc";
import { QuestionDetailsProvider } from "../question-details/providers/question-details-provider";

export function QuestionsEditPage({ ...props }) {
  const screenLg = useScreen("lg");
  const { pathname, push, query } = useRouter();
  useEffect(() => {
    if (screenLg) {
      push("/questions");
    }
  }, [pathname, screenLg]);
  return (
    <QuestionDetailsProvider>
      <div className="bg-white">
        <div className="px-3 border-b boder-b-neutralGrey">
          <BreadCrumbs
            className="relative z-10 my-3"
            breadcrumbs={[
              { label: "Trang chủ", href: `/` },
              { label: "Hỏi đáp", href: "/questions" },
              { label: "Chỉnh sửa câu hỏi", href: "/questions" },
              { label: query.id as string },
            ]}
          />
        </div>
        <div className="py-5 ">
          <QuestionForm dialog={false} className="main-container" />
        </div>
      </div>
    </QuestionDetailsProvider>
  );
}
