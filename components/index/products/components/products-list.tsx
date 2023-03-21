import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useMemoCompare } from "../../../../lib/hooks/useMemoCompare";
import { ProductItem } from "../../../shared/common/product-item";
import { SearchNotFound } from "../../../shared/common/search-not-found";
import { Button } from "../../../shared/utilities/form";
import { NotFound, Spinner } from "../../../shared/utilities/misc";
import { PaginationRound } from "../../../shared/utilities/pagination/pagination-round";
import { useProductsContext } from "../providers/products-provider";

export function ProductsList() {
  const router = useRouter();
  const { items, page, setPage, total, loadingAll } = useProductsContext();

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
  if (items.length == 0) return <SearchNotFound />;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product, index) => (
          <ProductItem product={product} key={index} className="transition-all" />
        ))}
      </div>
      {items.length < total && (
        <div className="flex flex-row justify-center w-full mt-8 lg:justify-end">
          <PaginationRound
            limit={12}
            total={total}
            page={page}
            onPageChange={(page: number) => setPage(page)}
          />
        </div>
      )}
    </>
  );
}
