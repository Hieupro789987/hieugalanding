import router from "next/router";
import { useEffect, useState } from "react";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { PostService } from "../../../../lib/repo/post.repo";
import { TopicService } from "../../../../lib/repo/topic.repo";
import { SideMenu } from "../../../shared/common/side-menu";

export function AboutUsPostList() {
  const slug = useQuery("slug");
  const [postMenu, setPostMenu] = useState([]);

  const getAboutUsTopicList = async () => {
    try {
      const aboutUsTopic = await TopicService.getAll({
        query: { limit: 0, filter: { slug: "gioi-thieu" } },
      });

      if (aboutUsTopic) {
        const res = await PostService.getAll({
          query: { filter: { topicId: aboutUsTopic.data[0].id } },
        });

        setPostMenu(
          res.data.map((item) => ({
            title: item.title,
            slug: item.slug,
            href: `/about-us/${item.slug}`,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAboutUsTopicList();
  }, []);

  useEffect(() => {
    if (!slug && postMenu?.length) router.replace(`/about-us/${postMenu[0].slug}`);
  }, [slug, postMenu]);

  return <SideMenu title="Giới thiệu" menuItems={postMenu} />;
}
