import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { RiFileTextLine, RiQuestionnaireLine, RiUserLine } from "react-icons/ri";
import { Button } from "../../../components/shared/utilities/form/button";
import { Accordion } from "../../../components/shared/utilities/misc";
import { Footer } from "./footer";

interface PropsType extends ReactProps {}
export default function Sidebar({ ...props }: PropsType) {
  const [menus, setMenus] = useState<any[]>(SIDEBAR_MENUS);
  const router = useRouter();
  // const { pendingRegistrations, pendingGlobalColReg } = useExpertLayoutContext();

  const toggleMenu = (index) => {
    menus[index].isOpen = !menus[index].isOpen;
    setMenus([...menus]);
  };

  useEffect(() => {
    menus.forEach((menu) => {
      if (router.pathname.includes(menu.path)) menu.isOpen = true;
    });
    setMenus([...menus]);
  }, []);

  return (
    <>
      <div
        className="fixed flex flex-col bg-white shadow w-60 top-14"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <Scrollbars
          hideTracksWhenNotNeeded={true}
          autoHideTimeout={0}
          autoHideDuration={300}
          autoHide
        >
          <div className="py-3">
            {menus.map((menu, index) => (
              <div className="mb-2" key={index}>
                <div className="flex px-4 py-2 group" onClick={() => toggleMenu(index)}>
                  {/* <i className="w-5 h-5 text-lg text-primary group-hover:text-primary-dark">
                  {menu.icon}
                </i> */}
                  <span className="flex-1 px-2 font-semibold text-gray-700 uppercase">
                    {menu.title}
                  </span>
                  {/* <i
                  className={`text-lg text-gray-700 group-hover:text-primary self-center transform transition ${
                    menu.isOpen ? "rotate-180" : ""
                  }`}
                >
                  <RiArrowDownSLine />
                </i> */}
                </div>
                <Accordion isOpen={true}>
                  {menu.submenus.map((submenu, index) => (
                    <Button
                      key={index}
                      primary={
                        router.pathname == submenu.path ||
                        router.pathname.includes(`${submenu.path}/`)
                      }
                      className={`w-full pl-8 pr-0 justify-start font-normal rounded-none ${
                        router.pathname.includes(submenu.path) ? "" : "hover:bg-gray-100"
                      }`}
                      icon={submenu.icon}
                      href={submenu.path}
                      text={
                        <div className="flex items-center">
                          <span>{submenu.title}</span>
                          {/* {!!pendingRegistrations && submenu.showRegistrations && (
                            <BadgeShowNumberNoti numberNoti={pendingRegistrations} />
                          )}
                          {!!pendingGlobalColReg && submenu.showPendingGlobalColReg && (
                            <BadgeShowNumberNoti numberNoti={pendingGlobalColReg} />
                          )} */}
                        </div>
                      }
                    ></Button>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </Scrollbars>
        <Footer />
      </div>
    </>
  );
}

export const BadgeShowNumberNoti = ({ numberNoti }) => {
  return (
    <div
      className={`ml-1.5 bg-warning text-white rounded-full px-1 min-w-5 h-5 flex-center text-sm font-bold`}
    >
      {numberNoti || ""}
    </div>
  );
};

export const SIDEBAR_MENUS = [
  {
    title: "Danh mục",
    submenus: [
      {
        title: "Thông tin chuyên gia",
        path: "/expert/profile",
        icon: <RiUserLine />,
      },
      {
        title: "Câu hỏi",
        path: "/expert/questions",
        icon: <RiQuestionnaireLine />,
      },
      {
        title: "Lịch sử tương tác",
        path: "/expert/interaction-history",
        icon: <RiFileTextLine />,
      },
      // {
      //   title: "Tổng quan",
      //   path: "/expert/overview",
      //   icon: <RiStarLine />,
      // },
    ],
  },
];
