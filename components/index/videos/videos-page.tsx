import { useScreen } from "../../../lib/hooks/useScreen";
import { Button } from "../../shared/utilities/form";
import { BreadCrumbs } from "../../shared/utilities/misc";
import { PaginationRound } from "../../shared/utilities/pagination/pagination-round";
import { VideoGroupList } from "./components/videos-group-list";
import { VideosList } from "./components/videos-list";
import { VideosContext, VideosProvider } from "./providers/videos-provider";

export function VideosPage({ id, title, ...props }: ReactProps & { id?: string; title?: string }) {
  const screenLg = useScreen("lg");

  return (
    <VideosProvider id={id}>
      <VideosContext.Consumer>
        {({ youtubeVideoCrud, youtubeVideoMobileCrud, breadCrumbs }) => (
          <div className="w-full pb-8 lg:pb-10">
            <div className={`flex-1 text-accent pt-5 lg:pb-16 main-container`}>
              <div className="pb-4 lg:pb-7">
                <BreadCrumbs breadcrumbs={breadCrumbs} />
              </div>
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:gap-8">
                <VideoGroupList />
                <div className="flex-1">
                  <VideosList
                    videos={screenLg ? youtubeVideoCrud.items : youtubeVideoMobileCrud.items}
                    title={title}
                  />
                  {screenLg ? (
                    <div className="flex justify-end w-full mt-5">
                      <PaginationRound
                        limit={12}
                        page={youtubeVideoCrud.page}
                        total={youtubeVideoCrud.total}
                        onPageChange={(page: number) => youtubeVideoCrud.setPage(page)}
                      />
                    </div>
                  ) : (
                    <div className="mt-5 flex-center">
                      {youtubeVideoMobileCrud.hasMore && (
                        <Button
                          text="Xem thêm"
                          textPrimary
                          isLoading={youtubeVideoMobileCrud.loadingMore}
                          onClick={() => youtubeVideoMobileCrud.loadMore()}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </VideosContext.Consumer>
    </VideosProvider>
  );
}
