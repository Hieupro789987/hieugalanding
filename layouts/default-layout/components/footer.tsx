import getConfig from "next/config";
import { useEffect, useState } from "react";
import { Button } from "../../../components/shared/utilities/form";
import { Img } from "../../../components/shared/utilities/misc";
import { useScreen } from "../../../lib/hooks/useScreen";
import { Post, PostService } from "../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../lib/repo/topic.repo";

const { publicRuntimeConfig } = getConfig();

export function Footer({ className, ...props }: ReactProps) {
  const screenLg = useScreen("lg");
  const [posts, setPosts] = useState<Post[]>([]);
  const [topic, setTopic] = useState<Topic>();

  useEffect(() => {
    TopicService.getAll({ query: { filter: { slug: "chung" } } }).then((res) => {
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

  if (!screenLg)
    return (
      <footer
        className={`w-full text-accent flex flex-col bg-white ${className} text-sm md:text-base`}
      >
        <div className="bg-accent">
          <div className="py-2 flex-cols main-container">
            {TOPIC_LIST.map((item, index) => (
              <Button
                key={index}
                targetBlank
                href={`/terms-of-service/${item.slug}`}
                text={item.title}
                className={`text-ellipsis-1 text-white font-normal text-xs sm:text-sm py-0.5`}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col px-4 pb-4 lg:px-0 lg:main-container">
          <Img src="/assets/img/logo.png" ratio169 contain className="w-32" />
          <div className="font-extrabold uppercase">Công ty GreenAgri</div>
          <div className="flex flex-col gap-2">
            <div className="mt-3 ">
              <span className="font-bold">Địa chỉ: </span>Thôn Sông Xoài 1, xã Láng Lớn, Châu Đức,
              Bà Rịa Vũng Tàu
            </div>
            <div className="">
              <span className="font-bold">Giấy CN ĐKDN số: </span>0315417534 do Sở Kế hoạch và Đầu
              tư Thành phố Hồ Chí Minh cấp ngày 03/12/2018
            </div>
            <div className="">
              <span className="font-bold">Email : </span> agritech@greengroups.com.vn
            </div>
          </div>
        </div>
        <div className="py-2 text-sm text-center bg-gray-200">{`GreenAgri © ${new Date().getFullYear()}${
          publicRuntimeConfig?.version ? " v" + publicRuntimeConfig?.version : ""
        }`}</div>
      </footer>
    );

  return (
    <>
      <footer className={`w-full text-accent ${className}`}>
        <div className="border-t-4 border-primary-dark"></div>
        <div className="py-6 bg-white">
          <div className="flex flex-row items-start justify-between main-container">
            <img src="/assets/img/logo.png" className="object-cover w-64 py-6" alt="logo" />
            <div className="flex flex-col w-1/4 pl-4">
              <span className="mt-3 text-lg font-extrabold text-accent">Công ty GreenAgri</span>
              <span className="mt-3 mb-2">
                <span className="font-bold">Địa chỉ: </span>
                Thôn Sông Xoài 1, xã Láng Lớn, Châu Đức, Bà Rịa Vũng Tàu
              </span>
              <span className="mb-2">
                <span className="font-bold">Giấy CN ĐKDN số: </span>0315417534 do Sở Kế hoạch và Đầu
                tư Thành phố Hồ Chí Minh cấp ngày 03/12/2018
              </span>
              <span className="mb-2">
                <span className="font-bold">Email: </span> agritech@greengroups.com.vn
              </span>
            </div>
            <div className="flex flex-col items-start justify-start pl-4">
              <div className="pl-5 mt-3 mb-1 text-lg font-extrabold text-accent">
                Hợp tác và liên kết
              </div>

              {posts.slice(5, posts.length).map((item) => (
                <Button
                  key={item.id}
                  targetBlank
                  href={`/post/${item.slug}`}
                  text={item.title}
                  className={`font-normal pb-1`}
                />
              ))}
            </div>

            <div className="flex flex-col items-start justify-start pl-4">
              <div className="pl-4 mt-3 mb-1 text-lg font-extrabold text-accent">Về GreenAgri</div>
              {posts.slice(0, 5).map((item, index) => (
                <Button
                  key={item.id}
                  targetBlank
                  href={`/post/${item.slug}`}
                  text={item.title}
                  className={`font-normal pb-1`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="py-2 text-sm text-center">{`GreenAgri © ${new Date().getFullYear()}${
          publicRuntimeConfig?.version ? " v" + publicRuntimeConfig?.version : ""
        }`}</div>
      </footer>
    </>
  );
}

const TOPIC_LIST = [
  { title: "Giải quyết khiếu nại", slug: "giai-quyet-khieu-nai" },
  { title: "Quy chế hoạt động website", slug: "quy-che-hoat-dong-website" },
  { title: "Quy chế hoạt động ứng dụng", slug: "quy-che-hoat-dong-ung-dung" },
  { title: "Điều khoản dịch vụ", slug: "dieu-khoan-dich-vu" },
];
