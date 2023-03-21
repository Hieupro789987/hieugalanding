import Link from "next/link";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { SectionTitle } from "../../../shared/common/section-title";
import { Img } from "../../../shared/utilities/misc";

export function StoreDetailSupport({ ...props }) {
  const { shop } = useShopContext();

  return (
    <div className="flex-1 bg-white">
      <div className="flex flex-col gap-6 py-10 text-center main-container">
        <SectionTitle>Chúng tôi có thể giúp gì cho bạn? </SectionTitle>
        {shop.config.supportConfig.menu.map((item, index) => {
          if (item.url)
            return (
              <Link key={index} href={item.url}>
                <a className="w-full font-semibold text-center text-primary">
                  <i className="text-xl"></i>
                  <div className="flex-1">{item.label}</div>
                </a>
              </Link>
            );
        })}
        <div className="flex flex-col items-center w-full">
          {/* <Button text="Gửi mail hỗ trợ" primary className="mb-2 rounded-full" /> */}
          {shop.config.supportConfig.hotline && (
            <div className="flex flex-row items-center">
              <span className="mr-2 font-semibold text-accent">Hỗ trợ trực tiếp?</span>{" "}
              <Link href={`tel:${shop.config.supportConfig.hotline}`}>
                <a className="font-semibold text-primary">Gọi chúng tôi</a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
