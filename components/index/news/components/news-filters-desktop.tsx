import { useRouter } from "next/router";
import { useMemo } from "react";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { AreaService } from "../../../../lib/repo/area.repo";
import { SearchInput } from "../../../shared/common/search-input";
import { useNewsContext } from "../providers/news-provider";
import { NewsSearchResult } from "./news-search-result";

interface NewsFiltersDesktopProps extends ReactProps {}

export function NewsFiltersDesktop({ ...props }: NewsFiltersDesktopProps) {
  return (
    <div className="flex flex-col items-end mb-4">
      <SearchInput />
      <AreaList />
      <NewsSearchResult />
    </div>
  );
}

export function AreaList() {
  const { isVideosPage } = useNewsContext();
  const { items: areaList } = useCrud(AreaService, { order: { priority: -1 } });

  return (
    <>
      {!!areaList?.length && !isVideosPage && (
        <div className="flex flex-nowrap lg:flex-wrap items-center justify-between w-full gap-2 mb-2 overflow-x-scroll transition-all lg:mt-2.5 lg:mb-0 lg:gap-2.5 lg:justify-end whitespace-nowrap lg:whitespace-normal lg:overflow-auto no-scrollbar">
          <AreaItem name="Tất cả khu vực" slug="all" />
          {areaList.map((area) => (
            <AreaItem key={area.id} name={area.name} slug={area.slug} />
          ))}
        </div>
      )}
    </>
  );
}

interface AreaItemProps extends ReactProps {
  name: string;
  slug: string;
}

function AreaItem({ name, slug, ...props }: AreaItemProps) {
  const screenLg = useScreen("lg");
  const router = useRouter();

  const isSelected = useMemo(() => {
    return (
      router.query?.area === slug ||
      ((!router.query?.area || router.query?.area === "all") && slug === "all")
    );
  }, [router.query?.area, slug]);

  return (
    <div
      id={slug}
      className={`px-2.5 shadow-sm py-1.5 font-medium bg-white rounded cursor-pointer whitespace-nowrap border ${
        isSelected
          ? "bg-primary-light text-primary border-primary"
          : "lg:hover:bg-primary-light lg:hover:text-primary lg:hover:border-primary"
      }`}
      onClick={() => {
        router.push(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              area: slug,
            },
          },
          undefined,
          { shallow: true }
        );

        if (!screenLg) {
          const el = document.getElementById(slug);
          el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      }}
    >
      {name}
    </div>
  );
}
