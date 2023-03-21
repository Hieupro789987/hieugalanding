import cloneDeep from "lodash/cloneDeep";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { GetGlobalCustomerToken } from "../../../../lib/graphql/auth.link";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useCart } from "../../../../lib/providers/cart-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Order, OrderItem, OrderService, ORDER_STATUS } from "../../../../lib/repo/order.repo";
import { ShopCommentService } from "../../../../lib/repo/shop-comment.repo";
import { ShopTag } from "../../../../lib/repo/shop-config.repo";

export const ProfileOrderDetailsContext = createContext<
  Partial<{
    order: Order;
    status: Option;
    loading: boolean;
    setLoading: Function;
    showComment: boolean;
    setShowComment: Function;
    tags: ShopTag[];
    listDiscount: OrderItem[];
    listItems: OrderItem[];
    discountByPoint: number;
    // cancelOrder: (id: string, note: string) => any;
    addTags: (tag: ShopTag) => any;
    commentOrder: (inputData: { message: string; rating: number; images: string[] }) => any;
    reOrderClick: () => any;
  }>
>({});
interface PropsType extends ReactProps {
  code: string;
}
export function ProfileOrderDetailsProvider({ code, ...props }: PropsType) {
  const { reOrder } = useCart();
  const [showComment, setShowComment] = useState(false);
  const [order, setOrder] = useState<Order>(null);
  const [discountByPoint, setDiscountByPoint] = useState(0);
  const alert = useAlert();
  const [loading, setLoading] = useState(false);
  let [listDiscount, setListDiscount] = useState<OrderItem[]>([]);
  let [listItems, setListItems] = useState<OrderItem[]>([]);
  const [tags, setTags] = useState<ShopTag[]>([]);
  const toast = useToast();
  const router = useRouter();

  function addTags(tag: ShopTag) {
    let newTags = tags;
    let tI = newTags.findIndex((t) => t.name === tag.name);
    if (tI !== -1) {
      newTags.splice(tI, 1);
    } else {
      newTags.push({ name: tag.name, icon: tag.icon, qty: tag.qty });
    }
    setTags(cloneDeep(newTags));
  }

  function commentOrder(inputData: { message: string; rating: number; images: string[] }) {
    const { message, rating, images } = inputData;
    ShopCommentService.mutate({
      mutation: `
      commentOrder( orderId:$orderId
        message:$message
        rating:$rating
        tags:$tags
        images: $images
      )`,
      variablesParams: `( $orderId:ID!
        $message:String!
        $rating:Int!
        $tags:[ShopTagInput]!
        $images: [String])`,
      options: {
        variables: {
          orderId: order.id,
          message,
          rating,
          tags,
          images,
        },
      },
    })
      .then((res) => {
        toast.success(res.data.g0);
        loadOrder(code);
      })
      .catch((err) => {
        console.log("Err: " + err.message);
        toast.error(`Lỗi: ${err.message}`);
      });
  }

  useEffect(() => {
    loadOrder(code);
  }, [code]);

  const orderStream = OrderService.subscribeOrder();
  useEffect(() => {
    if (orderStream && orderStream.id == order.id) {
      const res = orderStream;
      if (res !== order) {
        setOrder(cloneDeep(res));
        let point = res.discountLogs.find((item) => item.type === "USE_REWARD_POINT");
        if (point) {
          setDiscountByPoint(point.discount);
        }
        listItems = [...res.items];
        listDiscount = [];
        res.discountLogs.forEach((item) => {
          let found = listItems.find(
            (od) => od.productId === item.productId && od.qty === item.offerQty
          );
          let last = listItems.lastIndexOf(found);
          if (found) {
            listDiscount.push(listItems[last]);
            listItems.splice(last, 1);
          }
        });
        setListDiscount(cloneDeep(listDiscount));
        setListItems(cloneDeep(listItems));
        setOrder(cloneDeep(res));
      }
    } else {
      loadOrder(code);
    }
  }, [orderStream]);

  const status = useMemo(() => {
    if (order) {
      let sta = ORDER_STATUS.find((x) => x.value === order.status);
      if (sta) return { ...sta };
    }
    return null;
  }, [order]);

  const loadOrder = (code: string) => {
    if (!code) return;
    OrderService.getAll({
      fragment: OrderService.fullFragment,
      query: {
        limit: 1,
        filter: {
          code,
        },
      },
      cache: false,
      token: GetGlobalCustomerToken(),
    })
      .then((res) => {
        if (!res.data.length) {
          toast.error("Không tìm thấy đơn hàng");
          router.push(`/profile/order-history`);
          return;
        }
        const order = res.data[0];
        let point = order.discountLogs.find((item) => item.type === "USE_REWARD_POINT");
        if (point) {
          setDiscountByPoint(point.discount);
        }
        listItems = [...order.items];
        listDiscount = [];
        order.discountLogs.forEach((item) => {
          let found = listItems.find((od) => od.productId === item.productId);
          let last = listItems.lastIndexOf(found);
          if (found) {
            listDiscount.push(listItems[last]);
            listItems.splice(last, 1);
          }
        });
        setListDiscount(cloneDeep(listDiscount));
        setListItems(cloneDeep(listItems));
        setOrder(cloneDeep(order));
      })
      .catch((err) => {
        console.error(err);
        alert.error("Xem chi tiết đơn hàng thất bại", err.message);
      });
  };

  function reOrderClick() {
    const {
      promotionCode,
      buyerName,
      buyerPhone,
      pickupMethod,
      shopBranchId,
      pickupTime,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      buyerFullAddress,
      buyerAddressNote,
      latitude,
      longitude,
      discountByPoint,
      paymentMethod,
      note,
    } = order;

    // toppingId: string;
    // toppingName: string;
    // optionName: string;
    // price: number;
    reOrder(order.items, {
      promotionCode,
      buyerName,
      buyerPhone,
      pickupMethod,
      shopBranchId,
      pickupTime,
      buyerAddress,
      buyerProvinceId,
      buyerDistrictId,
      buyerWardId,
      buyerFullAddress,
      buyerAddressNote,
      latitude,
      longitude,
      paymentMethod,
      note,
    });
  }
  return (
    <ProfileOrderDetailsContext.Provider
      value={{
        order,
        status,
        loading,
        setLoading,
        tags,
        addTags,
        commentOrder,
        reOrderClick,
        showComment,
        setShowComment,
        listDiscount,
        listItems,
        discountByPoint,
      }}
    >
      {props.children}
    </ProfileOrderDetailsContext.Provider>
  );
}

export const useProfileOrderDetailContext = () => useContext(ProfileOrderDetailsContext);
