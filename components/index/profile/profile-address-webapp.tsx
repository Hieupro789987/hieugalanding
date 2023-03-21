import { address } from "faker";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  AddressBook,
  AddressBookService,
} from "../../../lib/repo/global-customer/address-book.repo";

import { Form, Field, Input } from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { BreadCrumbs } from "../../shared/utilities/misc";
import { AddressFormDialog } from "./components/profile-address";

export function ProfileAddressWebapp({ ...props }) {
  const router = useRouter();
  const [address, setAddress] = useState<AddressBook>();

  const getAdressDetails = () => {
    AddressBookService.getOne({ id: router?.query?.id as string }).then((res) => {
      setAddress(res);
    });
  };

  useEffect(() => {
    if (!!router?.query?.id) {
      getAdressDetails();
    }
  }, [router.query.id]);

  return (
    <>
      <div className="px-3 bg-white border-b boder-b-neutralGrey">
        <BreadCrumbs
          className="relative z-10 my-3"
          breadcrumbs={[
            {
              href: "/",
              label: "Trang chủ",
            },
            {
              href: "/profile",
              label: "Tài khoản",
            },
            {
              href: "/profile/address",
              label: "Danh sách địa chỉ",
            },
            {
              label: props.id ? "chi tiết địa chỉ" : "Tạo địa chỉ",
            },
          ]}
        />
      </div>
      <div className="bg-white">
        <AddressFormDialog
          address={address}
          loadAll={props.loadAll}
          width={350}
          headerClass="mx-5 pt-2 flex rounded-t bg-white border-b border-b-neutralLight"
          className="p-5"
        />
      </div>
    </>
  );
}
