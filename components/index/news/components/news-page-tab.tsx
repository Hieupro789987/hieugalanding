import Link from "next/link";
import { useNewsContext } from "../providers/news-provider";

interface NewsPageTabProps extends ReactProps {}

export function NewsPageTab({ ...props }: NewsPageTabProps) {
  const { isVideosPage, parentTopic } = useNewsContext();

  return (
    <div className="flex items-center w-full gap-4 font-bold">
      <Link href={`/${parentTopic?.slug}`} scroll={false}>
        <a
          className={`flex-1 block h-12 whitespace-nowrap flex-center rounded transition-all ${
            !isVideosPage ? "bg-primary text-white" : "bg-gray-300"
          }`}
        >
          {parentTopic?.name}
        </a>
      </Link>
      {parentTopic?.slug === "thong-tin-mua-vu" && (
        <Link href={"/videos"} scroll={false}>
          <a
            className={`flex-1 block h-12 whitespace-nowrap flex-center rounded transition-all ${
              isVideosPage ? "bg-primary text-white" : "bg-gray-300"
            }`}
          >
            Video
          </a>
        </Link>
      )}
    </div>
  );
}
