import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { AiFillWarning } from "react-icons/ai";
import { RiAddFill, RiCloseLine } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { InventoryVoucherProduct } from "../../../../lib/repo/inventory-voucher/inventory-voucher-product.repo";
import {
  InventoryVoucher,
  InventoryVoucherService,
} from "../../../../lib/repo/inventory-voucher/inventory-voucher.repo";
import { ShopBranchService } from "../../../../lib/repo/shop-branch.repo";
import {
  WarehouseProduct,
  WarehouseProductService,
} from "../../../../lib/repo/warehouse/product-warehouse.repo";
import { labelAccentField } from "../../common/label-accent";
import { CloseButtonHeaderDialog } from "../../dialog/close-button-header-dialog";
import { TitleDialog } from "../../dialog/title-dialog";
import {
  Button,
  DatePicker,
  Field,
  Form,
  FormProps,
  ImageInput,
  Input,
  Label,
  Radio,
  Select,
  Textarea,
} from "../../utilities/form";
import { useDataTable } from "../../utilities/table/data-table";
import { useWarehouseContext } from "../provider/warehouse-provider";

import { WarehouseAutoComplete } from "./warehouse-autocomplete";

export interface WarehouseFormProps extends FormProps {
  type?: string;
  voucher?: InventoryVoucher;
  typeAt?: "staff" | "shop";
}

export function WarehouseForm({ type, voucher, typeAt, ...props }: WarehouseFormProps) {
  const [typeVoucher, setTypeVoucher] = useState("");
  const { loadAll } = useDataTable();
  const { setBranchId } = useWarehouseContext();
  const toast = useToast();
  const { staff, member } = useAuth();

  useEffect(() => {
    setTypeVoucher(type);
  }, [type]);

  useEffect(() => {
    setBranchId("");
  }, [props.onClose]);

  const handleSubmitWarehouse = async (data) => {
    if (!!voucher?.id) {
      try {
        const {
          productInventoryList,
          total,
          staffName,
          inStockCount,
          errorMessage,
          ...rest
        } = data;
        await InventoryVoucherService.updateInventoryVoucher(
          voucher.id,
          !!staff?.id
            ? {
                ...rest,
                branchId: staff?.branchId,
              }
            : {
                ...rest,
                branchId: !!voucher?.branchId && voucher?.branchId,
              }
        );
        toast.success(
          type == "IMPORT"
            ? "Cập nhật phiếu nhập kho thành công"
            : "Cập nhật phiếu xuất kho thành công"
        );
        props.onClose();
        await loadAll();
      } catch (error) {
        console.error("error: ", error);
        toast.error(
          type == "IMPORT"
            ? "Cập nhật phiếu nhập kho thất bại"
            : "Cập nhật phiếu xuất kho thất bại",
          error.message
        );
      }
    } else {
      let flag = false;
      const productInventoryList = data?.productInventoryList?.map((x) => {
        const { total, inStockCount, errorMessage, ...res } = x;
        if (!!errorMessage) {
          flag = true;
          return;
        }
        return res;
      });

      if (flag) {
        toast.info("Vui lòng điền đầy đủ thông tin.");
      } else {
        try {
          await InventoryVoucherService.createInventoryVoucher(
            !!staff?.id
              ? {
                  ...data,
                  productInventoryList,
                  branchId: staff.branchId,
                }
              : {
                  ...data,
                  productInventoryList,
                }
          );
          toast.success(
            type == "IMPORT" ? "Tạo phiếu nhập kho thành công" : "Tạo phiếu xuất kho thành công"
          );
          props.onClose();
          await loadAll();
        } catch (error) {
          console.error("error: ", error);
          toast.error(
            type == "IMPORT" ? "Tạo phiếu nhập kho thất bại" : "Tạo phiếu xuất kho thất bại",
            error.message
          );
        }
      }
    }
  };

  const voucherCreatorInfo = useMemo(() => {
    if (voucher?.id) {
      return `[${voucher?.staffCode || "Chủ shop"}] ${voucher?.staffName}`;
    }

    if (staff?.id) {
      return `[${staff.code}] ${staff.name}`;
    }

    return `[Chủ shop] ${member?.name}`;
  }, [staff, member, voucher]);

  return (
    <Form
      grid
      defaultValues={
        !!voucher ? { ...voucher, productInventoryList: voucher?.inventoryVoucherProductList } : {}
      }
      dialog
      width={1250}
      {...props}
      headerClass="!hidden"
      bodyClass="p-10"
      onSubmit={handleSubmitWarehouse}
    >
      <div className="flex flex-row items-center justify-between col-span-12">
        <TitleDialog
          title={
            !!voucher?.id
              ? typeVoucher == "IMPORT"
                ? "Cập nhật phiếu nhập kho"
                : "Cập nhật phiếu xuất kho"
              : "Tạo phiếu kho"
          }
        />
        <CloseButtonHeaderDialog onClose={props.onClose} />
      </div>

      {!voucher?.id && (
        <div className="col-span-12">
          <Field
            label="Tạo phiếu kho"
            name="type"
            cols={4}
            {...labelAccentField}
            readOnly={!!voucher && !!voucher.id}
          >
            <Radio
              value={typeVoucher}
              defaultValue={typeVoucher}
              onChange={(val) => setTypeVoucher(val)}
              options={[
                { value: "IMPORT", label: "Nhập kho" },
                { value: "EXPORT", label: "Xuất kho" },
              ]}
            />
          </Field>
        </div>
      )}

      <div className="grid grid-cols-12 col-span-12 gap-x-5">
        <Field name="accountingDate" label="Ngày hạch toán" cols={4} required {...labelAccentField}>
          <DatePicker clearable />
        </Field>
        <Field name="voucherDate" label="Ngày chứng từ" cols={4} required {...labelAccentField}>
          <DatePicker clearable />
        </Field>
      </div>

      <div className="grid grid-cols-12 col-span-12 gap-x-5">
        <Field label="Người tạo phiếu" cols={4} readOnly={true} {...labelAccentField}>
          <Input value={voucherCreatorInfo} />
        </Field>
        <Field
          name="voucherCode"
          label={`Mã phiếu ${typeVoucher == "IMPORT" ? "nhập kho" : "xuất kho"} chứng từ`}
          cols={4}
          required
          {...labelAccentField}
        >
          <Input placeholder={`Mã phiếu ${type == "IMPORT" ? "nhập kho" : "xuất kho"}`} clearable />
        </Field>
      </div>
      {/* 
      {typeAt == "staff" && (
        <div className="grid grid-cols-12 col-span-12">
          <Field
            name="voucherCode"
            label={`Mã phiếu ${typeVoucher == "IMPORT" ? "nhập kho" : "xuất kho"} chứng từ`}
            cols={4}
            required
            {...labelAccentField}
          >
            <Input
              placeholder={`Mã phiếu ${type == "IMPORT" ? "nhập kho" : "xuất kho"}`}
              clearable
            />
          </Field>
        </div>
      )} */}

      <div className="grid grid-cols-12 col-span-12">
        <Field
          name="images"
          label={`Hình ảnh phiếu ${typeVoucher == "IMPORT" ? "nhập kho" : "xuất kho"} chứng từ`}
          cols={8}
          {...labelAccentField}
        >
          <ImageInput multi placeholder="Link hình ảnh" />
        </Field>
      </div>

      <div className="grid grid-cols-12 col-span-12">
        <Field name="explain" label="Diễn giải" cols={8} {...labelAccentField}>
          <Textarea maxRows={3} className="resize-none" />
        </Field>
      </div>

      <Field
        name="branchId"
        label="Chọn kho"
        required
        cols={4}
        readOnly={!!staff || !!voucher?.inventoryVoucherProductList}
        {...labelAccentField}
      >
        <Select
          placeholder="Chọn chi nhánh"
          {...(!!staff?.id ? { defaultValue: staff.branchId } : {})}
          optionsPromise={() => ShopBranchService.getAllOptionsPromise()}
          onChange={(val) => setBranchId(val)}
        />
      </Field>

      <ReasonField typeVoucher={typeVoucher} voucher={voucher} />

      <WarehouseProductListTable
        inventoryVoucherProduct={voucher?.inventoryVoucherProductList}
        typeVoucher={typeVoucher}
      />

      <div className="col-span-12 my-8">
        <Form.Footer
          cancelText="Hủy"
          className="justify-center"
          submitText={
            typeVoucher == "IMPORT"
              ? !!voucher
                ? "Cập nhật phiếu nhập kho"
                : "Tạo phiếu nhập kho"
              : !!voucher
              ? "Cập nhật phiếu xuất kho"
              : "Tạo phiếu xuất kho"
          }
          submitProps={{
            className: "py-6 px-10",
          }}
          cancelProps={{
            outline: true,
            textPrimary: true,
            className: "py-6 px-16 mr-4",
          }}
        />
      </div>
    </Form>
  );
}

export function ReasonField({ typeVoucher, voucher }) {
  const { setValue } = useFormContext();

  useEffect(() => {
    if (!voucher?.id) {
      setValue("reason", "");
    }
  }, [typeVoucher]);

  const optsReason =
    typeVoucher == "IMPORT"
      ? [
          { label: "Nhập hàng", value: "IMPORT" },
          { label: "Hoàn hàng", value: "RETURN" },
          { label: "Khác", value: "OTHER" },
        ]
      : [
          { label: "Xuất hàng", value: "EXPORT" },
          { label: "Bán hàng", value: "SELL" },
          { label: "Khác", value: "OTHER" },
        ];
  return (
    <Field name="reason" label="Lý do" required cols={4} {...labelAccentField}>
      <Select placeholder="Chọn lý do" options={optsReason} clearable {...labelAccentField} />
    </Field>
  );
}

interface ProductTable {
  id: string;
  productId: string;
  productCode: string;
  productName: string;
  provider: string;
  price: number;
  amount: number;
  discount: number;
  total: number;
  errorMessage: string;
  inStockCount: number;
  product: boolean;
}

function WarehouseProductListTable({
  inventoryVoucherProduct,
  typeVoucher,
}: {
  inventoryVoucherProduct: InventoryVoucherProduct[];
  typeVoucher: string;
}) {
  const {
    getValues,
    register,
    formState: { errors },
  } = useFormContext();
  const name = "productInventoryList";
  const { fields, append, remove } = useFieldArray({ name });
  const productList = fields as ProductTable[];
  const { warehouseProduct, branchId } = useWarehouseContext();
  const [totals, setTotals] = useState({
    amount: 0,
    discount: 0,
    totalPrice: 0,
  });
  const { staff } = useAuth();

  register("productInventoryList", { required: true });

  const calculateTotal = () => {
    if (!getValues()?.productInventoryList) return;
    let amount = 0;
    let discount = 0;
    let totalPrice = 0;
    getValues().productInventoryList.forEach((prod) => {
      if (isNaN(Number(prod.amount))) {
        amount = 0;
      } else {
        amount += Number(prod.amount);
      }
      if (isNaN(Number(prod.discount))) {
        discount = 0;
      } else {
        discount += Number(prod.discount);
      }
      totalPrice += Number(prod.total);
    });

    setTotals({
      amount: amount,
      discount: discount,
      totalPrice: totalPrice,
    });
  };

  const collDataNames =
    typeVoucher == "IMPORT" ? COLL_NAME : [...COLL_NAME].filter((x) => x.label !== "Chiết khấu");

  return (
    <div className="col-span-12">
      <Label
        text="Danh sách sản phẩm"
        className="mb-2 font-bold text-accent"
        error={errors.productInventoryList?.message}
        required
      />
      <table className="w-full border-0">
        <thead>
          <tr className="text-sm font-semibold ">
            {(inventoryVoucherProduct
              ? collDataNames.filter((x) => x.label !== "")
              : collDataNames
            ).map((coll, index) => (
              <th className={`px-2 py-3 border border-[#DFE1E6] ${coll?.pos}`} key={index}>
                <span>{coll?.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {productList?.length > 0 &&
            productList.map((item, index) => (
              <RowItem
                index={index}
                product={item}
                key={index}
                name={name}
                warehouseProduct={!!warehouseProduct ? [...warehouseProduct] : []}
                onRemove={() => {
                  remove(index);
                  calculateTotal();
                }}
                defaultValue={!!inventoryVoucherProduct ? true : false}
                loadTotal={() => calculateTotal()}
                typeVoucher={typeVoucher}
              />
            ))}
          <tr className="bg-[#ECF0F1] text-center">
            <td colSpan={5} className="py-3 pl-3 border border-[#DFE1E6] text-sm">
              Tổng
            </td>
            <td className="py-3 border border-[#DFE1E6] text-right pr-2 text-sm">
              {parseNumber(totals?.amount)}
            </td>
            {typeVoucher == "IMPORT" && (
              <td className="py-3 border border-[#DFE1E6] text-right pr-2 text-sm">
                {parseNumber(totals?.discount)}
              </td>
            )}
            <td className="py-3 border border-[#DFE1E6] text-right pr-2 text-sm">
              {totals?.totalPrice == 0 ? 0 : `${parseNumber(totals?.totalPrice)}đ`}
            </td>
            {!inventoryVoucherProduct && (
              <td className="px-1 py-3 border border-[#DFE1E6] w-[2.875rem]"></td>
            )}
          </tr>
        </tbody>
      </table>

      <div className="flex flex-row items-center justify-between mt-4">
        {!inventoryVoucherProduct && (
          <Button
            outline
            textPrimary
            text="Thêm sản phẩm"
            icon={<RiAddFill />}
            className={`py-3 ${
              !!staff?.id && !!staff?.branchId
                ? ""
                : !branchId && "!pointer-events-none !border-gray-300 !text-neutralGrey"
            }`}
            iconPosition="start"
            onClick={() => {
              append({
                productId: "",
                productCode: "",
                productName: "",
                provider: "",
                price: 0,
                amount: 0,
                discount: 0,
                total: 0,
                errorMessage: "",
                inStockCount: 0,
              });
            }}
          />
        )}

        <div className="ml-auto">
          <b>Tổng tiền</b> = số lượng * đơn giá {typeVoucher == "IMPORT" && "- chiết khấu"}
        </div>
      </div>
    </div>
  );
}

function RowItem({
  index,
  product = null,
  name,
  onRemove,
  loadTotal,
  typeVoucher,
  defaultValue = false,
  warehouseProduct,
}: {
  index: number;
  name: string;
  product: ProductTable;
  warehouseProduct: WarehouseProduct[];
  typeVoucher: string;
  onRemove: () => void;
  loadTotal: () => void;
  defaultValue?: boolean;
}) {
  const { branchId } = useWarehouseContext();
  const {
    setValue,
    watch,
    formState: { isSubmitting },
  } = useFormContext();
  const productId: string = watch(`${name}[${index}].productId`);
  const productCode: string = watch(`${name}[${index}].productCode`);
  const productName: string = watch(`${name}[${index}].productName`);
  const provider: string = watch(`${name}[${index}].provider`);
  const price: number = watch(`${name}[${index}].price`, 0);
  const amount: number = watch(`${name}[${index}].amount`, 0);
  const discount: number = watch(`${name}[${index}].discount`, 0);
  const total: number = watch(`${name}[${index}].total`, 0);
  const inStockCount: number = watch(`${name}[${index}].inStockCount`, 0);
  const [errorMess, setErrorMess] = useState("");
  const [isAction, setIsAction] = useState(false);
  const messageRef = useRef(null);

  const checkError = () => {
    setIsAction(false);
    if (productCode == "" || productName == "" || provider.trim() == "") {
      setErrorMess("Vui lòng điền đầy đủ thông tin sản phẩm");
      setValue(`${name}[${index}].errorMessage`, "Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    } else if (price <= 0) {
      setValue(`${name}[${index}].errorMessage`, "Đơn giá phải lớn hơn 0");
      setErrorMess("Đơn giá phải lớn hơn 0");
      return;
    } else if (amount <= 0) {
      setValue(`${name}[${index}].errorMessage`, "Số lượng phải lớn hơn 0");
      setErrorMess("Số lượng phải lớn hơn 0");
      return;
    } else if ((typeVoucher != "EXPORT" && discount < 0) || discount >= amount * price) {
      setValue(
        `${name}[${index}].errorMessage`,
        `Chiết khấu không được nhỏ hơn 0 và phải nhỏ hơn số lượng * đơn giá = ${price * amount}`
      );
      setErrorMess(
        `Chiết khấu phải lớn hơn hoặc bằng 0 và phải nhỏ hơn số lượng * đơn giá = ${price * amount}`
      );
      return;
    } else if (typeVoucher == "EXPORT" && inStockCount < amount) {
      setValue(`${name}[${index}].errorMessage`, "Không đủ số lượng hàng tồn trong kho");
      setErrorMess(`Không đủ số lượng hàng tồn trong kho (${inStockCount})`);
      return;
    }
    setErrorMess("");
    setValue(`${name}[${index}].errorMessage`, "");
  };

  useEffect(() => {
    if (isSubmitting) {
      checkError();
    }
  }, [isSubmitting]);

  useEffect(() => {
    setValue(
      `${name}[${index}].total`,
      typeVoucher == "IMPORT" ? amount * price - discount : amount * price
    );
    setIsAction(true);
    loadTotal();
  }, [price, amount, discount, typeVoucher]);

  const handleAddProduct = (id: string) => {
    setIsAction(true);

    if (!!id) {
      const warehouse = warehouseProduct.find((x) => x.product.id === id);
      if (!!warehouse?.id && !!warehouse?.product?.id) {
        setValue(`${name}[${index}].productCode`, warehouse.product.productCode);
        setValue(`${name}[${index}].productName`, warehouse.product.name);
        setValue(`${name}[${index}].price`, warehouse.product.basePrice);
        setValue(`${name}[${index}].inStockCount`, warehouse.inStockCount);
        setValue(`${name}[${index}].productId`, warehouse.product.id);
      }
    } else {
      setValue(`${name}[${index}].productCode`, "");
      setValue(`${name}[${index}].productName`, "");
      setValue(`${name}[${index}].price`, "");
      setValue(`${name}[${index}].productId`, "");
      setValue(`${name}[${index}].amount`, "");
      setValue(`${name}[${index}].discount`, 0);
    }
  };

  return (
    <tr className="relative">
      <td className="px-1 py-3 border border-[#DFE1E6] text-center w-12">{index + 1}</td>
      <td className="px-1 py-3 border border-[#DFE1E6] relative text-left w-44">
        <WarehouseAutoComplete
          defaultValue={
            defaultValue ? { label: product?.productCode, value: product?.productId } : null
          }
          valueCustom={{ label: productCode, value: productId }}
          onChange={(value) => {
            handleAddProduct(value);
          }}
          autoFocus={true}
          autocompletePromise={({ id, search }) =>
            WarehouseProductService.getAllAutocompletePromise(
              { id, search },
              {
                fragment: "product { id productCode }",
                query: {
                  filter: {
                    branchId: branchId || undefined,
                  },
                },
                parseOption: (data) => ({
                  value: data.product?.id,
                  label: data.product?.productCode,
                }),
              }
            )
          }
        />
      </td>
      <td className="px-1 py-1 border border-[#DFE1E6] relative w-1/5">
        <WarehouseAutoComplete
          defaultValue={
            defaultValue ? { label: product?.productName, value: product?.productId } : null
          }
          valueCustom={{ label: productName, value: productId }}
          onChange={(value) => {
            handleAddProduct(value);
          }}
          autocompletePromise={({ id, search }) =>
            WarehouseProductService.getAllAutocompletePromise(
              { id, search },
              {
                fragment: "product { id name }",
                query: {
                  filter: {
                    branchId: branchId || undefined,
                  },
                },
                parseOption: (data) => ({
                  value: data.product?.id,
                  label: data.product?.name,
                }),
              }
            )
          }
        />
      </td>
      <td className="px-1 py-1 border border-[#DFE1E6] w-52 max-w-52">
        <Field noError readOnly={defaultValue}>
          <Input
            controlClassName="w-full"
            inputClassName="w-full !pl-2 text-left text-ellipsis-1 text-sm"
            value={!!product?.provider ? product.provider : ""}
            onChange={(provider) => {
              setIsAction(true);
              setValue(`${name}[${index}].provider`, provider);
            }}
          />
        </Field>
      </td>
      <td className={`px-1 py-1 border border-[#DFE1E6] w-36 max-w-36 relative`}>
        <Field
          noError
          readOnly={defaultValue}
          className="absolute w-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
        >
          <Input
            controlClassName="w-full"
            inputClassName="w-full !pr-1.5 text-right text-sm"
            number
            decimal
            maxLength={10}
            decimalSeparator="comma"
            currency={price > 0 ? true : false}
            value={defaultValue ? product?.price : price}
            onChange={(_, valNumber) => setValue(`${name}[${index}].price`, valNumber)}
          />
        </Field>
        <div className="relative top-0 left-0 w-full mx-6 text-base text-right opacity-0 select-none -z-10">
          {price}
        </div>
      </td>
      <td className="px-1 py-1 border border-[#DFE1E6] w-36  max-w-36 ">
        <Field noError readOnly={defaultValue}>
          <Input
            controlClassName="w-full mx-auto"
            inputClassName="w-20 !pr-1 !pl-0 text-right text-sm"
            number
            maxLength={10}
            decimalSeparator="comma"
            value={defaultValue ? product?.amount : amount}
            onChange={(_, valueNumber) =>
              setValue(`${name}[${index}].amount`, valueNumber == null ? 0 : valueNumber)
            }
          />
        </Field>
      </td>
      {typeVoucher == "IMPORT" && (
        <td className="px-1 py-1 border border-[#DFE1E6] w-36 max-w-36">
          <Field noError readOnly={defaultValue}>
            <Input
              controlClassName="w-full mx-auto"
              inputClassName="w-20 !pr-1 text-right text-sm"
              number
              maxLength={10}
              decimalSeparator="comma"
              value={defaultValue ? (product?.discount == 0 ? "0" : product?.discount) : discount}
              onChange={(_, valueNumber) => setValue(`${name}[${index}].discount`, valueNumber)}
            />
          </Field>
        </td>
      )}

      <td className="px-2 py-1 border border-[#DFE1E6] text-sm text-right w-60">
        <span> {total == 0 ? "" : `${parseNumber(total)}đ`}</span>{" "}
      </td>
      {!defaultValue && (
        <td className="border border-[#DFE1E6] text-center">
          <Button
            hoverDanger
            icon={<RiCloseLine />}
            className="p-0 px-1"
            iconClassName="text-2xl"
            tooltip="Xóa"
            unfocusable
            onClick={() => {
              onRemove();
            }}
          />
        </td>
      )}

      <td className="relative flex flex-row items-center justify-center border-0" ref={messageRef}>
        {!!errorMess && !isAction && (
          <div className="absolute top-1/2 right-1/2 transform translate-x-[103%] w-[350px] -translate-y-[12%]">
            <i className="px-2 py-5 text-xl text-danger" data-tooltip={errorMess}>
              <AiFillWarning />
            </i>
          </div>
        )}
      </td>
    </tr>
  );
}

interface productInventoryVoucher {
  productCode: string;
  productName: string;
  provider: string;
  price: number;
  amount: number;
  discount: number;
  total: number;
}

const COLL_NAME = [
  {
    label: "STT",
    pos: "text-center",
  },
  {
    label: "Mã sản phẩm",
    pos: "text-left",
  },
  {
    label: "Tên sản phẩm",
    pos: "text-left",
  },
  {
    label: "Nhà cung",
    pos: "text-left",
  },
  {
    label: "Đơn giá",
    pos: "text-right",
  },
  {
    label: "Số lượng",
    pos: "text-right",
  },
  {
    label: "Chiết khấu",
    pos: "text-right",
  },
  {
    label: "Tổng tiền",
    pos: "text-right",
  },
  {
    label: "",
    pos: "",
  },
];
