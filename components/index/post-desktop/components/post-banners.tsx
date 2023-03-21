import Link from "next/link";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { BannerService } from "../../../../lib/repo/banner.repo";
import { Spinner } from "../../../shared/utilities/misc";
import { getBannerHref } from "../../home/components/home-banners";

export const PostBanners = () => {
  const { items, loading } = useCrud(BannerService, {
    limit: 3,
    filter: { position: "Post" },
    order: { priority: -1 },
  });

  if (!items || loading)
    return (
      <div className="w-60">
        <Spinner />
      </div>
    );
  if (items.length === 0) return <div className="w-60"></div>;

  return (
    <div className="flex flex-col grow-0 shrink-0 gap-6 w-60">
      {items.map((banner, index) => (
        <Link href={getBannerHref(banner)} key={index}>
          <a {...(banner.actionType == "WEBSITE" ? { target: "_blank" } : {})}>
            <img src={banner.image} alt={banner.title} className="shadow-sm" />
          </a>
        </Link>
      ))}
    </div>
  );
};
