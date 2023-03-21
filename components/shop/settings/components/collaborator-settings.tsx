import { useFormContext } from "react-hook-form";
import { useShopLayoutContext } from "../../../../layouts/shop-layout/providers/shop-layout-provider";
import {
  CollaboratorCommissionType,
  COLLABORATOR_COMMISSIONS_TYPES,
  COLLABORATOR_COMMISSIONS_UNITS,
} from "../../../../lib/repo/shop-config.repo";
import { Label } from "../../../shared/utilities/form";
import { Editor } from "../../../shared/utilities/form/editor";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";
import { Accordion } from "../../../shared/utilities/misc";

export function CollaboratorSettings() {
  const { shopConfig, updateShopConfig } = useShopLayoutContext();

  const onSubmit = async (data) => {
    await updateShopConfig({ ...data });
  };

  return (
    <Form
      grid
      defaultValues={shopConfig}
      className="max-w-screen-sm animate-emerge"
      onSubmit={onSubmit}
    >
      <Form.Title className="pt-2" title="Cấu hình cộng tác viên" />
      <Field name="collaborator" cols={6}>
        <Switch placeholder="Bật chức năng cộng tác viên" />
      </Field>
      <Field name="colApprove" cols={6}>
        <Switch placeholder="Yêu cầu duyệt cộng tác viên" />
      </Field>
      <Field
        label="Điều kiện trở thành CTV"
        tooltip="Số đơn tối thiểu yêu cầu để trở thành CTV"
        name="colMinOrder"
        cols={6}
      >
        <Input className="h-12" number suffix="đơn" />
      </Field>
      <div className=""></div>
      <Field
        label="Áp dụng hoa hồng trên"
        tooltip="Đơn hàng: Hoa hồng tính dựa trên đơn hàng. Sản phẩm: Hoa hồng tính dựa trên từng sản phẩm"
        name="colCommissionBy"
        cols={6}
      >
        <Select className="inline-grid h-12" options={COLLABORATOR_COMMISSIONS_TYPES} />
      </Field>
      <CommissionValueField />
      <Field label="Điều khoản cộng tác viên" name="colTerm" cols={12}>
        <Editor />
      </Field>
      <SalePointSetting />
      <AgencySetting />
      <DistributorSetting />
      <Form.Footer
        className="mt-1"
        isReverse={false}
        submitProps={{ large: true, className: "shadow" }}
      />
    </Form>
  );
}

function CommissionValueField() {
  const { watch } = useFormContext();
  const colCommissionBy: CollaboratorCommissionType = watch("colCommissionBy");

  return (
    <Accordion isOpen={colCommissionBy == "ORDER"} className="w-full col-span-6">
      <Label text="Giá trị hoa hồng trên từng đơn" />
      <div className="flex">
        <Field
          name="colCommissionValue"
          required={colCommissionBy == "ORDER"}
          className="flex-shrink"
        >
          <Input className="h-12 rounded-r-none" inputClassName="w-32" number />
        </Field>
        <Field name="colCommissionUnit" className="flex-1">
          <Select
            className="inline-grid h-12 rounded-l-none"
            options={COLLABORATOR_COMMISSIONS_UNITS}
          />
        </Field>
      </div>
    </Accordion>
  );
}

const SalePointSetting = () => {
  const { watch } = useFormContext();
  const checkActive = watch("salePointConfig.active");

  return (
    <>
      <Form.Title className="pt-2" title="Cấu hình điểm bán" />
      <Field name="salePointConfig.active" cols={12}>
        <Switch placeholder="Bật chức năng duyệt điểm bán" />
      </Field>
      <div className={`col-span-12 grid grid-cols-12 ${!checkActive && "hidden"}`}>
        <Field
          label="Điều kiện trở thành điểm bán"
          tooltip="Doanh số tối thiểu yêu cầu để trở thành điểm bán"
          name="salePointConfig.minimumSale"
          cols={6}
        >
          <Input className="h-12" number suffix="VNĐ" />
        </Field>
        <Field label="Điều khoản điểm bán" name="salePointConfig.termsAndConditions" cols={12}>
          <Editor />
        </Field>
      </div>
    </>
  );
};

function AgencySetting() {
  const { watch } = useFormContext();
  const checkActive = watch("agencyConfig.active");

  return (
    <>
      <Form.Title className="pt-2" title="Cấu hình đại lý" />
      <Field name="agencyConfig.active" cols={12}>
        <Switch placeholder="Bật chức năng mở đại lý" />
      </Field>
      <div className={`col-span-12 grid grid-cols-12 gap-1 ${!checkActive && "hidden"}`}>
        <Field name="agencyConfig.autoApproval" cols={6}>
          <Switch placeholder="Bật chức năng tự động duyệt đại lý" />
        </Field>
        <Field name="agencyConfig.autoRequest" cols={6}>
          <Switch placeholder="Bật chức năng tự đăng ký đại lý" />
        </Field>
        <Field
          label="Số đơn tối thiểu"
          tooltip="Số đơn tối thiểu yêu cầu để trở thành đại lý"
          name="agencyConfig.minimumOrder"
          cols={6}
        >
          <Input className="h-12" number suffix="đơn" />
        </Field>
        <Field
          label="Doanh số tối thiểu"
          tooltip="Doanh số tối thiểu yêu cầu để trở thành đại lý"
          name="agencyConfig.minimumSale"
          cols={6}
        >
          <Input className="h-12" number suffix="VNĐ" />
        </Field>
        <Field label="Điều khoản đại lý" name="agencyConfig.termsAndConditions" cols={12}>
          <Editor />
        </Field>
      </div>
    </>
  );
}

function DistributorSetting() {
  const { watch } = useFormContext();
  const checkActive = watch("distributorConfig.active");

  return (
    <>
      <Form.Title className="pt-2" title="Cấu hình nhà phân phối" />
      <Field name="distributorConfig.active" cols={12}>
        <Switch placeholder="Bật chức năng mở nhà phân phối" />
      </Field>
      <div className={`col-span-12 grid grid-cols-12 gap-1 ${!checkActive && "hidden"}`}>
        <Field name="distributorConfig.autoApproval" cols={6}>
          <Switch placeholder="Bật chức năng tự động duyệt nhà phân phối" />
        </Field>
        <Field name="distributorConfig.autoRequest" cols={6}>
          <Switch placeholder="Bật chức năng tự đăng ký nhà phân phối" />
        </Field>
        <Field
          label="Số đơn tối thiểu"
          tooltip="Số đơn tối thiểu yêu cầu để trở thành nhà phân phối"
          name="distributorConfig.minimumOrder"
          cols={6}
        >
          <Input className="h-12" number suffix="đơn" />
        </Field>
        <Field
          label="Doanh số tối thiểu"
          tooltip="Doanh số tối thiểu yêu cầu để trở thành nhà phân phối"
          name="distributorConfig.minimumSale"
          cols={6}
        >
          <Input className="h-12" number suffix="VNĐ" />
        </Field>
        <Field
          label="Điều khoản nhà phân phối"
          name="distributorConfig.termsAndConditions"
          cols={12}
        >
          <Editor />
        </Field>
      </div>
    </>
  );
}
