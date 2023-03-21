import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineUser } from "react-icons/ai";
import { useAuth } from "../../../lib/providers/auth-provider";
import { Button } from "../../shared/utilities/form/button";
import { Img } from "../../shared/utilities/misc";
import { PROFILE_MENUS } from "./profile-page";

export function ProfileMenu({ selectedMenu, ...props }) {
  const { logoutGlobalCustomer, globalCustomer } = useAuth();
  const router = useRouter();

  return (
    <div className="w-64 h-full bg-white rounded-md grow-0 shrink-0">
      <div className="flex flex-row items-center px-3 py-5">
        <Img
          src={globalCustomer?.avatar ? globalCustomer?.avatar : "/assets/default/avatar.png"}
          className="object-cover w-16 rounded-full"
        />
        <div className="ml-4">
          <div className="text-base">Tài khoản của</div>
          <div className="text-lg font-bold leading-6 capitalize text-accent">
            {globalCustomer?.name && globalCustomer?.phone}
          </div>
        </div>
      </div>
      {PROFILE_MENUS.map((item, index) => {
        const selected = item.href == selectedMenu?.href;

        return (
          <Link href={item.href} key={index}>
            <a>
              <div
                className={`${selected ? "bg-primary-light" : ""} flex flex-row items-center py-4 `}
              >
                <span className="pl-3 mr-4 text-2xl text-primary"> {item.icon}</span>
                <span className="font-semibold text-accent">{item.label}</span>
              </div>
            </a>
          </Link>
        );
      })}
      <Button
        text="Đăng xuất"
        className="justify-start w-full font-semibold h-14 text-primary"
        onClick={() => {
          logoutGlobalCustomer();
          router.replace("/");
        }}
      />
    </div>
  );
}
