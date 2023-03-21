import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { Post, PostService } from "../../../../lib/repo/post.repo";

export function useGetPostData() {
  const postSlug = useQuery("postSlug");
  const [post, setPost] = useState<Post>();

  const getPostData = async () => {
    if (!postSlug) return;

    try {
      const res = await PostService.getAll({
        query: {
          limit: 1,
          filter: {
            slug: postSlug,
          },
        },
      });
      setPost(res.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPostData();
  }, [postSlug]);

  return post;
}
