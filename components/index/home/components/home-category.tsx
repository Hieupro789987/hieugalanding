import React from "react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper/core";
import { CircleSwiper } from "../../../shared/common/circle-swiper";

SwiperCore.use([Pagination, Autoplay, Navigation]);

export function HomeCategory({ ...props }) {
  return (
    <div className="mt-5 main-container">
      <CircleSwiper
        items={GOGREEN_CATEGORIES.map((x) => ({
          image: x.img,
          name: x.title,
          href: x.href,
        }))}
      />
    </div>
  );
}

export const GOGREEN_CATEGORIES = [
  {
    img: "/assets/img/category/2.png",
    title: "Hệ Thống Đào Tạo",
    href: "http://gplearning.gpsmart.vn",
  },
  {
    img: "/assets/img/category/1.png",
    title: "Truy xuất nguồn gốc",
    href: "http://gptrace.gpsmart.vn",
  },
  {
    img: "/assets/img/category/3.png",
    title: "Xúc tiến thương mại",
    href: "http://gptrade.gpsmart.vn",
  },
  {
    img: "/assets/img/category/4.png",
    title: "Hội chợ triển lãm",
    href: "http://gpexhibition.gpsmart.vn",
  },
  {
    img: "/assets/img/category/5.png",
    title: "Giao nhận hàng hóa",
    href: "http://gpgo.gpsmart.vn",
  },
  {
    img: "/assets/img/category/6.png",
    title: "Truyền thông thương hiệu",
    href: "http://gpbrand.gpsmart.vn",
  },
  {
    img: "/assets/img/category/7.png",
    title: "Dịch vụ tư vấn",
    href: "http://gpservice.gpsmart.vn",
  },
  {
    img: "/assets/img/category/9.png",
    title: "Du học nghề",
    href: "http://gpedu.gpsmart.vn",
  },
  {
    img: "/assets/img/category/10.png",
    title: "Dịch vụ du lịch",
    href: "http://gpbooking.gpsmart.vn",
  },
  {
    img: "/assets/img/category/11.png",
    title: "Voucher hệ thống",
    href: "/",
  },
];
