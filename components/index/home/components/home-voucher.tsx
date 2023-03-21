import { useEffect, useState } from "react";
import { BiPurchaseTag } from "react-icons/bi";
import { Swiper, SwiperSlide } from "swiper/react";
import { formatDate } from "../../../../lib/helpers/parser";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ShopVoucher, ShopVoucherService } from "../../../../lib/repo/shop-voucher.repo";
import { SectionTitle } from "../../../shared/common/section-title";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";

type Props = {};

export function HomeVoucher({ ...props }) {
  const [vouchers, setVouchers] = useState<ShopVoucher[]>(null);
  const [arrVoucher, setArrVoucher] = useState([]);
  const { globalCustomer } = useAuth();
  const toast = useToast();
  const [listVouchers, setListVouchers] = useState([]);
  const screenXs = useScreen("xs");
  const screenSm = useScreen("sm");
  const screenMd = useScreen("md");
  const screenLg = useScreen("lg");

  useEffect(() => {
    ShopVoucherService.getAll({ query: { limit: 6, order: { _id: -1 } } }).then((res) => {
      setVouchers(res.data);
    });
  }, [globalCustomer]);

  const handleClickVoucher = (data) => {
    let getVoucherLocalStorage = [];
    const dataVoucher = JSON.parse(localStorage.getItem("data-voucher"));
    if (dataVoucher) {
      getVoucherLocalStorage = JSON.parse(localStorage.getItem("data-voucher"));
      getVoucherLocalStorage.push(data);
      toast.success("Lưu voucher thành công");
    } else {
      getVoucherLocalStorage.push(data);
      toast.success("Lưu voucher thành công");
    }
    localStorage.setItem("data-voucher", JSON.stringify(getVoucherLocalStorage));
    setArrVoucher([...getVoucherLocalStorage]);
    setListVouchers(JSON.parse(localStorage.getItem("data-voucher")));
  };

  useEffect(() => {
    setListVouchers(JSON.parse(localStorage.getItem("data-voucher")));
  }, []);

  if (!vouchers) return <Spinner />;
  if (vouchers.length == 0) return <></>;

  return (
    <section className="py-3 xl:py-5 main-container">
      <div className="flex flex-row items-center justify-between">
        <SectionTitle>Voucher cửa hàng</SectionTitle>
        {/* <Button text="Xem thêm" href={"/"} className="text-primary" /> */}
      </div>

      <div className="mt-4 mb-8">
        {!screenLg ? (
          <Swiper
            slidesPerView={screenMd ? 2.5 : screenSm ? 2 : screenXs ? 1.5 : 1}
            spaceBetween={16}
            grabCursor
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            freeMode={false}
          >
            {vouchers.slice(0, 5).map((v, index) => (
              <SwiperSlide className="" key={index}>
                <VoucherItem
                  key={v.id}
                  item={v}
                  onClickVoucher={handleClickVoucher}
                  dataVoucher={listVouchers}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="grid grid-cols-3 gap-5 xl:grid-cols-4">
            {vouchers.map((v, index) => {
              return (
                <VoucherItem
                  key={v.id}
                  item={v}
                  onClickVoucher={handleClickVoucher}
                  dataVoucher={listVouchers}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

type VoucherItemProps = ReactProps & {
  item: ShopVoucher;
  onClickVoucher: (code: string) => void;
  dataVoucher: any;
};

function VoucherItem(props: VoucherItemProps) {
  const { globalCustomer } = useAuth();
  const { item, onClickVoucher, dataVoucher } = props;
  const [showDetailVoucher, setShowDetailVoucher] = useState(null);
  const [listVouchers, setListVouchers] = useState([]);
  const toast = useToast();

  const handleShowDetailVoucher = (item) => {
    // setShowDetailVoucher(item);
    toast.info("Đang bổ sung điều kiện voucher");
  };
  useEffect(() => {
    setListVouchers(dataVoucher);
  }, [dataVoucher]);

  return (
    <>
      <div className="flex flex-row items-center justify-between p-3 bg-white border border-gray-200 rounded-md shadow-sm xl:p-4 hover:border-primary">
        <div className="flex flex-col flex-1 gap-1 pr-3 overflow-hidden">
          <div className="flex flex-row items-center overflow-hidden">
            <i className="text-base text-primary md:text-lg">
              <BiPurchaseTag />
            </i>
            <div className="ml-1 text-sm font-bold leading-6 text-accent md:text-base text-ellipsis-1">
              {item?.code}
            </div>
          </div>
          <div className="text-xs text-gray-600 whitespace-pre-wrap md:text-sm text-ellipsis-1">
            {item?.description}
          </div>
          <div className="text-xs font-medium text-accent md:text-sm">
            HSD : {formatDate("10/10/2022", "dd-MM-yyyy")}{" "}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 pl-3 border-l border-gray-200">
          <Button
            text="Lưu"
            primary
            disabled={listVouchers && listVouchers?.some((x) => x == item?.code)}
            className="text-sm shadow"
            onClick={() => {
              if (globalCustomer) {
                onClickVoucher(item?.code);
              } else {
                toast.info("Vui lòng đăng nhập tài khoản");
              }
            }}
          />

          <div
            className="text-xs cursor-pointer text-primary md:text-sm"
            onClick={() => handleShowDetailVoucher(item)}
          >
            Điều kiện
          </div>
        </div>
      </div>
      <DialogDetailVoucher
        isOpen={!!showDetailVoucher}
        onClose={() => setShowDetailVoucher(null)}
      />
    </>
  );
}

function DialogDetailVoucher(props: DialogProps) {
  return (
    <Dialog {...props} minWidth="400px">
      <Dialog.Body>
        <div>thong tin chi tiet voucher</div>
      </Dialog.Body>
    </Dialog>
  );
}
