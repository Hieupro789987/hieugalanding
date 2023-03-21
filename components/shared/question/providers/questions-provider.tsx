import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { Question, QuestionService } from "../../../../lib/repo/question/question.repo";

export const QuestionsContext = createContext<
  Partial<{
    questionListCrud: CrudProps<Question>;
    onFilterChange: (val: any) => void;
  }>
>({});

export function QuestionsProvider(props) {
  const router = useRouter();
  const { query } = router;
  const { globalCustomer } = useAuth();

  const getQueryParams = () => {
    return {
      search: query?.search,
      plantId: query?.plantId,
      questionTopicId: query?.questionTopicId,
      ownQuestion: query?.ownQuestion === "true",
      sortBy: query?.sortBy,
    };
  };

  const queryList = useMemo(() => getQueryParams(), [router.query]);

  const questionListCrud = useCrud(
    QuestionService,
    {
      order: {
        ...(queryList?.sortBy === "mostLike"
          ? { likeCount: -1 }
          : queryList?.sortBy === "mostComment"
          ? { commentCount: -1 }
          : { createdAt: -1 }),
      },
      search: queryList?.search as string,
      filter: {
        isHidden: false,
        ...(queryList?.plantId && { plantId: queryList?.plantId }),
        ...(queryList?.questionTopicId && { questionTopicId: queryList?.questionTopicId }),
        //Comment new authentication code
        // ...(ownQuestion && !!user?.id && { $or: [{ endUserId: endUser?.id }, { expertId: expert?.Id }] }),
        ...(queryList?.ownQuestion &&
          !!globalCustomer?.id && { globalCustomerId: globalCustomer?.id }),
      },
    },
    { cache: false, fetchingCondition: !!router }
  );

  useEffect(() => {
    const el = document.getElementById("header");

    if (el && !isEmpty(router.query)) el.scrollIntoView({ behavior: "smooth" });
  }, [router.query]);

  const handleFilterChange = (val: any) => {
    let newQueryList = { ...queryList };
    newQueryList = {
      ...newQueryList,
      ...val,
    };

    //filter keys have falsy value
    const filteredQueryList = {};
    Object.keys(newQueryList).forEach((key) => {
      if (newQueryList[key]) {
        filteredQueryList[key] = newQueryList[key];
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: filteredQueryList,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <QuestionsContext.Provider
      value={{
        questionListCrud,
        onFilterChange: handleFilterChange,
      }}
    >
      {props.children}
    </QuestionsContext.Provider>
  );
}

export const useQuestionsContext = () => useContext(QuestionsContext);
