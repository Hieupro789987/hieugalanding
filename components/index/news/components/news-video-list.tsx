import { useRouter } from "next/router";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { NewsCard } from "../../../shared/common/news-card";
import { VideoDialog } from "../../../shared/shop-layout/video-dialog";
import { Button } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";
import { PaginationRound } from "../../../shared/utilities/pagination/pagination-round";
import { useNewsContext } from "../providers/news-provider";

export function NewsVideoList() {
  const router = useRouter();
  const screenLg = useScreen("lg");
  const { newsVideoListCrud } = useNewsContext();

  if (!newsVideoListCrud.items || newsVideoListCrud.loading) return <Spinner />;
  if (newsVideoListCrud.items.length === 0)
    return <NotFound text="Không tìm thấy video." className="mt-20" />;

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5 lg:gap-4 lg:grid-cols-4 auto-rows-fr">
        {newsVideoListCrud.items.map((video) => (
          <NewsCard
            key={video.id}
            item={{
              title: video.title,
              href: router.query.hasOwnProperty("search")
                ? `${router.asPath}&videoId=${video.videoId}`
                : `${router.asPath}?videoId=${video.videoId}`,
              image: video.thumb,
              desc: video.description,
              date: video.published,
            }}
          />
        ))}
      </div>
      <div className="flex justify-center w-full mt-3 mb-5 lg:mt-5 lg:mb-0 lg:justify-end">
        {screenLg ? (
          <PaginationRound
            limit={newsVideoListCrud.pagination.limit}
            page={newsVideoListCrud.page}
            total={newsVideoListCrud.pagination.total}
            onPageChange={(page: number) => newsVideoListCrud.setPage(page)}
          />
        ) : (
          <>
            {newsVideoListCrud.hasMore && (
              <Button
                text="Xem thêm"
                textPrimary
                isLoading={newsVideoListCrud.loadingMore}
                onClick={() => newsVideoListCrud.loadMore()}
              />
            )}
          </>
        )}
      </div>
      <VideoDialog
        videoUrl={
          !!router.query?.videoId ? `https://www.youtube.com/watch?v=${router.query.videoId}` : ""
        }
        isOpen={!!router.query?.videoId}
        onClose={() => {
          const newQuery = { ...router.query };
          const { videoId, ...rest } = newQuery;

          router.push(
            {
              pathname: router.pathname,
              query: { ...rest },
            },
            undefined,
            { shallow: true }
          );
        }}
      />
    </>
  );
}
