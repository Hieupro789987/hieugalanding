import { RiTimeLine } from "react-icons/ri";
import { formatDate } from "../../../../lib/helpers/parser";
import { Post } from "../../../../lib/repo/post.repo";
import { NotFound, Spinner } from "../../../shared/utilities/misc";

export function PostContent({ post, title, ...props }: ReactProps & { post: Post; title: string }) {
  if (post === undefined) return <Spinner />;
  if (post === null) return <NotFound text="Không tìm thấy nội dung" />;

  return (
    <div className="flex-1 px-4 py-4 bg-white md:px-8 text-accent lg:rounded lg:shadow-sm lg:p-8">
      <div className="mb-2 font-semibold leading-10 lg:mb-4 text-accent text-[28px]">{title}</div>
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
      <div className="flex text-sm text-center text-gray-500">
        <i className="text-base mt-0.5">
          <RiTimeLine />
        </i>
        <span className="ml-1">{formatDate(post.createdAt, "HH:mm dd/MM/yyyy")}</span>
      </div>

      <div
        className="ck-content"
        dangerouslySetInnerHTML={{
          __html: post.content,
        }}
      ></div>
    </div>
  );
}
