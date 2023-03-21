import KhongDau from "khong-dau";
import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useShopContext } from "../../../../lib/providers/shop-provider";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import { VoucherDetailsDialog } from "../../../shared/voucher/voucher-details-dialog";

export const ShopDetailsContext = createContext<
  Partial<{
    voucherShow: ShopVoucher;
    categories: Category[];
    showDialogCart;
    setShowDialogCart;
    products: CrudProps<Product>;
    productTag: string;
    countQuery: number;
    // search: string;
    // setSearch: (search: string) => void;
  }>
>({});

export function ShopDetailsProvider(props) {
  const [voucherShow, setVoucherShow] = useState<ShopVoucher>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogCart, setShowDialogCart] = useState(false);
  const { shop } = useShopContext();
  const router = useRouter();
  const { voucher } = router.query;
  const search = useQuery("search");
  const productTag: string = useQuery("productTag");
  const sortBy: string = useQuery("sortBy") || "popular";

  // const [search, setSearch] = useState<string>("");
  const categoryCrud = useCrud(
    CategoryService,
    {
      limit: 100,
      order: { priority: -1, createdAt: 1 },
      filter: { hidden: false, memberId: shop.id },
    },
    {
      fragment: CategoryService.shortFragmentWithProducts,
    }
  );
  const countQuery = useMemo(() => {
    if (sortBy == "new") {
      return Object.keys(router.query).length - 2;
    }
    return Object.keys(router.query).length - 1;
  }, [router.query]);
  const loadDone = useMemo(() => !!categoryCrud.items, [categoryCrud.items]);
  const query = useMemo(() => {
    if (!loadDone) return {};
    let queryObj = {
      limit: 12,
      filter: { memberId: shop.id },
      search,
      order: {},
    };
    if (sortBy) {
      switch (sortBy) {
        case "popular":
          queryObj.order = {};
          break;
        case "new":
          queryObj.order = { _id: -1 };
          break;
        case "priceAsc":
          queryObj.order = { basePrice: 1 };
          break;
        case "priceDesc":
          queryObj.order = { basePrice: -1 };
          break;
      }
    }

    if (productTag) {
      queryObj.filter = { ...queryObj.filter, ...{ categoryId: productTag } };
    } else {
      queryObj.filter = { ...queryObj.filter, ...{ categoryId: undefined } };
    }

    return queryObj;
  }, [sortBy, productTag, search, loadDone]);

  const productCrud = useCrud(
    ProductService,
    { ...query, limit: 12 },
    {
      fetchingCondition: loadDone,
      cache: true,
    }
  );

  useEffect(() => {
    if (!voucher) {
      ShopVoucherService.getAll({
        fragment: ShopVoucherService.fullFragment,
        query: { limit: 1 },
        cache: false,
      }).then((res) => {
        setVoucherShow(cloneDeep(res.data[0]));
        setShowDialog(false);
      });
    } else {
      ShopVoucherService.getAll({
        fragment: ShopVoucherService.fullFragment,
        query: { limit: 1, filter: { code: voucher } },
      }).then((res) => {
        setVoucherShow(cloneDeep(res.data[0]));
        setShowDialog(true);
      });
    }
  }, [voucher]);

  return (
    <ShopDetailsContext.Provider
      value={{
        voucherShow,
        categories: categoryCrud.items,
        showDialogCart,
        setShowDialogCart,
        products: productCrud,
        productTag,
        countQuery
      }}
    >
      {props.children}
      <VoucherDetailsDialog
        voucher={voucherShow}
        isOpen={showDialog}
        onClose={() => {
          const url = new URL(location.href);
          url.searchParams.delete("voucher");
          router.push(url.toString(), null, { shallow: true });
        }}
      />
    </ShopDetailsContext.Provider>
  );
}

export const useShopDetailsContext = () => useContext(ShopDetailsContext);

export const ShopDetailConsumer = ({
  children,
}: {
  children: (props: Partial<{ voucherShow: ShopVoucher }>) => any;
}) => {
  return <ShopDetailsContext.Consumer>{children}</ShopDetailsContext.Consumer>;
};
