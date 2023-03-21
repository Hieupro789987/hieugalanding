import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { RiArrowDownSLine, RiSearchLine } from "react-icons/ri";
import { convertIcon } from "../../../shared/common/convert-icon";
import { SearchInput } from "../../../shared/common/search-input";
import { Button } from "../../../shared/utilities/form";
import { Dropdown } from "../../../shared/utilities/popover/dropdown";
import { useNewsContext } from "../providers/news-provider";
import { AreaList } from "./news-filters-desktop";
import { NewsPageTab } from "./news-page-tab";
import { NewsSearchResult } from "./news-search-result";

interface NewsFiltersWebappProps extends ReactProps {}

export function NewsFiltersWebapp({ ...props }: NewsFiltersWebappProps) {
  const router = useRouter();
  const { query } = router;
  const menuRef = useRef(null);
  const { post, topicMenu, videoMenu, isVideosPage, parentTopic } = useNewsContext();
  const [openSearchInput, setOpenSearchInput] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState("");

  const isAllTopicPage = !query?.topicSlug || query?.topicSlug === "all";

  const selectedTopic = useMemo(() => {
    const selectedTopic = isVideosPage
      ? videoMenu.find((menu) => menu.slug === query?.topicSlug)
      : topicMenu.find((menu) => menu.slug === query?.topicSlug);

    return selectedTopic;
  }, [query, topicMenu, videoMenu, isVideosPage]);

  const handleSearchInputChange = (val: string) => {
    setSearchInputValue(val);
  };

  const handleSearchInput = () => {
    if (searchInputValue) {
      return;
    }

    setOpenSearchInput(false);
  };

  return (
    <>
      <NewsPageTab />
      <div className="flex flex-row items-center justify-between w-full">
        {openSearchInput ? (
          <div className="w-full my-1">
            <SearchInput
              onValueChange={handleSearchInputChange}
              onClear={() => setOpenSearchInput(false)}
              onBlur={handleSearchInput}
            />
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1 ml-0.5" ref={menuRef}>
              <i className="text-lg">
                {selectedTopic
                  ? convertIcon(selectedTopic.image)
                  : convertIcon(isVideosPage ? "allVideos" : "allNews")}
              </i>
              <div className="font-bold">{selectedTopic?.title || "Tất cả"}</div>
              <i className="text-2xl text-gray-400">
                <RiArrowDownSLine />
              </i>
            </div>
            {!post?.id && (
              <Button
                icon={<RiSearchLine />}
                iconClassName="text-2xl"
                onClick={() => {
                  setOpenSearchInput(true);
                }}
              />
            )}
            <Dropdown reference={menuRef}>
              <Dropdown.Item
                icon={convertIcon(isVideosPage ? "allVideos" : "allNews")}
                iconClassName="mr-2"
                className={`justify-start ${isAllTopicPage && "opacity-50"}`}
                onClick={() => {
                  if (isAllTopicPage) return;

                  router.push(
                    {
                      pathname: isVideosPage ? "/videos" : `/${parentTopic?.slug}`,
                    },
                    undefined,
                    { scroll: false }
                  );
                }}
              >
                Tất cả
              </Dropdown.Item>
              {!isVideosPage &&
                topicMenu.map((topic, index) => (
                  <Dropdown.Item
                    key={index}
                    icon={convertIcon(topic.image)}
                    iconClassName="mr-2"
                    href={topic.href}
                    className={`justify-start ${topic.slug === query?.topicSlug && "opacity-50"}`}
                    onClick={() => {
                      if (topic.slug === query?.topicSlug) return;

                      router.push(
                        {
                          pathname: topic.href,
                        },
                        undefined,
                        { scroll: false }
                      );
                    }}
                  >
                    {topic.title}
                  </Dropdown.Item>
                ))}
              {isVideosPage &&
                videoMenu.map((topic, index) => (
                  <Dropdown.Item
                    key={index}
                    icon={convertIcon(topic.image)}
                    iconClassName="mr-2"
                    className={`justify-start ${topic.slug === query?.topicSlug && "opacity-50"}`}
                    onClick={() => {
                      if (topic.slug === query?.topicSlug) return;

                      router.push(
                        {
                          pathname: topic.href,
                        },
                        undefined,
                        { scroll: false }
                      );
                    }}
                  >
                    {topic.title}
                  </Dropdown.Item>
                ))}
            </Dropdown>
          </>
        )}
      </div>
      {!post?.id && <AreaList />}
      <NewsSearchResult />
    </>
  );
}
