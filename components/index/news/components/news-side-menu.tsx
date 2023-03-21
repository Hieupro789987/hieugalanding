import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { convertIcon } from "../../../shared/common/convert-icon";
import { TopicMenu } from "../../../shared/common/side-menu";
import { Spinner } from "../../../shared/utilities/misc";

export function NewsSideMenu({
  title,
  menuItems,
  className = "",
  ...props
}: ReactProps & {
  menuItems: TopicMenu[];
  title: string;
}) {
  const screenLg = useScreen("lg");

  return (
    <div
      className={`flex flex-col flex-0 shrink-0 lg:w-80 grow-0 w-full lg:bg-transparent bg-white lg:shadow-none shadow-sm ${className}`}
    >
      {screenLg && <div className="pl-2 mb-5 text-3xl font-bold">{title}</div>}
      {!menuItems ? (
        <></>
      ) : !menuItems.length ? (
        <Spinner />
      ) : (
        <div className={"flex-cols gap-1"}>
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps extends ReactProps {
  item: TopicMenu;
}

function MenuItem({ item, ...props }: MenuItemProps) {
  const router = useRouter();

  const isSelected = useMemo(() => {
    // Chọn menu đầu
    if (!item.slug) {
      return item.href === router.asPath.split("?")[0];
    }

    // Chọn các menu khác
    return item.slug === router.asPath.split("/")[2]?.split("?")[0];
  }, [router.asPath, item]);

  return (
    <Link href={item.href} >
      <a>
        <div
          className={`flex flex-1 h-full min-h-12 rounded-sm items-center px-2 py-1 cursor-pointer ${
            isSelected
              ? "bg-primary text-white lg:hover:text-white"
              : "lg:hover:text-primary lg:hover:brightness-90"
          }`}
        >
          {item.slug ? (
            <i className="text-2xl">{convertIcon(item.image)}</i>
          ) : (
            <i className="text-2xl">{convertIcon(!item.isVideo ? "allNews" : "allVideos")}</i>
          )}
          <div className="flex-1 pl-2 font-semibold break-words">{item.title}</div>
        </div>
      </a>
    </Link>
  );
}
