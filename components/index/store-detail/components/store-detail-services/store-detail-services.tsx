import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { SearchInput } from "../../../../shared/common/search-input";
import { SearchNotFound } from "../../../../shared/common/search-not-found";
import { ServiceItem } from "../../../../shared/common/service-item";
import { Button, Form, Input } from "../../../../shared/utilities/form";
import { Spinner } from "../../../../shared/utilities/misc";
import { PaginationRound } from "../../../../shared/utilities/pagination/pagination-round";
import { StoreDetailServicesFilter } from "./component/store-detail-services-filter";

import { useStoreDetailServiceContext } from "./provider/store-detail-service-provider";

export function StoreDetailServices() {
  const {
    shopServiceCategoryCrud,
    servicesCrud: { items, total, page, setPage, loadingAll },
  } = useStoreDetailServiceContext();
  const screenLg = useScreen("lg");

  if (items == undefined || items == null) return <Spinner />;

  return (
    <>
      <div className={`${screenLg ? "" : "bg-white"}`}>
        <div>
          <div className="flex flex-col lg:justify-between lg:flex-row lg:pt-10 gap-x-8">
            <StoreDetailServicesFilter categoryTags={shopServiceCategoryCrud?.items} />

            <div className="flex-1">
              {screenLg && (
                <div className="mb-5 lg:ml-auto lg:w-fit">
                  <SearchInput />
                </div>
              )}
              {loadingAll ? <Spinner /> : items.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((item) => (
                    <ServiceItem key={item?.id} service={item} hasShop={false} />
                  ))}
                </div>
              ) : (
                <SearchNotFound type="dịch vụ"/>
              )}
            </div>
          </div>

          <div className="flex justify-end w-full mt-8 mb-14">
            {items.length < total && (
              <PaginationRound
                limit={12}
                page={page}
                total={total}
                onPageChange={(page: number) => setPage(page)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

