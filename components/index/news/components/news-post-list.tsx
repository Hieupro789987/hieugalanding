import { useScreen } from "../../../../lib/hooks/useScreen";
import { NewsCard } from "../../../shared/common/news-card";
import { SearchNotFound } from "../../../shared/common/search-not-found";
import { Button } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";
import { PaginationRound } from "../../../shared/utilities/pagination/pagination-round";
import { useNewsContext } from "../providers/news-provider";

export function NewsPostList() {
  const screenLg = useScreen("lg");
  const { newsPostListCrud, parentTopic } = useNewsContext();

  if (!newsPostListCrud.items || newsPostListCrud.loading) return <Spinner />;
  if (newsPostListCrud.items.length === 0)
    // return <NotFound text="Không tìm thấy bài đăng." className="mt-20 mb-24 lg:mb-0" />;
    return <SearchNotFound type="bài đăng"/>
    

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 lg:gap-4 lg:grid-cols-4 auto-rows-fr">
        {newsPostListCrud.items.map((post) => (
          <NewsCard
            key={post.id}
            item={{
              title: post.title,
              href: `/${parentTopic?.slug}/${post.topic?.slug}/${post.slug}`,
              image: post.featureImage,
              desc: post.excerpt,
              date: post.createdAt,
            }}
          />
        ))}
      </div>
      <div className="flex justify-center w-full mt-3 mb-5 lg:mt-5 lg:mb-0 lg:justify-end">
        {screenLg ? (
          <PaginationRound
            limit={newsPostListCrud.pagination.limit}
            page={newsPostListCrud.page}
            total={newsPostListCrud.pagination.total}
            onPageChange={(page: number) => newsPostListCrud.setPage(page)}
          />
        ) : (
          <>
            {newsPostListCrud.hasMore && (
              <Button
                text="Xem thêm"
                textPrimary
                isLoading={newsPostListCrud.loadingMore}
                onClick={() => newsPostListCrud.loadMore()}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
