import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { useClickSearchOutside } from "../../../../lib/hooks/useClickSearchOutside";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { Pagination } from "../../../../lib/repo/crud.repo";
import { Member } from "../../../../lib/repo/member.repo";
import { PublicShop } from "../../../../lib/repo/shop.repo";
import { SearchInput } from "../../../shared/common/search-input";
import { SearchNotFound } from "../../../shared/common/search-not-found";
import { SectionTitle } from "../../../shared/common/section-title";
import { NotFound } from "../../../shared/utilities/misc";
import { PaginationRound } from "../../../shared/utilities/pagination/pagination-round";

import { StoresItem } from "./stores-item";

export function StoresList({
  shops,
  pagination,
  onClickChangePage,
  ...props
}: {
  shops: PublicShop[];
  pagination: Pagination;
  onClickChangePage: any;
}) {
  const isLg = useScreen("lg");
  const { elementRef, openSearch, setOpenSearch, setValue, value } = useClickSearchOutside();
  const router = useRouter();

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    if (!router.isReady) return;
    if (pagination.page == 1 && !!router.query["page"]) {
      delete router.query["page"];
    }

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ...(pagination.page !== 1 ? { page: pagination.page } : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }, [pagination.page]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.page) {
      onClickChangePage(1);
    } else {
      if (pagination.page === 1) return;
      const pageNumber = Number(router.query.page as string);
      onClickChangePage(pageNumber);
    }
  }, [router.query.page]);

  console.log("page", pagination.page);

  return (
    <div>
      <div className="main-container">
        <div className="flex flex-row items-center justify-between">
          {!openSearch && <SectionTitle>Danh sách cửa hàng</SectionTitle>}

          {!isLg &&
            (!openSearch ? (
              <i className="text-2xl">
                <FiSearch onClick={() => setOpenSearch(true)} />
              </i>
            ) : (
              <div className="w-full" ref={elementRef}>
                <SearchInput
                  onValueChange={(val) => setValue(val.trim())}
                  onClear={() => {
                    if (!!value) {
                      setOpenSearch(false);
                      setValue("");
                    }
                  }}
                />
              </div>
            ))}

          {isLg && <SearchInput />}
        </div>
        {shops.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 mt-4 lg:gap-5 lg:grid-cols-5">
            {shops.map((shop) => (
              <StoresItem shop={shop} key={shop.id} />
            ))}
          </div>
        ) : (
          <SearchNotFound type="cửa hàng" />
        )}
        {shops.length < pagination.total && (
          <div className="flex flex-row justify-center w-full mt-8 lg:justify-end">
            <PaginationRound
              limit={10}
              total={pagination.total}
              page={pagination.page}
              onPageChange={(page) => onClickChangePage(page)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
