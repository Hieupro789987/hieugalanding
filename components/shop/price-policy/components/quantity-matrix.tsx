import { cloneDeep, sortBy } from "lodash";
import { useMemo, useState } from "react";
import { RiAddFill, RiCloseLine, RiEdit2Line } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useToast } from "../../../../lib/providers/toast-provider";
import { PricePolicyAdjustUnit, QtyMatrix } from "../../../../lib/repo/price-policy.repo";
import { Product } from "../../../../lib/repo/product.repo";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button, Field, Form, Input } from "../../../shared/utilities/form";

interface Props extends ReactProps {
  qtyMatrixes: (QtyMatrix & { id?: string })[];
  unit: PricePolicyAdjustUnit;
  basePrice?: number;
  priceOnly?: boolean;
  bestPrices?: {
    minQty: number;
    price: number;
  }[];
  currentQty?: number;
  onChange?: (val) => any;
  onRemove?: (index) => any;
}
export function QuantityMatrix({
  qtyMatrixes,
  onChange,
  onRemove,
  unit,
  priceOnly = false,
  basePrice,
  bestPrices,
  currentQty,
  ...props
}: Props) {
  const [openQtyRow, setOpenQtyRow] = useState<QtyMatrix & { index: number; id?: string }>();
  const toast = useToast();

  const renderValue = (value: number, minQty?: number, isCurrentQty?: boolean) => {
    const price = unit == "AMOUNT" ? basePrice - value : basePrice - (basePrice * value) / 100;
    const isBestPrice = bestPrices
      ? !!bestPrices.find((x) => x.minQty == minQty && x.price == price)
      : false;

    return (
      <>
        {priceOnly ? (
          <div
            className={`text-sm font-extrabold ${
              isBestPrice
                ? `${isCurrentQty ? "text-primary-dark" : "text-accent"} underline`
                : "text-accent"
            }`}
          >
            {parseNumber(price > 0 ? price : 0)}đ
          </div>
        ) : (
          <div className="font-semibold text-accent">
            -{parseNumber(value)}
            {unit == "AMOUNT" ? "đ" : "%"}
            {isNaN(basePrice) ? (
              ""
            ) : (
              <div className="text-sm font-medium">{` (${parseNumber(
                price > 0 ? price : 0
              )}đ)`}</div>
            )}
          </div>
        )}
      </>
    );
  };
  const currentRowIndex = useMemo(() => {
    if (currentQty !== undefined) {
      for (let i = 0; i < qtyMatrixes.length; i++) {
        if (
          qtyMatrixes[i].minQty <= currentQty &&
          (i == qtyMatrixes.length - 1 || qtyMatrixes[i + 1].minQty > currentQty)
        ) {
          return i;
        }
      }
    }
    return -1;
  }, [currentQty]);
  const headerClass = "text-xs font-extrabold text-accent mb-3 px-2";
  const bodyCellClass = "p-2 border-primary";

  return (
    <>
      <table className="w-full mb-4 bg-white policy-table">
        <thead>
          <tr>
            <th className={`text-left ${headerClass}`}>SL mua</th>
            <th className={`text-right ${headerClass}`}>Giá bán lẻ</th>
            <th className={`text-right ${headerClass}`}>Giá CTV</th>
            {/* <th className={`text-right ${headerClass}`}>Giá CTV hệ thống</th> */}
            <th className={`text-right ${headerClass}`}>Giá đại lý</th>
            <th className={`text-right ${headerClass}`}>Giá nhà phân phối</th>
            {onChange && <th></th>}
            {onRemove && <th></th>}
          </tr>
        </thead>
        <tbody>
          {qtyMatrixes.map((item, index) => (
            <tr key={index} className={`${currentRowIndex == index ? "active" : ""}`}>
              <td
                className={`text-xs ${bodyCellClass} ${
                  currentRowIndex == index ? "text-primary" : "font-medium text-gray-600"
                }`}
              >
                Từ {parseNumber(item.minQty)} sản phẩm
              </td>
              <td className={`text-right ${bodyCellClass}`}>
                {renderValue(item.normal, item.minQty, currentRowIndex == index)}
              </td>
              <td className={`text-right ${bodyCellClass}`}>
                {renderValue(item.ctv, item.minQty, currentRowIndex == index)}
              </td>
              {/* <td className={`text-right ${bodyCellClass}`}>
                {renderValue(item.ctvSan, item.minQty)}
              </td> */}
              <td className={`text-right ${bodyCellClass}`}>
                {renderValue(item.dl, item.minQty, currentRowIndex == index)}
              </td>
              <td className={`text-right ${bodyCellClass}`}>
                {renderValue(item.npp, item.minQty, currentRowIndex == index)}
              </td>
              {onChange && (
                <td className={`w-8 ${bodyCellClass}`} style={{ padding: 0 }}>
                  <Button
                    unfocusable
                    className="w-8 h-8 px-0"
                    icon={<RiEdit2Line />}
                    onClick={() => {
                      const { id, ...rest } = item;
                      setOpenQtyRow({ ...rest, index });
                    }}
                  />
                </td>
              )}
              {onRemove && (
                <td className={`w-8 ${bodyCellClass}`} style={{ padding: 0 }}>
                  <Button
                    unfocusable
                    hoverDanger
                    className="w-8 h-8 px-0"
                    icon={<RiCloseLine />}
                    onClick={() => onRemove(index)}
                  />
                </td>
              )}
            </tr>
          ))}
          {onChange && (
            <tr>
              <td style={{ padding: 0 }} colSpan={8}>
                <Button
                  unfocusable
                  className="w-full"
                  icon={<RiAddFill />}
                  text="Thêm mục bảng giá theo số lượng tối thiểu"
                  onClick={() =>
                    setOpenQtyRow({
                      index: -1,
                      minQty: 0,
                      normal: 0,
                      ctv: 0,
                      ctvSan: 0,
                      dl: 0,
                      npp: 0,
                    })
                  }
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <style jsx>
        {`
          .policy-table {
            border-collapse: separate;
            border-spacing: 0 12px;
            margin-top: -12px; /* correct offset on first border spacing if desired */
          }
           {
            /* .policy-table tr.active td {
            border-color: var(--color-primary);
          }
          .policy-table tr:not(.active) td {
            border-color: #ddd;
          } */
          }
          .policy-table td {
            border: solid 1px #ddd;
            border-style: solid none;
          }
          .policy-table td:first-child {
            border-left-style: solid;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
          }
          .policy-table td:last-child {
            border-right-style: solid;
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
          }
        `}
      </style>
      <Dialog
        width={450}
        title={`${openQtyRow?.index >= 0 ? "Điều chỉnh" : "Thêm"} mục bảng giá`}
        isOpen={!!openQtyRow}
        onClose={() => setOpenQtyRow(null)}
      >
        <Dialog.Body>
          <Field label="Số lượng tối thiểu">
            <Input
              autoFocus
              prefix={">="}
              prefixClassName="font-bold border-r bg-gray-50"
              number
              value={openQtyRow?.minQty}
              onChange={(_, extraVal) =>
                openQtyRow ? setOpenQtyRow({ ...openQtyRow, minQty: extraVal }) : false
              }
            />
          </Field>
          <Field label="Giá bán lẻ được giảm">
            <Input
              number
              decimal
              suffix={unit == "AMOUNT" ? "VND" : "%"}
              value={openQtyRow?.normal}
              onChange={(_, extraVal) =>
                openQtyRow ? setOpenQtyRow({ ...openQtyRow, normal: extraVal }) : false
              }
            />
          </Field>
          <Field label="Giá CTV được giảm">
            <Input
              number
              decimal
              suffix={unit == "AMOUNT" ? "VND" : "%"}
              value={openQtyRow?.ctv}
              onChange={(_, extraVal) =>
                openQtyRow ? setOpenQtyRow({ ...openQtyRow, ctv: extraVal }) : false
              }
            />
          </Field>
          {/* <Field label="Giá CTV hệ thống được giảm">
            <Input
              number
              decimal
              suffix={unit == "AMOUNT" ? "VND" : "%"}
              value={openQtyRow?.ctvSan}
              onChange={(_, extraVal) =>
                openQtyRow ? setOpenQtyRow({ ...openQtyRow, ctvSan: extraVal }) : false
              }
            />
          </Field> */}
          <Field label="Giá đại lý được giảm">
            <Input
              number
              decimal
              suffix={unit == "AMOUNT" ? "VND" : "%"}
              value={openQtyRow?.dl}
              onChange={(_, extraVal) =>
                openQtyRow ? setOpenQtyRow({ ...openQtyRow, dl: extraVal }) : false
              }
            />
          </Field>
          <Field label="Giá nhà phân phối được giảm">
            <Input
              number
              decimal
              suffix={unit == "AMOUNT" ? "VND" : "%"}
              value={openQtyRow?.npp}
              onChange={(_, extraVal) =>
                openQtyRow ? setOpenQtyRow({ ...openQtyRow, npp: extraVal }) : false
              }
            />
          </Field>
          <Form.Footer
            preventDefaultReset
            preventDefaultSubmit
            submitText={`${openQtyRow?.index >= 0 ? "Điều chỉnh" : "Thêm"} mục bảng giá`}
            onSubmit={() => {
              const newQtyMatrixes: QtyMatrix[] = cloneDeep(qtyMatrixes);
              const { index, id, ...rest } = openQtyRow;
              if (openQtyRow?.index < 0 && newQtyMatrixes.find((x) => x.minQty == rest.minQty)) {
                toast.info("Không thể thêm mục bảng giá với số lượng tối thiểu đã tồn tại");
                return;
              }
              if (index >= 0) {
                newQtyMatrixes[index] = rest;
              } else {
                newQtyMatrixes.push(rest);
              }
              // setValue("qtyMatrix", );
              if (onChange) onChange(sortBy(newQtyMatrixes, "minQty"));
              setOpenQtyRow(null);
            }}
            cancelText="Đóng"
            onCancel={() => setOpenQtyRow(null)}
          />
        </Dialog.Body>
      </Dialog>
    </>
  );
}
