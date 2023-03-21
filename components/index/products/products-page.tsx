import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { useScreen } from "../../../lib/hooks/useScreen";
import { SearchInput } from "../../shared/common/search-input";
import { Button, Form, Input } from "../../shared/utilities/form";
import { BreadCrumbs } from "../../shared/utilities/misc";
import { ProductsTagList } from "./components/product-tag-list";
import { ProductsList } from "./components/products-list";
import { ProductsLocationList } from "./components/products-location-list";
import { ProductsToolbar } from "./components/products-toolbar";
import { ProductsProvider, SORT_TYPES, useProductsContext } from "./providers/products-provider";

export function ProductsPage() {
  const isLg = useScreen("lg");

  return (
    <ProductsProvider>
      <div className="w-full pb-10">
        <div className="py-3 lg:pt-5 lg:pb-0">
          <div className="main-container">
            <BreadCrumbs breadcrumbs={[{ label: "Trang chủ", href: `/` }, { label: "Sản phẩm" }]} />
          </div>
        </div>
        <ProductsToolbar />
        <section className="flex justify-between pt-6 lg:pt-10 main-container">
          <ProductsSidebar />
          <div className="flex-1 lg:ml-3">
            {isLg && (
              <div className="mb-5 lg:ml-auto lg:w-fit">
                <SearchInput />
              </div>
            )}
            <ProductsSearchResult />
            {/* <ProductsSearch /> */}
            {/* <ProductsSort /> */}
            {/* <SearchInfoSection /> */}
            <ProductsList />
          </div>
        </section>
      </div>
    </ProductsProvider>
  );
}

function ProductsSidebar() {
  const screenLg = useScreen("lg");

  if (!screenLg) return <></>;
  return (
    <>
      <div className="flex flex-col gap-3 pr-2 w-60">
        <ProductsTagList />
        {/* <ProductsLocationList /> */}
      </div>
    </>
  );
}

function ProductsSearchResult() {
  const { search, loading, items } = useProductsContext();

  if (!search || loading) return <></>;
  return (
    <div className="mb-2 text-sm text-center lg:text-left lg:text-base">
      Tìm thấy {items?.length || 0} kết quả cho từ khoá <strong>"{search}"</strong>
    </div>
  );
}

// function ProductsSort() {
//   const screenLg = useScreen("lg");
//   const { sortBy } = useProductsContext();
//   const router = useRouter();

//   if (!screenLg) return <></>;
//   return (
//     <div className="flex items-center justify-end mb-2">
//       {SORT_TYPES.map((type) => (
//         <Button
//           {...(sortBy == type.value
//             ? { textPrimary: true, className: "underline" }
//             : { textAccent: true })}
//           className="hover:underline"
//           text={type.label}
//           key={type.value}
//           href={{
//             pathname: router.pathname,
//             query: {
//               ...router.query,
//               sortBy: type.value,
//             },
//           }}
//         />
//       ))}
//     </div>
//   );
// }

// function ProductsSearch() {
//   const router = useRouter();
//   const { keyword, ...rest } = router.query;
//   const [search, setSearch] = useState("");

//   const handleSubmitSearch = (value) => {
//     router.replace({
//       pathname: "/products",
//       query: {
//         ...rest,
//         ...(value?.trim().length ? { keyword: value } : {}),
//       },
//     });
//   };

//   useEffect(() => {
//     setSearch((keyword as string) || "");
//   }, [keyword]);

//   return (
//     <Form
//       onSubmit={() => handleSubmitSearch(search)}
//       className={`flex-1 max-w-md my-2 ml-auto overflow-hidden`}
//     >
//       <Input
//         placeholder="Tìm kiếm sản phẩm"
//         prefix={
//           <>
//             <Button
//               submit
//               icon={<AiOutlineSearch />}
//               iconClassName="font-semibold cursor-pointer text-primary text-xl"
//               className="px-0"
//             />
//           </>
//         }
//         type="text"
//         clearable
//         className={`border-gray-300`}
//         value={search}
//         onChange={(value) => {
//           setSearch(value);
//           if (!value) handleSubmitSearch("");
//         }}
//       />
//     </Form>
//   );
// }
