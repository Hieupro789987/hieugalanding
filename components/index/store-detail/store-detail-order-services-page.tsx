import { addDays, endOfDay, format, startOfDay } from "date-fns";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiStore2Line } from "react-icons/ri";
import { GetGlobalCustomerToken } from "../../../lib/graphql/auth.link";
import { parseNumber } from "../../../lib/helpers/parser";
import { useCrud } from "../../../lib/hooks/useCrud";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useToast } from "../../../lib/providers/toast-provider";

import { useAuth } from "../../../lib/providers/auth-provider";
import { DraftReservationService } from "../../../lib/repo/services/draft-reservation.repo";
import {
  ServiceReservation,
  ServiceReservationService,
} from "../../../lib/repo/services/service-reservation.repo";
import { Service, ShopServiceService } from "../../../lib/repo/services/service.repo";
import { ShopServiceSpecialistService } from "../../../lib/repo/services/shop-service-specialist.repo";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import { TextRequired } from "../../shared/common/text-required";
import { parseAddressTypePlace } from "../../shared/question/commons/commons";
import { Dialog, DialogProps } from "../../shared/utilities/dialog";
import {
  Button,
  DatePicker,
  Field,
  Form,
  Input,
  Label,
  Radio,
  Select,
} from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { BreadCrumbs, Img, Spinner } from "../../shared/utilities/misc";
import { ConfirmDialog } from "../profile/components/profile-reservations-detail";

export function StoreDetailOrderServicesPage({ ...props }) {
  const [service, setService] = useState<Service>();
  const [dataOptions, setDataOptions] = useState<any[]>([]);
  const [subOption, setSubOption] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [change, setChange] = useState(false);

  const [status, setStatus] = useState<ServiceReservation>();

  const router = useRouter();
  const toast = useToast();
  const screenLg = useScreen("lg");
  const getOptions = async () => {
    if (!router?.query?.slug) return;
    const ser = await ShopServiceService.getAll({
      query: { filter: { slug: router.query?.slug as string } },
    });
    setService(ser.data[0]);

    const id = router.query?.ids;
    const optId = (id as string)?.split("-");
    const newList = optId?.map((opt) => {
      const [additionalServiceId, ...options] = opt?.split(",");

      return {
        name: ser.data[0]?.additionalServices?.find((x) => x.id == additionalServiceId)?.name,
        optionIds: options?.map((item) => {
          return ser.data[0]?.additionalServices
            ?.find((x) => x.id == additionalServiceId)
            ?.options?.find((m) => m.id == item);
        }),
      };
    });

    setDataOptions(
      optId?.map((opt) => {
        const [additionalServiceId, ...options] = opt?.split(",");

        return {
          additionalServiceId: additionalServiceId,
          options: options.map((additionalServiceOptionId) => ({ additionalServiceOptionId })),
        };
      })
    );

    const res = newList?.reduce((accP, currP) => {
      return (accP += currP.optionIds?.reduce((acc, curr) => {
        return (acc += curr?.price);
      }, 0));
    }, 0);

    setTotalPrice(res + ser.data[0]?.price);
    setSubOption(newList);
  };

  const getTheBookedService = async () => {
    if (!router?.query?.reserId) return;
    const reserId = router?.query?.reserId as string;

    const res = await ServiceReservationService.getOne({
      id: reserId,
      token: GetGlobalCustomerToken(),
    });
    if (!res) {
    } else {
      setTotalPrice(res.totalPrice);
      setSubOption(
        res?.additionalServices.map((sub) => ({
          name: sub.name,
          optionIds: sub?.options,
        }))
      );
    }
  };

  const handleSubmit = async (data) => {
    const { paymentMethod, ...rest } = data;
    try {
      if (!!(router?.query?.reserId as string)) {
        const res = await ServiceReservationService.updateServiceReservationByGlobalCustomer(
          router?.query?.reserId as string,
          {
            ...rest,
          }
        );
        setStatus(res);
      } else {
        const draff = await DraftReservationService.generateDraftServiceReservation({
          serviceId: service?.id,
          additionalServices: dataOptions,
          servicePriceType: router?.query?.contact ? "CONTACT" : "FIXED",
          ...data,
          reservationDate: data?.reservationDate,
        });
        const res = await ServiceReservationService.generateServiceReservation({
          serviceId: service?.id,
          additionalServices: dataOptions,
          servicePriceType: router?.query?.contact ? "CONTACT" : "FIXED",
          ...data,
          reservationDate: data?.reservationDate,
        });
        setStatus(res);
      }
    } catch (error) {
      toast.error("Đặt lịch dịch vụ thất bại", error.message);
    }
  };

  useEffect(() => {
    getOptions();
  }, [router?.query?.slug, router?.query?.again]);

  useEffect(() => {
    if (!router?.query?.reserId) return;
    getTheBookedService();
  }, [router?.query?.reserId]);

  if (service == null || service == undefined) return <Spinner />;

  return (
    <div>
      <div className="bg-white lg:bg-transparent">
        <div className="main-container">
          <BreadCrumbs
            className="relative z-10 py-3 lg:py-6"
            breadcrumbs={[
              {
                href: "/",
                label: "Trang chủ",
              },
              {
                href: `/store/${sessionStorage.getItem("shopCode")}/services`,
                label: `${service?.member?.shopName}`,
              },
              {
                href: `/store/${sessionStorage.getItem("shopCode")}/services`,
                label: `${service?.shopServiceCategory?.name}`,
              },
              {
                label: `${service?.name}`,
              },
            ]}
          />
        </div>
      </div>

      <div className="w-full rounded-sm shadow-sm lg:bg-white main-container lg:p-4">
        <div className="">
          {screenLg && (
            <div className="mb-8 text-3xl font-extrabold text-primaryBlack">Đặt lịch dịch vụ</div>
          )}

          <div className="flex flex-col lg:justify-between lg:flex-row">
            <div className="lg:mr-12 lg:w-[845px] w-full lg:sticky lg:top-20 lg:border lg:border-gray-100 lg:rounded-sm shadow-sm p-3 h-fit lg:bg-none bg-white">
              <div className="mb-4 font-extrabold lg:text-xl lg:mb-8 text-primaryBlack">
                Thông tin dịch vụ
              </div>
              <ServicesItem service={service} subOptions={subOption} totalPrice={totalPrice} />
            </div>
            <div className="flex-1 pt-4 mt-2 bg-white lg:bg-none lg:mt-0 ">
              <div className="main-container">
                <InfomationOrderUser
                  onSumbitData={(data) => handleSubmit(data)}
                  service={service}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AlertDialogOrderService
        title={router?.query?.reserId ? "Thay đổi lịch hẹn thành công" : "Đặt lịch hẹn thành công"}
        isOpen={!!status}
        reservation={status}
      />

      <ConfirmDialog
        isOpen={!!change}
        onClose={() => setChange(false)}
        type="change"
        title="Thay đổi lịch đặt thành công"
      />
    </div>
  );
}

export function ServicesItem({
  service,
  totalPrice,
  subOptions,
  ...props
}: {
  subOptions: any[];
  service: Service;
  totalPrice: number;
}) {
  const screenLg = useScreen("lg");
  const router = useRouter();

  return (
    <div className=" shink-0 grow-0">
      <div className="flex flex-row w-full">
        <Img
          className="lg:w-[50px] w-[70px]"
          rounded
          src={service?.images.length > 0 && service?.images[0]}
        />
        <div className="w-full">
          <div className="flex items-start justify-between w-full">
            <div className="">
              <div className="flex flex-col justify-between max-w-lg ml-3">
                <p
                  className={`lg:mb-2 mb-1 font-extrabold group-hover:underline text-primaryBlack group-hover:text-primary lg:text-base text-sm ${
                    screenLg ? "text-ellipsis-1" : "text-ellipsis-2"
                  }`}
                >
                  {service?.name}
                </p>
                <p className="flex flex-row items-center font-extrabold text-primary">
                  <RiStore2Line />
                  <span className="ml-1 text-xs lg:text-sm">{service?.member?.shopName}</span>
                </p>
              </div>
            </div>
            {!router.query.contact && (
              <div className="font-extrabold text-primaryBlack">
                {`${parseNumber(service?.price)}đ`}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full pr-3 mt-4 lg:ml-3">
        {subOptions?.length > 0 &&
          subOptions?.map((option, index) => (
            <div
              className="flex flex-row  items-start justify-between w-full  mb-2 lg:pl-[50px]"
              key={index}
            >
              <div className="flex flex-row justify-between text-sm">
                {option?.name && (
                  <span className="first-letter:uppercase lg:min-w-none min-w-fit">
                    {option?.name}:{" "}
                  </span>
                )}
                <span className="pr-3 ml-1 font-extrabold text-primaryBlack">
                  {option?.optionIds?.map((item) => item?.name)?.join(", ")}
                </span>
              </div>
              {!router.query?.contact && option?.optionIds?.length > 0 && (
                <div className="text-sm font-medium text-primaryBlack">
                  +
                  {`${parseNumber(
                    option?.optionIds?.reduce((arr, curr) => {
                      arr += curr?.price;
                      return arr;
                    }, 0)
                  )}đ`}
                </div>
              )}
            </div>
          ))}
      </div>
      <div className="flex justify-end pt-4 mt-4 text-xl font-extrabold border-t border-t-gray-100 text-primary">
        {!router.query?.contact ? `Tổng: ${parseNumber(totalPrice)}đ` : "Giá liên hệ"}
      </div>
    </div>
  );
}

export function InfomationOrderUser({ ...props }) {
  const [place, setPlace] = useState<string>();
  const [reservation, setReservation] = useState<ServiceReservation>();
  const [placeBranch, setPlaceBranch] = useState<string>();
  const { globalCustomer } = useAuth();

  console.log("props?.service?.canReserverSetSpecialist", props?.service);
  const router = useRouter();
  const toast = useToast();
  const specialistCrud = useCrud(
    ShopServiceSpecialistService,
    {
      limit: 0,
      filter: {
        memberId: props.service?.memberId,
        $or: [
          { shopServiceCategoryIds: props.service?.shopServiceCategoryId },
          { shopServiceCategoryIds: { $size: 0 } },
        ],
      },
    },
    { fetchingCondition: props?.service?.canReserverSetSpecialist }
  );
  const getReservationDetail = async () => {
    if (!router?.query?.reserId) return;
    try {
      const res = await ServiceReservationService.getOne({
        id: router?.query?.reserId as string,
        token: GetGlobalCustomerToken(),
      });

      setReservation(res);
      setPlace(res?.addressType);
      setPlaceBranch(parseAddressTypePlace(res?.reservationShopBranch));
    } catch (error) {
      toast.error("Lấy chi tiết dịch vụ đã đặt thất bại", error.message);
    }
  };

  useEffect(() => {}, []);

  useEffect(() => {
    if (!!router?.query?.reserId) {
      getReservationDetail();
    }
    if (!!(router?.query?.ids as string)) {
      if (props?.service?.availableAddressType?.length > 1) {
        setPlace("AT_RESERVER");
      } else {
        setPlace(
          props?.service?.availableAddressType?.includes("AT_RESERVER") ? "AT_RESERVER" : "AT_SHOP"
        );
      }
    }
  }, [router?.query?.reserId, router?.query?.ids]);

  return (
    <>
      <Form
        width={300}
        defaultValues={reservation ? reservation : {}}
        onSubmit={(data) => props?.onSumbitData(data)}
      >
        <div className="mb-4 font-extrabold lg:text-xl text-primaryBlack">Thông tin đặt lịch</div>
        <Field label="Chọn ngày" labelClassName="text-primaryBlack" name="reservationDate" required>
          <DatePicker
            placeholder="Vui lòng chọn ngày tháng"
            minDate={addDays(startOfDay(new Date()), props.service?.minAdvanceReservationInDay)}
            maxDate={addDays(endOfDay(new Date()), 30)}
            onChange={(val) => console.log("chọn thời gian nè", new Date(val))}
            dateFormat="dd/MM/yyyy"
          />
        </Field>

        {props?.service?.canReserverSetSpecialist && (
          <Field
            label="Chọn chuyên viên"
            labelClassName="text-primaryBlack"
            name="shopServiceSpecialistId"
          >
            <Select
              hasImage
              isAvatarImage
              defaultValue={"DEFAULT"}
              options={
                props.service?.shopServiceSpecialists.length > 0
                  ? [
                      { label: "Mặc định", value: "DEFAULT", image: "" },
                      ...props.service?.shopServiceSpecialists?.map((item) => ({
                        label: item.name,
                        value: item.id,
                        image: item.avatar,
                      })),
                    ]
                  : [
                      { label: "Mặc định", value: "DEFAULT", image: "" },
                      ...(specialistCrud?.items?.map((item) => ({
                        label: item.name,
                        value: item.id,
                        image: item.avatar,
                      })) || []),
                    ]
              }
            />
          </Field>
        )}

        <Field
          cols={12}
          label="Địa điểm thực hiện dịch vụ"
          labelClassName="text-primaryBlack"
          name="addressType"
        >
          <Radio
            selectFirst
            defaultValue={
              props?.service?.availableAddressType?.length > 1
                ? "AT_RESERVER"
                : props?.service?.availableAddressType?.includes("AT_RESERVER")
                ? "AT_RESERVER"
                : "AT_SHOP"
            }
            cols={12}
            onChange={(val) => setPlace(val)}
            options={props?.service?.availableAddressType?.map((item) => ({
              value: item,
              label: item !== "AT_SHOP" ? "Tại địa chỉ người đặt" : "Tại chi nhánh cửa hàng",
            }))}
          />
        </Field>

        <Field
          label="Chọn chi nhánh"
          labelClassName="text-primaryBlack"
          name="reservationShopBranchId"
          required
          readOnly={place !== "AT_SHOP"}
          className={`${place !== "AT_SHOP" ? "hidden" : ""}`}
        >
          <Select
            optionsPromise={() =>
              ShopBranchService.getAllOptionsPromise({
                query: { filter: { memberId: props.service?.memberId } },
              })
            }
            onChange={(_, option) => {
              setPlaceBranch(
                parseAddressTypePlace({
                  street: option.data?.address,
                  province: option.data?.province,
                  district: option.data?.district,
                  ward: option.data?.ward,
                })
              );
            }}
          />
        </Field>
        {!!placeBranch && (
          <div className="mb-4 text-sm font-extrabold text-info">{placeBranch}</div>
        )}

        <Note note={reservation?.note} />
        <div className="mt-6 lg:mt-3 boder-t boder-t-gray-100">
          <div className="pt-4 mt-6 text-xl font-extrabold border-t mt-r text-primaryBlack border-t-gray-200">
            Thông tin người đặt
          </div>

          <Field
            label="Họ và tên"
            labelClassName="text-primaryBlack"
            name="reserverFullname"
            required
          >
            <Input
              defaultValue={!!globalCustomer ? globalCustomer?.name : ""}
              placeholder="Vui lòng nhập họ tên"
            />
          </Field>
          <Field
            label="Số điện thoại"
            labelClassName="text-primaryBlack"
            name="reserverPhone"
            required
            validation={{ phone: true }}
          >
            <Input
              defaultValue={!!globalCustomer ? globalCustomer?.phone : ""}
              placeholder="Vui lòng nhập số điện thoại"
            />
          </Field>

          <Field name="reserverPhoneRegionCode" className="hidden">
            <Input defaultValue={"VN"} />
          </Field>
        </div>

        {place === "AT_RESERVER" && <AddressUser type={place} />}

        <Field
          cols={12}
          label="Hình thức thanh toán"
          labelClassName="text-primaryBlack font-extrabold text-xl"
          name="paymentMethod"
          className="pt-5 border-t border-t-gray-200"
        >
          <Radio
            selectFirst
            defaultValue={"CASH"}
            cols={12}
            options={[{ value: "CASH", label: "Tiền mặt" }]}
          />
        </Field>
        <div className="mb-1">
          <TextRequired />
        </div>
        <Form.Footer
          className="w-full"
          cancelText=""
          submitText={`${!!router?.query?.edit ? "Thay đổi đặt lịch" : "Xác nhận đặt lịch"}`}
          submitProps={{
            className: "w-full h-14 shadow-lg lg:mb-0 mb-10 shadow-500/50",
          }}
        />
      </Form>
    </>
  );
}

export function AddressUser({ type, ...props }: { type: string }) {
  const { unregister } = useFormContext();

  useEffect(() => {
    return () => {
      unregister("reservationAddress.provinceId");
      unregister("reservationAddress.districtId");
      unregister("reservationAddress.wardId");
      unregister("reservationAddress.street");
    };
  }, [type]);

  return (
    <AddressGroup
      provinceCols={12}
      districtCols={12}
      wardCols={12}
      selectClass="shadow-sm border-gray-300"
      labelClassName="text-primaryBlack font-extrabold text-sm"
      provinceName="reservationAddress.provinceId"
      districtName="reservationAddress.districtId"
      wardName="reservationAddress.wardId"
      addressName="reservationAddress.street"
      notRequiredWard
      required
    />
  );
}

export function Note({ note, ...props }: { note: string }) {
  const { register, setValue, watch } = useFormContext();
  register("note");

  return (
    <div>
      <Label
        text="Ghi chú"
        subText="Không bắt buộc"
        className="text-xs font-extrabold text-primaryBlack"
        subTextClassName="text-accent"
      />
      <Input
        placeholder="Vui lòng nhập ghi chú"
        onChange={(val) => setValue("note", val)}
        value={note}
      />
    </div>
  );
}

export function AlertDialogOrderService({
  title,
  ...props
}: DialogProps & { title: string; reservation: ServiceReservation }) {
  const router = useRouter();
  return (
    <Dialog width={450} className="text-accent" onOverlayClick={() => null} {...props}>
      <Dialog.Body>
        {/* <CloseButtonHeaderDialog onClose={props.onClose} /> */}
        <div className="flex-center">
          <img srcSet="/assets/img/Success.png 2x" />
        </div>
        <div className="mt-3 mb-6 font-bold text-center">{title}</div>
        <div className="flex flex-row gap-3">
          <Button
            outline
            text="Quay lại cửa hàng"
            className="w-full h-14"
            onClick={async () => {
              router.push(`/store/${sessionStorage?.getItem("shopCode")}/services`);
              // await props.onClose();
            }}
          />
          <Button
            primary
            text="Đến trang chi tiết"
            className="w-full h-14"
            onClick={async () => {
              // await props.onClose();
              setTimeout(() => {
                router.push(`/profile/reservations/${props?.reservation?.id}`);
              }, 300);
            }}
          />
        </div>
      </Dialog.Body>
    </Dialog>
  );
}
