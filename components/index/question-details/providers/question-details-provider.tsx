import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Question, QuestionService } from "../../../../lib/repo/question/question.repo";

export const QuestionDetailsContext = createContext<
  Partial<{
    question: Question;
    setQuestion: (question: Question) => void;
    getQuestionDetails: () => void;
  }>
>({});

export function QuestionDetailsProvider(props) {
  const router = useRouter();
  const slug = useQuery("slug");
  const [question, setQuestion] = useState<Question>();

  const getQuestionDetails = async () => {
    if (!slug) return;

    try {
      const questionData = await QuestionService.getAll({
        query: { filter: { slug: slug } },
      });

      if (questionData?.total === 0) {
        router.replace("/questions/question-not-found");
      }

      setQuestion(questionData.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQuestionDetails();
  }, [slug]);

  return (
    <QuestionDetailsContext.Provider
      value={{
        question,
        setQuestion,
        getQuestionDetails,
      }}
    >
      {props.children}
    </QuestionDetailsContext.Provider>
  );
}

export const useQuestionDetailsContext = () => useContext(QuestionDetailsContext);
