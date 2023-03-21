import { useRouter } from "next/router";
import { useEffect } from "react";
import { useScreen } from "../../../lib/hooks/useScreen";
import { QuestionForm } from "../../shared/question/components/question-form/question-form";
import { BreadCrumbs } from "../../shared/utilities/misc";

export function QuestionsCreatePage({ ...props }) {
  const screenLg = useScreen("lg");
  const { pathname, push } = useRouter();
  useEffect(() => {
    if (screenLg) {
      push("/questions");
    }
  }, [pathname, screenLg]);
  return (
    <div className="bg-white">
      <div className="px-3 border-b boder-b-neutralGrey">
        <BreadCrumbs
          className="relative z-10 my-3"
          breadcrumbs={[
            { label: "Trang chủ", href: `/` },
            { label: "Hỏi đáp", href: "/questions" },
            { label: "Tạo câu hỏi" },
          ]}
        />
      </div>
      <div className="py-5 ">
        <QuestionForm dialog={false} grid className="main-container" />
      </div>
    </div>
  );
}
