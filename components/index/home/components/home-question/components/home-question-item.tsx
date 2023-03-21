import { Question } from "../../../../../../lib/repo/question/question.repo";
import { Img } from "../../../../../shared/utilities/misc";
import { formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";
import { AiOutlineLike, AiOutlineMessage } from "react-icons/ai";
import Link from "next/link";
import { useScreen } from "../../../../../../lib/hooks/useScreen";

export function HomeQuestionItem({
  question,
  className = "",
  ...props
}: {
  question: Question;
  className: string;
}) {
  const isLg = useScreen("lg");
  return (
    <Link href={`/questions/${question.slug}`}>
      <a>
        <div className="lg:px-5 group">
          <div
            className={`flex lg:py-5 py-2 lg:flex-row flex-col justify-between ${
              isLg ? className : className + "-mx-3"
            }`}
          >
            <div className="w-full max-w-lg">
              <div className={`mb-2 font-semibold ${isLg ? "text-ellipsis-3" : "text-ellipsis-1"}`}>
                {question.title}
              </div>
              {!!question.globalCustomerId && (
                <HomeQuestionWho
                  avatar={question.globalCustomer.avatar}
                  name={question.globalCustomer.name}
                  date={question.createdAt}
                />
              )}
              {!!question.expertId && (
                <HomeQuestionWho
                  avatar={question.expert.avatar}
                  name={question.expert.name}
                  date={question.createdAt}
                />
              )}
            </div>
            <div className="pl-5 lg:border-l lg:border-l-gray-100 flex flex-row items-center mt-3 lg:pl-5 shrink-0 lg:justify-between gap-x-5">
              <div className="flex flex-row mr-3 gap-x-3 lg:mr-0">
                <li className="text-2xl list-none text-primary">
                  <AiOutlineLike />
                </li>
                <div className="font-bold text-gray-500">{question.likeCount}</div>
              </div>
              <div className="flex flex-row gap-x-3">
                <li className="text-2xl list-none text-primary">
                  <AiOutlineMessage />
                </li>
                <div className="font-bold text-gray-500">{question.commentCount}</div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}

export function HomeQuestionWho({
  avatar,
  name,
  date,
  ...props
}: {
  avatar: string;
  name: string;
  date?: string;
}) {
  return (
    <div className="flex flex-row items-center gap-x-1">
      <Img avatar className="w-6 h-6" src={avatar} />
      <div className="font-bold">{name}</div>
      {!!date && (
        <div className="font-normal">{`hỏi ${formatDistanceToNowStrict(
          new Date(date || new Date()),
          {
            locale: vi,
            addSuffix: true,
            roundingMethod: "ceil",
          }
        )}`}</div>
      )}
    </div>
  );
}
