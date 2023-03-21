import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCart } from "../../../lib/providers/cart-provider";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { ShopDetailsActions } from "./components/shop-details-actions";
import { ShopDetailsBanners } from "./components/shop-details-banners";
import { ShopDetailsCartDialog } from "./components/shop-details-cart-dialog";
import { ShopDetailsCategories } from "./components/shop-details-categories";
import { ShopDetailsLocation } from "./components/shop-details-location";
import { ShopDetailsProductsGroup } from "./components/shop-details-products-group";
import { ShopDetailsProvider } from "./providers/shop-details-provider";

export function ShopDetailsPage() {
  const { shop } = useShopContext();
  return (
    <ShopDetailsProvider>
      <div className={`relative flex-1 text-accent pb-10`}>
        <ShopDetailsLocation />
        <ShopDetailsBanners banners={shop.config.banners} cover={shop.shopCover} />
        <ShopDetailsActions />
        {/* <ShopDetailsReactions reactions={shop.config.tags} shopName={shop.shopName} /> */}
        <ShopDetailsProductsGroup productGroups={shop.config.productGroups} />
        <ShopDetailsCategories />
      </div>
      <CartButton />
    </ShopDetailsProvider>
  );
}

function CartButton() {
  const router = useRouter();
  const { cartProducts } = useCart();
  const { showDialogCart, setShowDialogCart } = useCart();

  const removeCartQuery = () => {
    delete router.query.cart;
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query },
      },
      undefined,
      { shallow: true }
    );
  };

  useEffect(() => {
    if (cartProducts?.length) return;

    if (router.query.cart) {
      setShowDialogCart(true);
      removeCartQuery();
      return;
    }

    setShowDialogCart(false);
  }, [cartProducts]);

  if (!cartProducts || !cartProducts.length) return <></>;
  return (
    <>
      <ShopDetailsCartDialog
        isOpen={showDialogCart}
        onClose={() => {
          setShowDialogCart(false);
        }}
        slideFromBottom="all"
      />
    </>
  );
}

// interface CartFloatingButtonProps extends ReactProps {
//   onClick?: Function;
// }
// function CartFloatingButton(props: CartFloatingButtonProps) {
//   const { totalQty, totalAmount } = useCart();
//   return (
//     // <div className="sticky left-0 flex flex-col items-center w-full mt-3 bottom-5 sm:bottom-7 z-100">
//     <button
//       className={`rounded-full border-2 border-b-4 border-primary-dark font-medium fixed bottom-4 z-50 left-1/2 transform -translate-x-1/2 justify-between shadow-xl flex btn-primary mx-auto w-11/12 sm:w-5/6 max-w-md h-12 animate-emerge`}
//       onClick={() => {
//         props.onClick();
//       }}
//     >
//       <span>
//         <i className="text-lg mb-0.5">
//           <FaShoppingCart />
//         </i>
//         <span className="font-normal">({totalQty})</span>
//       </span>
//       <span className="pl-2 font-bold text-right whitespace-nowrap">
//         {parseNumber(totalAmount, true)}
//       </span>
//     </button>
//     // </div>
//   );
// }
