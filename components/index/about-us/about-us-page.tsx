import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";
import { Post, PostService } from "../../../lib/repo/post.repo";
import { BreadCrumbs } from "../../shared/utilities/misc";
import { AboutUsContent } from "./components/about-us-content";
import { AboutUsPostList } from "./components/about-us-post-list";

export function AboutUsPage({ id, title, ...props }: ReactProps & { id?: string; title?: string }) {
  const [post, setPost] = useState<Post>(undefined);

  useEffect(() => {
    if (!id) return;
    PostService.getOne({ id })
      .then((res) => setPost(cloneDeep(res)))
      .catch((err) => {
        setPost(null);
      });
  }, [id]);

  return (
    <div className="flex-1 bg-white lg:bg-gray-100">
      <div className={`flex-1 text-accent pt-5 lg:pb-16 main-container`}>
        <div className="pb-4 lg:pb-7">
          <BreadCrumbs
            breadcrumbs={[
              { label: "Trang chủ", href: `/` },
              { label: "Giới thiệu", href: `/about-us` },
              { label: post?.title },
            ]}
          />
        </div>
        <div className={`flex lg:flex-row flex-col justify-between items-start gap-8 pb-20`}>
          <AboutUsPostList />
          <AboutUsContent post={post} title={title} />
        </div>
      </div>
    </div>
  );
}
