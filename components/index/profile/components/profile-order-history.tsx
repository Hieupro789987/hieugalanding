import { useRouter } from "next/router";
import { formatDate, parseNumber } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { Order, OrderService, ORDER_STATUS } from "../../../../lib/repo/order.repo";
import { Button } from "../../../shared/utilities/form";
import { Img, NotFound, Spinner, StatusLabel } from "../../../shared/utilities/misc";

export function ProfileOrderHistory({ ...props }) {
  const screenLg = useScreen("lg");
  const orderListCrud = useCrud(OrderService, { limit: 5, order: { createdAt: -1 } });

  if (!orderListCrud.items || orderListCrud.loading) return <Spinner />;
  if (!screenLg) return <OrderListWebApp orderListCrud={orderListCrud} />;

  return <OrderList orderListCrud={orderListCrud} />;
}
function OrderListWebApp({ orderListCrud, ...props }) {
  return (
    <div className="min-h-screen gap-3 p-3 bg-gray-100 flex-cols">
      {orderListCrud.items.length === 0 ? (
        <NotFound text="Bạn chưa có đơn hàng nào" />
      ) : (
        <>
          {orderListCrud.items.map((order) => (
            <OrderItemWebApp key={order.id} order={order} />
          ))}
          {orderListCrud.hasMore && (
            <div className="text-center">
              <Button
                onClick={orderListCrud.loadMore}
                text="Xem thêm"
                className="w-32 border-none"
                large
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrderItemWebApp({ order, ...props }: ReactProps & { order: Order }) {
  const router = useRouter();
  return (
    <div
      className="p-3 text-sm bg-white rounded shadow-sm md:text-base text-accent"
      onClick={() => router.push(`${router.asPath}/${order?.code}`)}
    >
      <div className="flex justify-between pb-3 border-b border-gray-200">
        <div className="flex-1">
          <div className="text-base font-bold md:text-lg">{order?.code}</div>
          <div className="text-gray-400"> {formatDate(order?.createdAt, "dd-MM-yyyy")}</div>
        </div>
        <Img
          src={order?.seller?.shopLogo}
          className="w-14 md:w-20"
          imageClassName="shadow"
          contain
          avatar
        />
      </div>
      <div className="gap-1.5 mt-3 flex-cols">
        <div className="flex justify-between gap-2 over-flow-hidden">
          <div className="text-gray-400 whitespace-nowrap">Cửa hàng</div>
          <div className="text-right text-ellipsis-1">{order?.seller?.shopName}</div>
        </div>
        <div className="flex items-baseline justify-between">
          <div className="text-gray-400 whitespace-nowrap">Trạng thái</div>
          <div className="text-right">
            <StatusLabel value={order?.status} options={ORDER_STATUS} />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-400 whitespace-nowrap">Số lượng</div>
          <div className="text-right">{order?.itemCount} sản phẩm</div>
        </div>
        <div className="flex justify-between gap-2 overflow-hidden">
          <div className="text-gray-400 whitespace-nowrap">Tổng</div>
          <div className="font-bold text-right text-ellipsis-1">
            {parseNumber(order?.amount, true)}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderList({ orderListCrud }) {
  return (
    <div>
      <div className="mt-5 mb-8 font-semibold leading-7 text-accent text-[28px]">
        Lịch sử đơn hàng
      </div>
      <table className="w-full table-auto">
        {orderListCrud.items.length === 0 ? (
          <tbody className="h-40">
            <tr>
              <td className="flex flex-col items-center justify-center gap-4">
                <img src="https://i.imgur.com/ozluT3Y.png" alt="empty_order" className="w-32" />
                <div className="font-semibold text-center text-gray-500">Chưa có đơn hàng</div>
              </td>
            </tr>
          </tbody>
        ) : (
          <>
            <thead className="my-3">
              <tr className="flex items-center justify-between">
                {DATA_THEAD_TABLE.map((item, index) => (
                  <th
                    className={`font-semibold text-accent pl-3 ${item.width} text-left`}
                    key={index}
                  >
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="pt-8">
              {orderListCrud.items.map((item, index) => (
                <ContentItemTable key={index} order={item} />
              ))}
            </tbody>
          </>
        )}
      </table>
      {orderListCrud?.items?.length > 0 && (
        <>
          {orderListCrud.items.length < orderListCrud.pagination.total && (
            <div className="flex-center">
              <Button
                text="Xem thêm"
                onClick={orderListCrud.loadMore}
                className="mt-4"
                textPrimary
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ContentItemTable({ order, ...props }: { order: Order } & ReactProps) {
  const router = useRouter();

  return (
    <tr
      className="flex justify-between my-3 border border-blue-100 rounded-md cursor-pointer justify-items-stretch"
      onClick={() => router.push(`${router.asPath}/${order?.code}`)}
    >
      <td className="block w-32 h-full p-3 font-semibold text-accent">
        <div className="flex items-center">{order?.code}</div>
        <div className="text-sm font-normal text-gray-500">{order?.itemCount} sản phẩm</div>
      </td>
      <td className="flex-1 block p-3 font-semibold text-accent">
        <div className="flex items-center h-full gap-2">
          <Img src={order?.seller?.shopLogo} className="w-8" contain />
          <div className="font-semibold text-accent">{order?.seller?.shopName}</div>
        </div>
      </td>
      <td className="block w-40 p-3 text-accent">
        <div className="flex items-center h-full">{formatDate(order?.createdAt, "dd-MM-yyyy")}</div>
      </td>
      {/* <td className="block w-32 p-3 text-accent">
        <div className="flex items-center h-full">{`${order?.itemCount} sản phẩm`}</div>
      </td> */}
      <td className="block w-40 p-3 font-bold text-center text-danger">
        <div className="flex items-center h-full">{parseNumber(order?.amount, true)}</div>
      </td>
      <td className="block w-32 p-3 text-accent">
        <div className="flex items-center h-full">
          <StatusLabel value={order?.status} options={ORDER_STATUS} />
        </div>
        {/* <div className="flex items-center h-full">{convertOrderStatus(order?.status)}</div> */}
      </td>
    </tr>
  );
}

export const convertOrderStatus = (status: string) => {
  if (!status) return "";

  const statusList = {
    PENDING: { label: "Đang chờ", color: "primary" },
    CONFIRMED: { label: "Xác nhận", color: "info" },
    DELIVERING: { label: "Đang giao hàng", color: "cyan" },
    COMPLETED: { label: "Hoàn thành", color: "success" },
    FAILURE: { label: "Thất bại", color: "gray" },
    CANCELED: { label: "Hủy bỏ", color: "danger" },
    RETURNED: { label: "Trả hàng", color: "warning" },
    UNCOMPLETED: { label: "Không thành công", color: "teal" },
  };

  return (
    <div
      className={`w-full py-1 px-1 rounded-md bg-${statusList[status].color} text-white text-center`}
    >
      {statusList[status].label}
    </div>
  );
};

export const DATA_THEAD_TABLE = [
  {
    label: "Mã đơn hàng",
    width: "w-32",
  },
  {
    label: "Cửa hàng",
    width: "flex-1",
  },
  {
    label: "Ngày đặt hàng",
    width: "w-40",
  },
  // {
  //   label: "Số lượng",
  //   width: "w-32",
  // },
  {
    label: "Tổng tiền",
    width: "w-40",
  },
  {
    label: "Trạng thái",
    width: "w-32",
  },
];
