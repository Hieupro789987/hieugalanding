import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { LocationToolbar } from "../../../shared/location/location-toolbar";
import { Button } from "../../../shared/utilities/form/button";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { useShopsContext } from "../providers/shops-provider";
import { BrandHeader } from "./brand-header";
import { ShopsBanners } from "./shops-banners";

export function ShopsHeader() {
  const { search, listMode } = useShopsContext();

  return (
    <>
      <BrandHeader />
      <LocationToolbar />
      <div className="mt-2 bg-white shadow-sm">
        <Search />
      </div>
      {(!search || listMode) && <ShopsBanners />}
    </>
  );
}

function Search() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    setSearch(router.query["search"] as string);
  }, [router?.query.search]);

  const handleSubmit = (text: string) => {
    const query = { ...router.query };
    if (text) {
      query.search = text;
    } else {
      delete query.search;
    }
    router.replace({ pathname: router.pathname, query });
  };

  return (
    <Form
      className="flex w-full p-4 rounded border-group"
      onSubmit={() => {
        handleSubmit(search);
      }}
    >
      <Input
        placeholder="Bạn muốn tìm đồ ăn gì ?"
        value={search}
        onChange={(val) => {
          setSearch(val);
          if (!val) {
            handleSubmit(val);
          }
        }}
        clearable
      />
      <Button submit primary icon={<FaSearch />} />
    </Form>
  );
}

// export function ShopsHead() {
//   const { setOpenAddress, useAddress } = useShopsContext();

//   return (
//     <>
//       <Header />
//       <div className="p-4 pb-0 mt-16 bg-white shadow-sm">
//         {useAddress ? (
//           <div
//             className="flex flex-col py-1 cursor-pointer min-h-12"
//             onClick={() => {
//               setOpenAddress(true);
//             }}
//           >
//             <div className="flex items-center font-semibold">
//               <i className="pr-1 text-primary">{<FaMapMarkerAlt />}</i>
//               <span className="text-primary">Giao đến</span>
//               <span className="w-20 ml-auto mr-0 font-semibold text-right cursor-pointer text-primary">
//                 Thay đổi
//               </span>
//             </div>
//             <span className="flex-1 text-left text-ellipsis-1" >{useAddress.fullAddress}</span>
//           </div>
//         ) : (
//           <div
//             className="flex items-center min-h-12"
//             onClick={() => {
//               setOpenAddress(true);
//             }}
//           >
//             <i className="pr-1 text-lg text-primary">{<FaMapMarkerAlt />}</i>
//             <span>{"Vui lòng nhập địa chỉ của bạn"}</span>
//           </div>
//         )}
//       </div>
//       <ShopBanner />
//     </>
//   );
// }
