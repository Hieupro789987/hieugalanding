import { useRouter } from "next/router";
import { BreadCrumbs } from "../../../shared/utilities/misc";
import { HomeWeather } from "../../home/components/home-weather";
import { NewsContext, NewsProvider } from "../providers/news-provider";

interface NewsLayoutProps extends ReactProps {
  newsSlug: string;
  isVideosPage?: boolean;
}

export function NewsLayout({ newsSlug, isVideosPage = false, ...props }: NewsLayoutProps) {
  const router = useRouter();

  return (
    <NewsProvider newsSlug={newsSlug} isVideosPage={isVideosPage}>
      <div className={`flex-1 bg-gray-100`}>
        <NewsContext.Consumer>
          {({ breadCrumbs, post }) => (
            <div className={`flex-1 text-accent pt-5 lg:pb-16 main-container`}>
              <div className="pb-10 lg:pb-7">
                <BreadCrumbs breadcrumbs={breadCrumbs} />
              </div>
              {post?.id ||
              router.pathname.startsWith("/thong-tin-thi-truong") ||
              router.pathname.startsWith("/videos") ? (
                <></>
              ) : (
                <HomeWeather />
              )}
              <div
                className={`flex lg:flex-row flex-col justify-between items-start gap-2 lg:gap-6 mt-7 lg:mt-4`}
              >
                {props.children}
              </div>
            </div>
          )}
        </NewsContext.Consumer>
      </div>
    </NewsProvider>
  );
}
