import { useScreen } from "../../../lib/hooks/useScreen";
import { NewsFiltersDesktop } from "./components/news-filters-desktop";
import { NewsFiltersWebapp } from "./components/news-filters-webapp";
import { NewsLayout } from "./components/news-layout";
import { NewsPostDetails } from "./components/news-post-details";
import { NewsPostList } from "./components/news-post-list";
import { NewsTopicMenu } from "./components/news-topic-menu";
import { NewsVideoList } from "./components/news-video-list";
import { useNewsContext } from "./providers/news-provider";

interface NewsPageProps extends ReactProps {
  newsSlug: string;
  isVideosPage?: boolean;
}

export function NewsPage({ newsSlug, isVideosPage = false, ...props }: NewsPageProps) {
  return (
    <NewsLayout newsSlug={newsSlug} isVideosPage={isVideosPage}>
      <NewsContent />
    </NewsLayout>
  );
}

function NewsContent() {
  const screenLg = useScreen("lg");
  const { post, isVideosPage } = useNewsContext();

  return (
    <>
      {!screenLg ? <NewsFiltersWebapp /> : <NewsTopicMenu />}
      <div className="flex-1 w-full lg:w-auto">
        {!post?.id && screenLg && <NewsFiltersDesktop />}
        {!isVideosPage ? (
          <>{post?.id ? <NewsPostDetails /> : <NewsPostList />}</>
        ) : (
          <NewsVideoList />
        )}
      </div>
    </>
  );
}
