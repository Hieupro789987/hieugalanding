import Link from "next/link";
import { FaChevronLeft } from "react-icons/fa";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { Button } from "../../shared/utilities/form/button";
import { Img } from "../../shared/utilities/misc";

export const SupportPage = () => {
  const { shopCode, shop } = useShopContext();
  return (
    <div className="flex flex-col items-center p-4 text-accent">
      <div className="flex items-center w-full py-1 mb-6">
        <Button
          icon={<FaChevronLeft />}
          iconClassName="text-xl text-gray-400"
          className="w-10 pl-0"
          tooltip={"Trang chủ"}
          href={`/store/${shopCode}`}
        />
        <h2 className="flex-1 text-lg font-semibold text-center">Hỗ trợ</h2>
        <div className="w-10"></div>
      </div>
      <Img src={shop.shopLogo} contain className="w-20" avatar />
      <span className="my-6 text-2xl font-medium">Chúng tôi có thể giúp bạn?</span>
      {shop.config.supportConfig.menu.map((item, index) => (
        <Link key={index} href={item.url}>
          <a className="w-full py-3 font-medium text-center border-b text-primary">{item.label}</a>
        </Link>
      ))}
      <div className="flex flex-col items-center w-full mt-6">
        {/* <Button text="Gửi mail hỗ trợ" primary className="mb-2 rounded-full" /> */}
        {shop.config.supportConfig.hotline && (
          <div>
            Hỗ trợ trực tiếp?{" "}
            <Link href={`tel:${shop.config.supportConfig.hotline}`}>
              <a className="text-primary">Gọi chúng tôi</a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
