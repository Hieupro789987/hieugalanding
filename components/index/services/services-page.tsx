import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { useCrud } from "../../../lib/hooks/useCrud";
import { useScreen } from "../../../lib/hooks/useScreen";
import { ServiceTagService } from "../../../lib/repo/services/service-tag.repo";
import { SearchInput } from "../../shared/common/search-input";
import { SearchNotFound } from "../../shared/common/search-not-found";
import { ServiceItem } from "../../shared/common/service-item";
import { Button, Field, Form, Input } from "../../shared/utilities/form";
import { BreadCrumbs, NotFound, Spinner } from "../../shared/utilities/misc";
import { PaginationRound } from "../../shared/utilities/pagination/pagination-round";

import { ServicesFilter } from "./components/services-filter";
import { useServiceContext } from "./provider/services-provider";

export function ServicesPage() {
  const {
    serviceTagCrud,
    serviceCrud: { items, total, page, setPage, loadingAll },
  } = useServiceContext();
  const router = useRouter();
  const screenLg = useScreen("lg");
  const stopUseEffect = useRef(false);

  useEffect(() => {
    if (router.query.page) {
      var timer = setTimeout(() => {
        if (!stopUseEffect.current) {
          setPage(Number(router.query.page));
          stopUseEffect.current = true;
        }
      }, 1500);
    } else {
      if (router.isReady) {
        stopUseEffect.current = true;
      }
    }

    return () => clearTimeout(timer);
  }, [router.isReady]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!router.isReady) return;
    if (page == 1 && !!router.query["page"]) {
      delete router.query["page"];
    }

    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        ...(page !== 1 ? { page: page } : {}),
      },
    });
  }, [page]);

  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query.page) {
      setPage(1);
    } else {
      if (page === 1) return;
      const pageNumber = Number(router.query.page as string);
      setPage(pageNumber);
    }
  }, [router.query.page]);

  if (!items || loadingAll || !stopUseEffect.current) return <Spinner />;

  return (
    <>
      <div className={`${screenLg ? "" : "bg-white border-y border-y-gray-100"}`}>
        <div className="main-container">
          <BreadCrumbs
            className="relative z-10 py-3 lg:py-6"
            breadcrumbs={[
              {
                href: "/",
                label: "Trang chủ",
              },
              {
                label: "Dịch vụ",
              },
            ]}
          />
        </div>
      </div>
      <div className={`${screenLg ? "" : "bg-white"}`}>
        <div className="main-container">
          <div className="flex flex-col lg:justify-between lg:flex-row lg:pt-3 gap-x-8">
            <ServicesFilter serviceTags={serviceTagCrud?.items} />

            <div className="flex-1">
              {screenLg && (
                <div className="mb-5 lg:ml-auto lg:w-fit">
                  <SearchInput />
                </div>
              )}

              {loadingAll ? (
                <Spinner />
              ) : items.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((item) => (
                    <ServiceItem key={item?.id} service={item} />
                  ))}
                </div>
              ) : (
                <SearchNotFound type="dịch vụ" />
              )}
            </div>
          </div>

          <div className="flex justify-end w-full mt-8 mb-14">
            {items.length < total && (
              <PaginationRound
                limit={12}
                total={total}
                page={page}
                onPageChange={(page: number) => setPage(page)}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
