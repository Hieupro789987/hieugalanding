import { useRouter } from "next/router";
import { useNewsContext } from "../providers/news-provider";

interface NewsSearchResultProps {
  onValueChange?: (val: string) => void;
}

export function NewsSearchResult({ onValueChange, ...props }: NewsSearchResultProps) {
  const router = useRouter();
  const { query } = router;
  const { isVideosPage, newsVideoListCrud, newsPostListCrud } = useNewsContext();

  return (
    <>
      {isVideosPage && !!query?.search && !newsVideoListCrud.loading && (
        <div className="w-full text-sm lg:-mb-2.5 lg:mt-4 lg:text-base ">
          Hiển thị{" "}
          <span className="font-semibold">{`${newsVideoListCrud?.pagination?.total}`}</span> kết quả
          cho <span className="font-semibold">{`"${query?.search || ""}"`}</span>
        </div>
      )}

      {!isVideosPage && !!query?.search && !newsPostListCrud.loading && (
        <div className="w-full text-sm lg:-mb-2.5 lg:mt-4 lg:text-base ">
          Hiển thị <span className="font-semibold">{`${newsPostListCrud?.pagination?.total}`}</span>{" "}
          kết quả cho <span className="font-semibold">{`"${query?.search || ""}"`}</span>
        </div>
      )}
    </>
  );
}
