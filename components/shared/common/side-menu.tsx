import { Fragment } from "react";
import { useQuery } from "../../../lib/hooks/useQuery";
import { useScreen } from "../../../lib/hooks/useScreen";
import { Button } from "../utilities/form";
import { Spinner } from "../utilities/misc";

export interface TopicMenu {
  title: string;
  slug: string;
  href?: string;
  subMenu?: any;
  image?: string;
  isVideo?: boolean;
}

export function SideMenu({
  title,
  menuItems,
  className = "",
  ...props
}: ReactProps & {
  menuItems: TopicMenu[];
  title: string;
}) {
  const slug = useQuery("slug") || menuItems[0]?.slug;

  const screenLg = useScreen("lg");
  const openSubMenu = (item) => {
    if (!item?.subMenu) return false;

    const hasSubMenu = item.subMenu.some((menu) => menu.slug === slug);
    if (hasSubMenu) return true;

    return false;
  };

  return (
    <div
      className={`flex flex-col flex-0 shrink-0 lg:w-60 grow-0 w-full lg:bg-transparent bg-white lg:shadow-none shadow-sm  ${className}`}
    >
      {screenLg && <div className="pl-2 mb-5 text-3xl font-bold">{title}</div>}
      {!menuItems ? (
        <></>
      ) : !menuItems.length ? (
        <Spinner />
      ) : (
        <>
          {menuItems.map((item, index) => (
            <Fragment key={index}>
              {!!item.subMenu ? (
                <>
                  <Button
                    className={`justify-start h-auto px-2 py-3 break-all rounded-sm`}
                    href={item.href}
                    text={item.title}
                  />
                  {openSubMenu(item) && (
                    <div className="gap-3 ml-4 flex-cols">
                      {item.subMenu.map((menu) => (
                        <Button
                          primary={slug === menu.slug}
                          className={`justify-start h-auto px-2 py-3 break-all rounded-sm`}
                          href={menu.href}
                          text={menu.title}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Button
                  primary={slug === item.slug}
                  className={`justify-start h-auto px-2 py-3 break-all rounded-sm`}
                  href={item.href}
                  text={item.title}
                />
              )}
            </Fragment>
          ))}
        </>
      )}
    </div>
  );
}
