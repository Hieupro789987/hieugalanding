import { useScreen } from "../../../../lib/hooks/useScreen";
import { SectionTitle } from "../../../shared/common/section-title";
import { Button } from "../../../shared/utilities/form";
import { Swiper, SwiperSlide } from "swiper/react";
import { Img, Spinner } from "../../../shared/utilities/misc";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { GraphService } from "../../../../lib/repo/graph.repo";
import { Post, PostService } from "../../../../lib/repo/post.repo";
import { YoutubeVideo, YoutubeVideoService } from "../../../../lib/repo/youtube-video.repo";
import { useEffect, useState } from "react";
import { ProductItem } from "../../../shared/common/product-item";
import { useRouter } from "next/router";
import Link from "next/link";
import { formatDate } from "../../../../lib/helpers/parser";
import { TopicService } from "../../../../lib/repo/topic.repo";
import { NewsCard } from "../../../shared/common/news-card";

export function HomeSeasonalInfo() {
  const screenSm = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");
  const [posts, setPosts] = useState<Post[]>();

  const getAllSeasonalInfo = async () => {
    try {
      const resTopics = await TopicService.getAll({
        query: { filter: { group: "thong-tin-mua-vu" } },
      });
      if (!resTopics) return;
      const res = await PostService.getAll({
        query: {
          limit: 0,
          order: { createdAt: -1 },
          filter: { topicId: { $in: resTopics.data.map((x) => x.id) } },
        },
      });

      setPosts(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllSeasonalInfo();
  }, []);

  if (!posts) return <Spinner />;
  if (posts.length <= 0) return <></>;

  return (
    <section className="main-container">
      <div className="flex flex-row items-center justify-between">
        <SectionTitle>Thông tin mùa vụ</SectionTitle>
        <Button
          text="Xem thêm"
          href={"/thong-tin-mua-vu"}
          className="px-1 text-sm text-primary md:text-base"
        />
      </div>
      <div className="mt-1">
        {!posts ? (
          <Spinner />
        ) : (
          <>
            <div className="grid grid-cols-2 grid-rows-2 gap-2 lg:grid-rows-1 lg:gap-5 lg:grid-cols-5">
              {posts.slice(0, screenLg ? 5 : 4).map((post, index) => (
                <NewsCard item={{
                  title: post.title,
                  date: post.createdAt,
                  desc: post.excerpt,
                  image: post.featureImage,
                  href: `/thong-tin-mua-vu/${post.topic.slug}/${post.slug}`
                }} key={post.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

