import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { OrderInput, OrderItem } from "../repo/order.repo";
import { calculateProductPriceWithPolicy, PricePolicy } from "../repo/price-policy.repo";
import { OrderItemToppingInput } from "../repo/product-topping.repo";
import { Product, ProductService } from "../repo/product.repo";
import { useShopContext } from "./shop-provider";

export const CartContext = createContext<
  Partial<{
    reOrderInput?: OrderInput;
    clearCartProducts: () => void;
    totalQty: number;
    totalAmount: number;
    cartProducts: CartProduct[];
    addProductToCart: (product: Product, qty: number, note: string, policy?: PricePolicy) => any;
    changeProductQuantity: (productIndex: number, qty: number) => any;
    removeProductFromCart: (productIndex: number) => any;
    reOrder: (items: OrderItem[], reOderInput: OrderInput) => any;
    upsaleProducts: Product[];
    addToCartNoTopping: (product: Product, qty: number, policy?: PricePolicy) => any;
    updateCartProduct: (product: Product, qty: number, note: string, index: number) => any;
    loadCart: () => void;
    editProductIndex: number;
    showDialogCart;
    setShowDialogCart;
  }>
>({});
export interface CartProduct {
  productId: string;
  product?: Product;
  note?: string;
  qty: number;
  price?: number;
  amount?: number;
  topping?: OrderItemToppingInput[];
  pricePolicy?: PricePolicy;
}

export function CartProvider(props) {
  const router = useRouter();
  const { shopCode } = useShopContext();
  let [cartProducts, setCartProducts] = useState<CartProduct[]>();
  const [upsaleProducts, setUpsaleProducts] = useState<Product[]>([]);
  const [showDialogCart, setShowDialogCart] = useState(false);
  const totalQty = useMemo(() => {
    return cartProducts?.reduce((count, item) => (count += item.qty), 0) || 0;
  }, [cartProducts]);
  const totalAmount = useMemo(() => {
    return cartProducts?.reduce((count, item) => (count += item.amount), 0) || 0;
  }, [cartProducts]);

  let [reOrderInput, setReOrderInput] = useState<OrderInput>();

  const saveLastEditedShop = (shopCode) => {
    localStorage.setItem("last-edited-shop", shopCode);
  };

  function loadCart() {
    let storageCartProducts: CartProduct[] = JSON.parse(
      localStorage.getItem(shopCode + "-cart-products")
    );
    if (storageCartProducts) {
      ProductService.getAll({
        query: {
          limit: 0,
          filter: {
            _id: { __in: storageCartProducts.map((x) => x.productId) },
          },
        },
        cache: false,
      })
        .then((res) => {
          let cartProducts = [];
          if (res.data) {
            storageCartProducts.forEach((cartProduct) => {
              const product = cloneDeep(res.data.find((x) => x.id === cartProduct.productId));
              if (product) {
                let isValid = true;
                for (let cartProductTopping of cartProduct.product
                  .selectedToppings as OrderItemToppingInput[]) {
                  const topping = product.toppings.find(
                    (x) => x.id == cartProductTopping.toppingId
                  );
                  if (!topping) {
                    isValid = false;
                    break;
                  } else {
                    const option = topping.options.find(
                      (x) => x.name == cartProductTopping.optionName
                    );
                    if (!option || option.price != cartProductTopping.price) {
                      isValid = false;
                      break;
                    }
                  }
                }
                if (isValid) {
                  product.price = calculateProductPriceWithPolicy({
                    policyBestPrice: product.policyBestPrice,
                    basePrice: product.basePrice,
                    qty: cartProduct.qty,
                  });
                  let price =
                    product.price +
                    cartProduct.product.selectedToppings.reduce(
                      (total, topping) => total + topping.price,
                      0
                    );
                  cartProducts.push({
                    ...cartProduct,
                    price: price,
                    amount: price * cartProduct.qty,
                    product: {
                      ...product,
                      selectedToppings: cartProduct.product.selectedToppings,
                      toppings: cartProduct.product.toppings,
                    },
                  });
                }
              }
            });
          }
          setCartProducts(cartProducts);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setCartProducts([]);
    }
  }

  useEffect(() => {
    loadCart();
  }, []);

  const addProductToCart = (product: Product, qty: number, note: string): boolean => {
    if (!qty) return false;
    let productIndex = cartProducts.findIndex(
      (x) =>
        x.productId == product.id &&
        JSON.stringify(x.product.selectedToppings) == JSON.stringify(product.selectedToppings)
    );

    if (productIndex >= 0) {
      changeProductQuantity(productIndex, cartProducts[productIndex].qty + qty, note);
    } else {
      let price =
        product.price +
        product.selectedToppings.reduce((total, topping) => total + topping.price, 0);

      cartProducts.push({
        productId: product.id,
        product: product,
        qty,
        price,
        amount: price * qty,
        note: note,
      });
    }
    setCartProducts(cloneDeep(cartProducts));
    saveLastEditedShop(shopCode);
    return true;
  };

  const addToCartNoTopping = (product: Product, qty: number) => {
    let price = calculateProductPriceWithPolicy({
      policyBestPrice: product.policyBestPrice,
      basePrice: product.basePrice,
      qty,
    });
    cartProducts.push({
      productId: product.id,
      product: { ...product, selectedToppings: [] },
      qty,
      price,
      amount: price * qty,
    });
    setCartProducts(cloneDeep(cartProducts));
    saveLastEditedShop(shopCode);
  };

  const changeProductQuantity = (productIndex: number, qty: number, note?: string) => {
    if (productIndex < 0 || productIndex >= cartProducts.length) return;
    if (qty) {
      cartProducts[productIndex].qty = qty;
      const product = cartProducts[productIndex].product;
      product.price = calculateProductPriceWithPolicy({
        policyBestPrice: product.policyBestPrice,
        basePrice: product.basePrice,
        qty,
      });
      cartProducts[productIndex].amount =
        (product.price +
          product.selectedToppings.reduce((total, topping) => total + topping.price, 0)) *
        qty;
      if (note) {
        cartProducts[productIndex].note = note;
      }
      setCartProducts([...cartProducts]);
      saveLastEditedShop(shopCode);
    } else {
      removeProductFromCart(productIndex);
    }
  };

  function updateCartProduct(product: Product, qty: number, note: string, index: number) {
    product.price = calculateProductPriceWithPolicy({
      policyBestPrice: product.policyBestPrice,
      basePrice: product.basePrice,
      qty,
    });
    let price =
      product.price + product.selectedToppings.reduce((total, topping) => total + topping.price, 0);
    cartProducts[index] = {
      productId: product.id,
      product: product,
      qty: qty,
      price: price,
      amount: price * qty,
      note: note,
    };
    setCartProducts(cloneDeep(cartProducts));
    saveLastEditedShop(shopCode);
  }

  const removeProductFromCart = (productIndex: number) => {
    if (productIndex >= 0) {
      cartProducts.splice(productIndex, 1);
      setCartProducts([...cartProducts]);
      saveLastEditedShop(shopCode);
    }
  };

  const reOrder = (items: OrderItem[], reOderInput: OrderInput) => {
    let resCartProducts = [...items];
    setReOrderInput(cloneDeep(reOderInput));
    if (resCartProducts) {
      // lấy danh sách product mua lại
      ProductService.getAll({
        query: {
          limit: 0,
          filter: {
            _id: { __in: resCartProducts.map((x) => x.productId) },
          },
        },
      }).then((res) => {
        let listCartNew = cartProducts;

        resCartProducts.forEach((reCartProduct) => {
          let { __typename, ...product } = res.data.find((x) => x.id == reCartProduct.productId);
          if (product) {
            let index = listCartNew.findIndex((x) => x.productId == product.id);
            if (index !== -1) {
              listCartNew.splice(index, 1);
            }
            let price = calculateProductPriceWithPolicy({
              policyBestPrice: product.policyBestPrice,
              basePrice: product.basePrice,
              qty: reCartProduct.qty,
            });
            if (reCartProduct.toppings) {
              price += reCartProduct.toppings.reduce((total, topping) => total + topping.price, 0);
              product.selectedToppings = reCartProduct.toppings.map(
                (item: OrderItemToppingInput) => {
                  return {
                    toppingId: item.toppingId,
                    toppingName: item.toppingName,
                    optionName: item.optionName,
                    price: item.price,
                  };
                }
              );
            }
            listCartNew = [
              {
                productId: product.id,
                product: product,
                qty: reCartProduct.qty,
                price: price,
                amount: price * reCartProduct.qty,
                note: reCartProduct.note,
                topping: reCartProduct.toppings,
              },
              ...listCartNew,
            ];
          }
        });
        setCartProducts([...listCartNew]);
        saveLastEditedShop(shopCode);
      });

      router.push(`/store/${shopCode}/payment`);
    }
  };

  function clearCartProducts() {
    setCartProducts([]);
    saveLastEditedShop(shopCode);
  }

  useEffect(() => {
    if (cartProducts) {
      localStorage.setItem(shopCode + "-cart-products", JSON.stringify(cartProducts));
      loadUpsaleProducts();
    } else {
      // localStorage.removeItem(shopCode + "-cart-products");
      setUpsaleProducts([]);
    }
  }, [cartProducts]);

  const loadUpsaleProducts = () => {
    let productIds = [];
    cartProducts.forEach((cartProduct) => {
      if (cartProduct.product?.upsaleProductIds?.length > 0) {
        cartProduct.product.upsaleProductIds.forEach((id) => {
          productIds.push(id);
        });
      }
    });
    productIds = productIds.filter((x) => !cartProducts.find((y) => y.productId == x));
    if (productIds.length) {
      ProductService.getAll({
        query: {
          limit: 0,
          filter: {
            _id: { __in: productIds },
          },
        },
      }).then((res) => setUpsaleProducts(res.data));
    }
  };

  return (
    <CartContext.Provider
      value={{
        clearCartProducts,
        reOrder,
        reOrderInput,
        totalQty,
        totalAmount,
        cartProducts,
        addProductToCart,
        removeProductFromCart,
        changeProductQuantity,
        upsaleProducts,
        addToCartNoTopping,
        loadCart,
        updateCartProduct,
        showDialogCart,
        setShowDialogCart,
      }}
    >
      {props.children}
      {/* {!screenLg && (
        <ProductDetailsProvider>
          <ProductDetailsDialog />
        </ProductDetailsProvider>
      )} */}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
