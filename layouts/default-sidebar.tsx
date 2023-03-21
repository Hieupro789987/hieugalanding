import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { Button } from "../components/shared/utilities/form";
import { Accordion, Scrollbar } from "../components/shared/utilities/misc";
import { GetAppKey } from "../lib/graphql/auth.link";
import { DefaultFooter } from "./default-footer";

export interface SidebarMenu {
  title: string;
  subMenus: SidebarSubMenu[];
  isOpen?: boolean;
  hidden?: boolean;
  id?: string;
}

interface SidebarSubMenu {
  title: string;
  path: string;
  icon: JSX.Element;
  badge?: string | number;
  hidden?: boolean;
  id?: string;
}

interface Props extends ReactProps {
  name: string;
  menus: SidebarMenu[];
  top: number;
  widthClassName: string;
  closable?: boolean;
}
export default function DefaultSidebar({
  name,
  menus,
  top,
  widthClassName,
  closable,
  ...props
}: Props) {
  const router = useRouter();
  const sidebarStorage = GetAppKey() + "-sidebar-closed-menu";
  const [closedMenuObj, setClosedMenuObj] = useState<Object>(null);

  useEffect(() => {
    const closedMenuString = localStorage.getItem(sidebarStorage);
    if (closedMenuString) {
      setClosedMenuObj(JSON.parse(closedMenuString));
    } else {
      setClosedMenuObj({});
    }
  }, []);

  useEffect(() => {
    if (closedMenuObj) {
      localStorage.setItem(sidebarStorage, JSON.stringify(closedMenuObj));
    }
  }, [closedMenuObj]);

  const toggleMenu = (index) => {
    setClosedMenuObj({ ...closedMenuObj, [index]: !closedMenuObj[index] });
  };

  if (!closedMenuObj || !menus) return <></>;
  return (
    <>
      <div
        className={`fixed flex flex-col bg-white shadow top-14 ${widthClassName}`}
        style={{ top, height: `calc(100vh - ${top}px)` }}
      >
        <Scrollbar wrapperClassName="flex-1" hideTracksWhenNotNeeded autoHide innerClassName="py-3">
          {menus.map((menu, index) => (
            <div className="mb-2 group" key={index}>
              <div
                className={`flex px-5 py-2 ${closable ? "cursor-pointer" : ""}`}
                onClick={() => toggleMenu(index)}
              >
                <span className="flex-1 font-extrabold uppercase text-accent">{menu.title}</span>
                {closable && (
                  <i
                    className={`${
                      closedMenuObj[index] ? "" : "opacity-0"
                    } group-hover:opacity-100 text-lg text-accent group-hover:text-accent-dark self-center transition ${
                      closedMenuObj[index] ? "" : "rotate-180"
                    }`}
                  >
                    <RiArrowDownSLine />
                  </i>
                )}
              </div>
              <Accordion
                className="flex flex-col gap-1 px-4"
                isOpen={closable ? !closedMenuObj[index] : true}
              >
                {menu.subMenus.map((subMenu, index) => (
                  <Button
                    key={subMenu.title}
                    {...(router.pathname == subMenu.path ||
                    router.pathname.includes(`${subMenu.path}/`)
                      ? { light: true, primary: true }
                      : { hoverDarken: true })}
                    className={`w-full pl-3 pr-1.5 h-11 justify-start font-semibold ${
                      router.pathname.includes(subMenu.path) ? "" : "hover:bg-slate-light"
                    }`}
                    iconClassName="text-primary text-xl pr-2"
                    icon={subMenu.icon}
                    href={subMenu.path}
                    text={
                      <div className="flex items-center justify-start">
                        <span>{subMenu.title}</span>
                        {subMenu.badge && <Badge value={subMenu.badge} />}
                      </div>
                    }
                  ></Button>
                ))}
              </Accordion>
            </div>
          ))}
        </Scrollbar>
        <DefaultFooter className="border-t text-accent bg-gray-light" />
      </div>
    </>
  );
}

export function Badge({ value }) {
  return (
    <div
      className={`ml-1.5 bg-danger text-white rounded-full px-1 min-w-5 h-5 flex-center text-xs font-bold`}
    >
      {value}
    </div>
  );
}
