import { useState } from "react";
import { RiHome3Line, RiLock2Line, RiPhoneLine } from "react-icons/ri";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { ShopBranchService } from "../../../lib/repo/shop-branch.repo";
import { Staff, StaffService, STAFF_SCOPES } from "../../../lib/repo/staff.repo";
import { parseAddressTypePlace } from "../../shared/question/commons/commons";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Label } from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { Field } from "../../shared/utilities/form/field";
import { Form } from "../../shared/utilities/form/form";
import { ImageInput } from "../../shared/utilities/form/image-input";
import { Input } from "../../shared/utilities/form/input";
import { Select } from "../../shared/utilities/form/select";
import { DataTable } from "../../shared/utilities/table/data-table";

export function StaffsPage(props: ReactProps) {
  const toast = useToast();
  const { member } = useAuth();
  const [openUpdateStaffPassword, setOpenUpdateStaffPassword] = useState<Staff>(null);

  return (
    <>
      <DataTable<Staff> crudService={StaffService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <ShopPageTitle title="Nhân viên" subtitle="Nhân viên hệ thống" />
          <DataTable.Buttons>
            <DataTable.Button
              outline
              isRefreshButton
              refreshAfterTask
              className="w-12 h-12 bg-white"
            />
            <DataTable.Button primary isCreateButton className="h-12" />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search className="h-12 min-w-xs" />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Nhân viên"
            render={(item: Staff) => (
              <DataTable.CellText
                avatar={item.avatar}
                value={item.name}
                subText={item.code}
                subTextClassName="text-xs font-semibold"
              />
            )}
          />
          <DataTable.Column
            label="Liên hệ"
            render={(item: Staff) => (
              <DataTable.CellText
                value={
                  <>
                    {item.phone && (
                      <div className="flex">
                        <i className="mt-1 mr-1 text-lg">
                          <RiPhoneLine />
                        </i>
                        {item.phone}
                      </div>
                    )}
                    {item?.fullAddress?.provinceId && (
                      <div className="flex">
                        <i className="mt-1 mr-1 text-lg">
                          <RiHome3Line />
                        </i>
                        {parseAddressTypePlace(item.fullAddress)}
                      </div>
                    )}
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Trực thuộc"
            render={(item: Staff) => (
              <DataTable.CellText value={item.branch?.name || "Cửa hàng đã bị xóa"} />
            )}
          />
          <DataTable.Column
            right
            render={(item: Staff) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiLock2Line />}
                  tooltip="Đổi mật khẩu"
                  onClick={() => {
                    setOpenUpdateStaffPassword(item);
                  }}
                />
                <DataTable.CellButton value={item} isUpdateButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Form
          extraDialogClass="bg-transparent"
          extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
          extraBodyClass="px-6 bg-gray-100 rounded-b-xl"
          footerProps={{
            className: "justify-center",
            submitProps: { className: "h-14 w-64" },
            cancelText: "",
          }}
          grid
          width={760}
        >
          <DataTable.Consumer>
            {({ formItem }) => (
              <>
                <Field
                  name="username"
                  label="Email đăng nhập"
                  cols={formItem?.id ? 12 : 6}
                  required
                >
                  <Input type="email" />
                </Field>
                {!formItem?.id && (
                  <Field
                    name="password"
                    label="Mật khẩu"
                    cols={6}
                    required
                    validation={{ password: true }}
                  >
                    <Input type="password" />
                  </Field>
                )}
                <Field name="name" label="Tên nhân viên" cols={12} required>
                  <Input />
                </Field>
                <Field name="branchId" label="Chi nhánh bắt buộc" cols={12} required>
                  <Select optionsPromise={() => ShopBranchService.getAllOptionsPromise()} />
                </Field>
                <Field label="Mã cửa hàng" cols={6} readOnly>
                  <Input value={member.code} />
                </Field>
                <Field name="phone" label="Số điện thoại" cols={6}>
                  <Input type="tel" />
                </Field>
                <div className="col-span-12 -mb-[2rem]">
                  <Label text="Địa chỉ" />
                </div>
                <AddressGroup
                  className="grid grid-cols-12 gap-x-8"
                  provinceCols={4}
                  provinceLabel=" "
                  districtCols={4}
                  districtLabel=" "
                  wardCols={4}
                  wardLabel=" "
                  addressCols={12}
                  addressLabel=""
                  provinceName="fullAddress.provinceId"
                  districtName="fullAddress.districtId"
                  wardName="fullAddress.wardId"
                  addressName="fullAddress.street"
                  labelAddressClassName="text-sm font-semibold text-gray-600"
                />
                {/* <Field name="address" label="Địa chỉ" cols={6}>
                  <Input />
                </Field> */}
                <Field name="avatar" label="Avatar" cols={12}>
                  <ImageInput avatar />
                </Field>
                <Field name="scopes" label="Quyền hạn" cols={12}>
                  <Select multi options={STAFF_SCOPES} />
                </Field>
              </>
            )}
          </DataTable.Consumer>
        </DataTable.Form>
        <DataTable.Pagination />
        {/*<DataTable.Divider />
         <div>
          <div className="flex items-center gap-4 my-4">
            <div>
              <Link href="https://apps.apple.com/vn/app/som-kinh-doanh-tinh-g%E1%BB%8Dn/id1577028537?l=vi">
                <a>
                  <img src="/assets/img/appstore.png" className="object-contain mb-3 w-44"></img>
                </a>
              </Link>
              <QRCode value={appStoreLink} size={180} />
            </div>
            <div>
              <Link href="https://play.google.com/store/apps/details?id=mcom.app.shop3m">
                <a>
                  <img src="/assets/img/googleplay.png" className="object-contain mb-3 w-44"></img>
                </a>
              </Link>
              <QRCode value={chPlayLink} size={180} />
            </div>
          </div>
          <div className="flex items-center gap-3"></div>
        </div> */}
      </DataTable>
      <Form
        dialog
        width={350}
        title="Đổi mật khẩu nhân viên"
        isOpen={!!openUpdateStaffPassword}
        onClose={() => setOpenUpdateStaffPassword(null)}
        onSubmit={async (data) => {
          await StaffService.updateStaffPassword(openUpdateStaffPassword.id, data.password)
            .then((res) => {
              toast.success("Đổi mật khẩu nhân viên thành công");
              setOpenUpdateStaffPassword(null);
            })
            .catch((err) => {
              toast.error("Đổi mật khẩu nhân viên thất bại. " + err.message);
            });
        }}
      >
        <Field label="Tên nhân viên" readOnly>
          <Input value={openUpdateStaffPassword?.name} />
        </Field>
        <Field name="password" label="Mật khẩu mới" required>
          <Input type="password" />
        </Field>
        <Field
          name="retypePassword"
          label="Nhập lại mật khẩu mới"
          required
          validation={{
            checkPassword: (value, data) =>
              value != data.password ? "Mật khẩu nhập lại không đúng" : "",
          }}
        >
          <Input type="password" />
        </Field>
        <Form.Footer submitText="Đổi mật khẩu" />
      </Form>
    </>
  );
}
