import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { ShopServiceSpecialistService } from "../../../../lib/repo/services/shop-service-specialist.repo";
import { Checkbox, Field, Input, Radio, Select, Switch } from "../../../shared/utilities/form";
import { useDataTable } from "../../../shared/utilities/table/data-table";
import { PartLabel } from "./shop-services-form";

interface ShopServiceReservationProps extends ReactProps {}

export function ShopServiceReservation({ ...props }: ShopServiceReservationProps) {
  const TIME_OPTIONS = [
    { value: 1, label: "1 ngày" },
    { value: 2, label: "2 ngày" },
    { value: 3, label: "3 ngày" },
    { value: 5, label: "5 ngày" },
    { value: 7, label: "7 ngày" },
    { value: 14, label: "14 ngày" },
    { value: 21, label: "21 ngày" },
    { value: 30, label: "30 ngày" },
  ];
  const { formItem } = useDataTable();
  const { watch, getValues, setValue } = useFormContext();
  const canReserverSetSpecialist = watch("canReserverSetSpecialist");
  const canChangeReservation = watch("canChangeReservation");
  const canCancelReservation = watch("canCancelReservation");
  const isSelectAssignedSpecialist = watch("isSelectAssignedSpecialist");
  const shopServiceCategoryId = watch("shopServiceCategoryId");
  const minAdvanceReservationInDay = watch("minAdvanceReservationInDay");
  let [timeout] = useState<any>();

  const { items: specialist } = useCrud(
    ShopServiceSpecialistService,
    {
      filter: {
        $or: [
          { shopServiceCategoryIds: shopServiceCategoryId || undefined },
          { shopServiceCategoryIds: { $size: 0 } },
        ],
      },
    },
    { fetchingCondition: shopServiceCategoryId }
  );

  const specialistOptions = useMemo(
    () => specialist?.map((x) => ({ value: x.id, label: x.name, image: x.avatar })),
    [specialist]
  );

  const filteredTimeOptions = useMemo(() => {
    return TIME_OPTIONS.filter((option) => option.value <= minAdvanceReservationInDay);
  }, [minAdvanceReservationInDay]);

  return (
    <>
      <PartLabel text="thông tin đặt lịch" />
      <Field
        cols={6}
        label="Địa điểm thực hiện dịch vụ"
        name="availableAddressType"
        labelClassName="text-accent"
        required
        errorClassName="w-52"
      >
        <Checkbox
          multi
          options={[
            { value: "AT_SHOP", label: "Tại chi nhánh cửa hàng" },
            { value: "AT_RESERVER", label: "Tại địa chỉ người đặt" },
          ]}
          className="flex-col"
          defaultValue={["AT_SHOP", "AT_RESERVER"]}
        />
      </Field>
      <Field
        cols={6}
        label="Thời gian tối thiểu để đặt trước"
        name="minAdvanceReservationInDay"
        labelClassName="text-accent"
        required
        tooltip="Thời gian tối thiểu để đặt trước từ 1 đến 30 ngày. Ví dụ: Hôm nay ngày 21 tháng 7, đặt lịch trước tối thiểu 2 ngày nghĩa là được đặt lịch hẹn từ ngày 23 tháng 7 đến ngày 20 tháng 8."
        errorClassName="transform -translate-y-7"
        validation={{
          min: 1,
          max: 30,
        }}
      >
        <Input
          number
          suffix={"Ngày trước ngày hẹn"}
          className="mb-10"
          defaultValue={1}
          onBlur={() => {
            const value = getValues("minAdvanceReservationInDay");
            const minAdvanceReservationChangeInDay = getValues("minAdvanceReservationChangeInDay");
            const minAdvanceReservationCancelInDay = getValues("minAdvanceReservationCancelInDay");
            if (value <= 1) {
              setValue("minAdvanceReservationInDay", 1);
              setValue("minAdvanceReservationChangeInDay", 1);
              setValue("minAdvanceReservationCancelInDay", 1);
              return;
            }

            if (value > 30) {
              setValue("minAdvanceReservationInDay", 30);
            }

            const filteredTimeOption = TIME_OPTIONS.filter((option) => option.value <= value).map(
              (option) => option.value
            );

            const firstLessValue = Math.max.apply(null, filteredTimeOption);
            if (!!value && minAdvanceReservationChangeInDay > value)
              setValue("minAdvanceReservationChangeInDay", firstLessValue);

            if (!!value && minAdvanceReservationCancelInDay > value)
              setValue("minAdvanceReservationCancelInDay", firstLessValue);
          }}
        />
      </Field>
      <Field
        noError
        cols={4}
        label="Thay đổi lịch hẹn"
        name="canChangeReservation"
        tooltip="Ví dụ: Ngày hẹn 24 tháng 7, thay đổi lịch 2 ngày trước ngày hẹn nghĩa là được thay đổi lịch hẹn đến hết ngày 22 tháng 7."
        labelClassName="text-accent"
      >
        <Radio
          options={[
            { value: true, label: "Cho phép đổi lịch trước" },
            { value: false, label: "Không cho phép thay đổi" },
          ]}
          className="flex-cols"
          iconClassName={"!text-xl !pt-0.5"}
        />
      </Field>
      {!canChangeReservation && <div className="col-span-2" />}
      <Field
        required
        cols={2}
        label=""
        name="minAdvanceReservationChangeInDay"
        className={`${!canChangeReservation && "hidden"}`}
      >
        <Select
          defaultValue={filteredTimeOptions[0]?.value}
          options={filteredTimeOptions}
          className="mb-5 -ml-8 w-36"
        />
      </Field>
      <Field
        noError
        cols={4}
        label="Hủy lịch hẹn"
        name="canCancelReservation"
        tooltip="Ví dụ: Ngày hẹn 24 tháng 7, hủy lịch 2 ngày trước ngày hẹn nghĩa là được hủy lịch hẹn đến hết ngày 22 tháng 7."
        labelClassName="text-accent"
      >
        <Radio
          options={[
            { value: true, label: "Cho phép hủy lịch trước" },
            { value: false, label: "Không cho phép hủy" },
          ]}
          className="flex-cols"
          iconClassName={"!text-xl !pt-0.5"}
        />
      </Field>
      {!canCancelReservation && <div className="col-span-2" />}
      <Field
        required
        cols={2}
        label=""
        name="minAdvanceReservationCancelInDay"
        className={`${!canCancelReservation && "hidden"}`}
      >
        <Select
          defaultValue={filteredTimeOptions[0]?.value}
          options={filteredTimeOptions}
          className="mb-5 -ml-8 w-36"
        />
      </Field>
      <Field
        cols={6}
        label=""
        name="canReserverSetSpecialist"
        labelClassName="text-accent"
        noError
        className={`${!canReserverSetSpecialist && "mb-4"} mt-2`}
      >
        <Switch placeholder="Chuyên viên phụ trách" defaultValue={false} />
      </Field>
      <div className="col-span-6"></div>
      <Field
        noError
        cols={6}
        label=""
        name="isSelectAssignedSpecialist"
        labelClassName="text-accent"
        readOnly={!canReserverSetSpecialist}
        className={`${!canReserverSetSpecialist && "hidden"}`}
      >
        <Radio
          defaultValue={formItem?.isSelectAssignedSpecialist}
          options={[
            { value: false, label: "Chọn tất cả chuyên viên" },
            { value: true, label: "Chỉ định chuyên viên" },
          ]}
          className="flex-cols"
          iconClassName={"!text-xl !pt-0.5"}
          onChange={(val) => {
            setValue("isSelectAssignedSpecialist", val);
            if (val) return;

            setValue("specialistIds", []);
          }}
        />
      </Field>
      <div className="col-span-6"></div>
      <Field
        cols={6}
        label=""
        name="specialistIds"
        className={`${!canReserverSetSpecialist && "hidden"}`}
        readOnly={!isSelectAssignedSpecialist || !canReserverSetSpecialist}
        required={isSelectAssignedSpecialist && canReserverSetSpecialist}
      >
        <Select multi hasImage isAvatarImage options={specialistOptions} style={{ width: 372 }} />
      </Field>
    </>
  );
}
