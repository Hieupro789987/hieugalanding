import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { FaTicketAlt } from "react-icons/fa";
import { formatDate } from "../../../lib/helpers/parser";
import { useOnScreen } from "../../../lib/hooks/useOnScreen";
import { useShopContext } from "../../../lib/providers/shop-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { CustomerVoucher, CustomerVoucherService } from "../../../lib/repo/customer-voucher.repo";
import { ShopVoucher, ShopVoucherService } from "../../../lib/repo/shop-voucher.repo";
import { NotFound, Spinner } from "../../shared/utilities/misc";
import { TabMaterial } from "../common/tab-material";
import { Button, Form } from "../utilities/form";
import { VoucherDetailsDialog } from "./voucher-details-dialog";
import { VoucherContext, VoucherProvider, VOUCHER_TYPES } from "./voucher-provider";

interface Props extends ReactProps {
  isListMode?: boolean;
  onApply?: (voucher: ShopVoucher) => any;
}

export function VoucherList({ isListMode = false, onApply, ...props }: Props) {
  const [selectedVoucher, setSelectedVoucher] = useState<ShopVoucher>(null);
  const [voucherCode, setVoucherCode] = useState("");
  const router = useRouter();
  const toast = useToast();
  const { customer } = useShopContext();

  useEffect(() => {
    if (router.query.promotionCode) {
      ShopVoucherService.getShopVoucherByCode(router.query.promotionCode as string)
        .then(setSelectedVoucher)
        .catch(console.error);
    }
  }, [router.query.promotionCode]);

  return (
    <VoucherProvider>
      <VoucherContext.Consumer>
        {({ voucherType, setVoucherType, shopVoucherCrud, customerVoucherCrud }) => (
          <div className="text-sm v-scrollbar md:text-base text-accent">
            <div className="bg-white">
              <TabMaterial
                options={VOUCHER_TYPES.filter((v) => v.value != "OWNED" || !!customer)}
                onChange={setVoucherType}
                value={voucherType}
                activedClassName="text-primary"
              />
            </div>

            {!isListMode && (
              <Form className="flex w-full px-5 bg-gray-100 rounded-md pt-5 border-group">
                <input
                  placeholder="Nhập mã khuyến mãi ở đây"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="w-full px-4 border border-gray-100 shadow-sm h-14"
                />
                <Button
                  submit
                  className="font-medium h-14 whitespace-nowrap"
                  primary
                  text="Áp dụng"
                  onClick={async () => {
                    if (!voucherCode) {
                      toast.info("Xin nhập mã khuyến mãi");
                      return;
                    }
                    try {
                      const customerRes = await CustomerVoucherService.getAll({
                        query: {
                          limit: 1,
                          filter: { code: voucherCode, status: "STILL_ALIVE" },
                        },
                        fragment: CustomerVoucherService.fullFragment,
                      });
                      if (customerRes.data.length) {
                        onApply(customerRes.data[0].voucher);
                        setVoucherCode("");
                      } else {
                        const shopRes = await ShopVoucherService.getAll({
                          query: {
                            limit: 1,
                            filter: { code: voucherCode, isPrivate: false, isActive: true },
                          },
                          fragment: ShopVoucherService.fullFragment,
                        });
                        if (shopRes.data.length) {
                          onApply(shopRes.data[0]);
                          setVoucherCode("");
                        } else {
                          toast.error("Không tìm thấy khuyến mãi có mã này");
                        }
                      }
                    } catch (err) {
                      toast.error("Có lỗi khi áp dụng mã. Xin thử lại sau.");
                    }
                  }}
                />
              </Form>
            )}
            {voucherType == "SHOP" ? (
              <>
                {shopVoucherCrud.items ? (
                  <>
                    {shopVoucherCrud.items.length ? (
                      <div className="flex flex-col gap-5 p-5 overflow-x-hidden">
                        {shopVoucherCrud.items.map((item: ShopVoucher, index) => (
                          <VoucherItemVer2
                            key={item.id}
                            voucher={item}
                            onShowDetails={() => setSelectedVoucher(item)}
                            {...(isListMode
                              ? {}
                              : {
                                  onApply: () => onApply(item),
                                })}
                          />
                        ))}
                        {shopVoucherCrud.loading ? (
                          <div className="font-semibold text-center loading-ellipsis text-primary">
                            Đang xem thêm
                          </div>
                        ) : (
                          <>
                            {shopVoucherCrud.items.length < shopVoucherCrud.pagination.total && (
                              <LoadingObserver onLoadMore={() => shopVoucherCrud.loadMore()} />
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <NotFound text="Không có mã khuyến mãi của cửa hàng" icon={<FaTicketAlt />} />
                    )}
                  </>
                ) : (
                  <Spinner />
                )}
              </>
            ) : (
              <>
                {customerVoucherCrud.items ? (
                  <>
                    {customerVoucherCrud.items.length ? (
                      <div className="flex flex-col gap-5 p-5 overflow-x-hidden">
                        {customerVoucherCrud.items.map((item: CustomerVoucher, index) => (
                          <VoucherItemVer2
                            key={item.id}
                            voucher={item.voucher}
                            onShowDetails={() => setSelectedVoucher(item.voucher)}
                            onApply={() => onApply(item.voucher)}
                          />
                        ))}
                        {customerVoucherCrud.loading ? (
                          <div className="font-semibold text-center loading-ellipsis text-primary">
                            Đang xem thêm
                          </div>
                        ) : (
                          <>
                            {customerVoucherCrud.items.length <
                              customerVoucherCrud.pagination.total && (
                              <LoadingObserver onLoadMore={() => customerVoucherCrud.loadMore()} />
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <NotFound text="Bạn không có mã khuyến mãi nào" icon={<FaTicketAlt />} />
                    )}
                  </>
                ) : (
                  <Spinner />
                )}
              </>
            )}
            <VoucherDetailsDialog
              voucher={selectedVoucher}
              isOpen={selectedVoucher ? true : false}
              onClose={() => {
                const url = new URL(location.href);
                url.searchParams.delete("promotionCode");
                router.replace(url.toString(), null, { shallow: true });
                setSelectedVoucher(null);
              }}
            />
          </div>
        )}
      </VoucherContext.Consumer>
    </VoucherProvider>
  );
}

function LoadingObserver({ onLoadMore }: { onLoadMore: () => any }) {
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-10px");
  useEffect(() => {
    if (onScreen) {
      onLoadMore();
    }
  }, [onScreen]);
  return <div ref={ref}></div>;
}

export const VoucherItemVer2 = ({
  voucher,
  onShowDetails,
  onApply,
  ...props
}: ReactProps & {
  voucher: ShopVoucher;
  onShowDetails?: () => any;
  onApply?: () => any;
}) => {
  return (
    <div className="gap-3 p-3 text-sm bg-white border border-gray-100 rounded-md shadow-sm flex-between-center text-accent md:text-base">
      <div className="flex flex-col flex-1 gap-1.5 border-r border-gray-200">
        <div className="flex items-center gap-3 text-ellipsis-1">
          <i className="text-xl text-primary">
            <BiPurchaseTag />
          </i>
          <div className="font-bold">{voucher?.code}</div>
        </div>
        <div className="text-xs font-medium text-gray-500 md:text-sm text-ellipsis-2">
          {voucher?.description}
        </div>
        <div className="text-xs md:text-sm">{`HSD: ${formatDate(
          voucher?.endDate,
          "dd/MM/yyyy"
        )}`}</div>
      </div>
      {onApply ? (
        <div
          className="font-semibold cursor-pointer flex-center text-primary"
          onClick={() => {
            onApply();
          }}
        >
          Áp dụng
        </div>
      ) : (
        <div
          className="font-semibold cursor-pointer flex-center text-primary"
          onClick={() => {
            if (onShowDetails) onShowDetails();
          }}
        >
          Xem chi tiết
        </div>
      )}
    </div>
  );
};
