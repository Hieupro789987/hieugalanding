import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useCrud } from "../../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { GraphService } from "../../../../../lib/repo/graph.repo";
import {
  QuestionComment,
  QuestionCommentService,
} from "../../../../../lib/repo/question/question-comment.repo";
import { Question, QuestionService } from "../../../../../lib/repo/question/question.repo";
import { SectionTitle } from "../../../../shared/common/section-title";
import { Button } from "../../../../shared/utilities/form";
import { Spinner } from "../../../../shared/utilities/misc";

import { HomeQuestionDetail } from "./components/home-question-detail";
import { HomeQuestionList } from "./components/home-question-list";

export function HomeQuestion() {
  const isLg = useScreen("lg");
  const [questions, setQuestions] = useState<Array<Question[]>>();
  const [comment, setComment] = useState<QuestionComment>();
  const [height, setHeight] = useState(null);
  const elementRef = useRef(null);

  const getOneQuestionFeatured = async () => {
    try {
      GraphService.query({
        query: [
          QuestionService.getAllQuery({ query: { limit: 4, order: { commentCount: -1 } } }),
          QuestionService.getAllQuery({
            query: {
              limit: 1,
              order: { createdAt: -1, expertCommentedAt: -1 },
              filter: { isExpertCommented: true },
            },
          }),
          QuestionService.getAllQuery({
            query: {
              limit: 1,
              order: { createdAt: -1 },
            },
          }),
        ],
      }).then(async (res) => {
        if (!!res.data.g1.data[0]) {
          const resComment = await QuestionCommentService.getAll({
            query: {
              limit: 1,
              order: { createdAt: -1 },
              filter: { questionId: res.data.g1.data[0].id, globalCustomerId: null },
            },
          });
          setComment(resComment.data[0]);
          setQuestions([res.data.g0.data, res.data.g1.data]);
        } else {
          setQuestions([res.data.g0.data, res.data.g2.data]);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOneQuestionFeatured();
  }, []);

  const handleRect = useCallback(
    (node) => {
      if (!!node) {
        setHeight(node.getBoundingClientRect().height);
      }
    },
    [height]
  );

  if (!questions || !questions[0] || !questions[1]) return <Spinner />;
  if (questions.length <= 0 || questions[0].length <= 0) return <></>;

  return (
    <div className="main-container">
      <div className="flex flex-row items-center justify-between">
        <SectionTitle>Hỏi đáp</SectionTitle>
        {!isLg && (
          <Button
            text="Xem thêm"
            href={"/thong-tin-mua-vu"}
            className="px-1 text-sm text-primary md:text-base"
          />
        )}
      </div>
      {/* <div className={`mt-3 relative`}> */}
      <div className={`flex lg:flex-row flex-col gap-4 items-stretch mt-2`}>
        <HomeQuestionDetail questionFeatured={questions[1][0]} comment={comment} height={height} />
        <HomeQuestionList questions={questions[0]} heightRef={handleRect} />
      </div>
      {/* </div> */}
    </div>
  );
}
