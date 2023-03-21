import { formatDate } from "../../../../lib/helpers/parser";
import { NotFound, Spinner } from "../../../shared/utilities/misc";
import { useNewsContext } from "../providers/news-provider";

export function NewsPostDetails() {
  const { post } = useNewsContext();

  if (post === undefined) return <Spinner />;
  if (post === null) return <NotFound text="Không tìm thấy nội dung" />;

  return (
    <div className="flex-1 px-2.5 pt-2 mb-4 bg-white lg:pt-4 pb-6 lg:px-4 md:px-8 text-accent rounded lg:shadow-sm">
      <div className="mb-3 text-xl font-bold leading-7 lg:text-3xl lg:leading-10 text-accent">
        {post.title}
      </div>
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-3 lg:mb-5">
          {post.tags.map((tag, index) => (
            <div
              className={`px-4 font-medium py-1 rounded-md border border-gray-100 bg-primary-light text-primary-dark`}
              key={index}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
      <div
        className="ck-content"
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      ></div>
      <div className="text-sm italic text-right">{formatDate(post.postedAt, "dd/MM/yyyy")}</div>
      {!!post.source && (
        <div className="text-sm text-right lg:text-base">
          Nguồn: <span className="font-semibold">{post.source}</span>
        </div>
      )}
    </div>
  );
}
