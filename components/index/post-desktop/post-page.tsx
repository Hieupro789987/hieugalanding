import cloneDeep from "lodash/cloneDeep";
import { useEffect, useState } from "react";
import { useScreen } from "../../../lib/hooks/useScreen";
import { Post, PostService } from "../../../lib/repo/post.repo";
import { ShopsProvider } from "../shops/providers/shops-provider";
import { PostBanners } from "./components/post-banners";
import { PostContent } from "./components/post-content";
import { PostProductAds } from "./components/post-product-ads";

export function PostPage({ id, title, ...props }: ReactProps & { id: string; title: string }) {
  const screenLg = useScreen("lg");
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
    <ShopsProvider>
      <div className="flex-1 bg-gray-100 flex-cols">
        <section
          className={`flex flex-1 flex-row justify-between gap-8 lg:p-4 ${
            screenLg && "main-container"
          }`}
        >
          {screenLg && <PostBanners />}
          <PostContent post={post} title={title} />
          {screenLg && <PostProductAds />}
        </section>
      </div>
    </ShopsProvider>
  );
}
