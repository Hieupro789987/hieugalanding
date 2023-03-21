import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { AddressService } from "../../../../lib/repo/address.repo";
import { Field } from "./field";
import { Input } from "./input";
import { Select } from "./select";

interface PropsType extends ReactProps {
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  provinceCols?: Cols;
  districtCols?: Cols;
  wardCols?: Cols;
  addressCols?: Cols;
  required?: boolean;
  provinceLabel?: string;
  districtLabel?: string;
  wardLabel?: string;
  addressLabel?: string;
  selectClass?: string;
  openAddress?: boolean;
  notRequiredWard?: boolean;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  addressName?: string;
  labelAddressClassName?: string;
  labelClassName?: string;
  isLabelNoAsterisk?: boolean;
}

export function AddressGroup({
  required = false,
  selectClass = "",
  openAddress = true,
  notRequiredWard = false,
  provinceName = "provinceId",
  districtName = "districtId",
  wardName = "wardId",
  addressName,
  isLabelNoAsterisk = false,
  ...props
}: PropsType) {
  // const [provinceId, setProvinceId] = useState(props.provinceId || "");
  // const [districtId, setDistrictId] = useState(props.districtId || "");
  // const [wardId, setWardId] = useState(props.wardId || "");
  const [districtOptions, setDistrictOptions] = useState<Option[]>();
  const [wardOptions, setWardOptions] = useState<Option[]>();
  const [loadingDistrictOptions, setLoadingDistrictOptions] = useState(false);
  const [loadingWardOptions, setLoadingWardOptions] = useState(false);

  const { watch, setValue } = useFormContext();
  const provinceId: string = watch(provinceName);
  const districtId: string = watch(districtName);
  const wardId: string = watch(wardName);

  useEffect(() => {
    if (provinceId) {
      if (districtOptions?.length > 0) {
        setValue(districtName, "");
        setValue(wardName, "");
      }
      setLoadingDistrictOptions(true);
      AddressService.getDistricts(provinceId).then((res) => {
        const options = res.map((x) => ({ value: x.id, label: x.district }));
        setDistrictOptions(options);
        setLoadingDistrictOptions(false);
      });
    } else {
      setDistrictOptions([]);
      setWardOptions([]);
    }
  }, [provinceId]);

  // useEffect(() => {
  //   if (
  //     districtOptions?.length &&
  //     districtId &&
  //     !districtOptions.find((x) => x.value == districtId)
  //   ) {
  //     setValue(districtName, "");
  //     setValue(wardName, "");
  //   }
  // }, [provinceId, districtOptions]);

  useEffect(() => {
    if (districtId) {
      if (wardOptions?.length > 0) {
        setValue(wardName, "");
      }
      setLoadingWardOptions(true);
      AddressService.getWards(districtId).then((res) => {
        const options = res.map((x) => ({ value: x.id, label: x.ward }));
        setWardOptions(options);
        setLoadingWardOptions(false);
      });
    } else {
      setWardOptions([]);
    }
  }, [districtId]);

  // useEffect(() => {
  //   if (wardOptions?.length && wardId && !wardOptions.find((x) => x.value == wardId)) {
  //     setValue(wardName, "");
  //   }
  // }, [districtId, wardOptions]);

  // useEffect(() => {
  //   if (districtOptions) {
  //     setDistrictId("");
  //     setWardId("");
  //   }
  //   if (provinceId) {
  //     AddressService.getDistricts(provinceId).then((res) =>
  //       setDistrictOptions(res.map((x) => ({ value: x.id, label: x.district })))
  //     );
  //   } else {
  //     setDistrictOptions([]);
  //   }
  // }, [provinceId]);

  // useEffect(() => {
  //   if (wardOptions) {
  //     setWardId("");
  //   }
  //   if (districtId) {
  //     AddressService.getWards(districtId).then((res) =>
  //       setWardOptions(res.map((x) => ({ value: x.id, label: x.ward })))
  //     );
  //   } else {
  //     setWardOptions([]);
  //   }
  // }, [districtId]);

  return (
    <>
      <Field
        {...(props.provinceLabel ? { label: props.provinceLabel } : { label: "Tỉnh/Thành" })}
        name={provinceName ? provinceName : "provinceId"}
        cols={props.provinceCols}
        required={required}
        labelNoAsterisk={isLabelNoAsterisk}
        labelClassName={props.labelClassName}
      >
        <Select
          placeholder="Tỉnh/Thành"
          className={selectClass}
          optionsPromise={() =>
            AddressService.getProvinces().then((res) =>
              res.map((x) => ({ value: x.id, label: x.province }))
            )
          }
        ></Select>
      </Field>
      <Field
        {...(props.districtLabel ? { label: props.districtLabel } : { label: "Quận/Huyện" })}
        name={districtName ? districtName : "districtId"}
        cols={props.districtCols}
        required={required}
        labelNoAsterisk={isLabelNoAsterisk}
        labelClassName={props.labelClassName}
        readOnly={!provinceId}
      >
        <Select
          placeholder="Quận/Huyện"
          className={selectClass}
          readOnly={!provinceId}
          options={districtOptions}
          loading={loadingDistrictOptions}
        ></Select>
      </Field>
      <Field
        {...(props.wardLabel ? { label: props.wardLabel } : { label: "Phường/Xã" })}
        name={wardName ? wardName : "wardId"}
        cols={props.wardCols}
        required={notRequiredWard ? null : required}
        labelNoAsterisk={notRequiredWard ? null : isLabelNoAsterisk}
        labelClassName={props.labelClassName}
        readOnly={!districtId}
      >
        <Select
          placeholder="Phường/Xã"
          className={selectClass}
          readOnly={!districtId}
          options={wardOptions}
          loading={loadingWardOptions}
        ></Select>
      </Field>
      {!!openAddress && (
        <Field
          {...(props.addressLabel
            ? { label: props.addressLabel }
            : { label: "Địa chỉ (Số nhà, Đường)" })}
          name={addressName ? addressName : "address"}
          required={required}
          labelNoAsterisk={isLabelNoAsterisk}
          cols={props.addressCols}
          labelClassName={props.labelAddressClassName}
        >
          <Input placeholder="Vui lòng nhập địa chỉ..." />
        </Field>
      )}
    </>
  );
}
