import React, { useEffect, useState } from "react";
import { RiArticleLine, RiPagesLine, RiShieldCheckLine, RiSmartphoneLine } from "react-icons/ri";
import { Footer } from "../../../../layouts/default-layout/components/footer";
import { Post, PostService } from "../../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../../lib/repo/topic.repo";
import { Button } from "../../../shared/utilities/form/button";
interface PropsType extends ReactProps {}
export function ShopsFooter(props: PropsType) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [topic, setTopic] = useState<Topic>();

  useEffect(() => {
    TopicService.getAll({ query: { filter: { slug: "thong-tin-chinh-sach" } } }).then((res) => {
      if (res.data[0]) {
        setTopic(res.data[0]);
      }
    });
  }, []);
  useEffect(() => {
    if (topic) {
      PostService.getAll({
        query: { filter: { topicIds: topic.id } },
      })
        .then((res) => setPosts(res.data))
        .catch(console.error);
    }
  }, [topic]);
  return (
    <div className="mt-auto">
      <div className="mt-2 bg-white">
        <div className="mt-2 grid grid-cols-2 border-t-0.5 border-b-0.5 border-gray-200">
          {posts.map((item, index) => (
            <div className="border border-gray-200" key={item.id}>
              <Button
                targetBlank
                href={`/terms-of-service/${item.slug}`}
                icon={POST_ICONS[item.slug]}
                text={item.title}
                className={`text-ellipsis-1 text-xs sm:text-sm h-12`}
              />
            </div>
          ))}
        </div>
        <div className="flex p-4 text-sm text-gray-600 sm:text-base">
          <img src="assets/img/logo.png" className="w-12 sm:w-16 sm:h-16" />
          <div className="flex flex-col pl-4">
            <span className="text-lg font-extrabold">Công ty GreenAgri</span>
            <span>
              <span className="font-medium">Địa chỉ: </span>Số 234 Nguyễn Đình Chiểu, Phường Võ Thị
              Sáu, Quận 3, TP. Hồ Chí Minh
            </span>
            <span>
              <span className="font-medium">Giấy CN ĐKDN số: </span>0315417534 do Sở Kế hoạch và Đầu
              tư Thành phố Hồ Chí Minh cấp ngày 03/12/2018
            </span>
          </div>
        </div>
        <Footer className="py-2 text-sm text-center border-t border-gray-200" />
      </div>
    </div>
  );
}

const POST_ICONS = {
  "giai-quyet-khieu-nai": <RiArticleLine />,
  "quy-che-hoat-dong-website": <RiPagesLine />,
  "quy-che-hoat-dong-ung-dung": <RiSmartphoneLine />,
  "chinh-sach-bao-mat": <RiShieldCheckLine />,
};
