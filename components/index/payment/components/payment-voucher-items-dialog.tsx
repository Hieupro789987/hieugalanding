import { useMemo } from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { parseNumber } from "../../../../lib/helpers/parser";
import { CartProduct } from "../../../../lib/providers/cart-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { DialogHeader } from "../../../shared/default-layout/dialog-header";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button, Checkbox } from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";
import { DiscountCartItem, usePaymentContext } from "../providers/payment-provider";

export function PaymentVoucherItemsDialog({ ...props }: DialogProps) {
  const toast = useToast();
  const {
    discountItems,
    discountItemGroups,
    selectedVoucher,
    openVoucherItemsDialog,
    setOpenVoucherItemsDialog,
    isGroup,
  } = usePaymentContext();

  const onClose = () => {
    if (
      (!isGroup &&
        discountItems &&
        (discountItems.filter((x) => x.selected).length || !discountItems.length)) ||
      (isGroup &&
        discountItemGroups &&
        (discountItemGroups.filter((x) => x.filter((x) => x.selected).length).length ||
          !discountItemGroups.length))
    ) {
      setOpenVoucherItemsDialog(false);
    } else {
      toast.info("Vui lòng chọn ít nhất một sản phẩm khuyến mãi");
    }
  };

  return (
    <Dialog
      isOpen={openVoucherItemsDialog}
      onClose={onClose}
      mobileSizeMode
      slideFromBottom="all"
      bodyClass="relative bg-white"
      headerClass=" "
    >
      <DialogHeader title="Chọn sản phẩm khuyến mãi" onClose={onClose} />
      <Dialog.Body>
        <div className="p-4 v-scrollbar" style={{ height: `calc(100vh - 150px)` }}>
          {!selectedVoucher || (!isGroup && !discountItems) || (isGroup && !discountItemGroups) ? (
            <Spinner />
          ) : (
            <OfferItems onConfirm={onClose} />
          )}
        </div>
      </Dialog.Body>
    </Dialog>
  );
}

function OfferItems({ onConfirm, ...props }: { onConfirm: () => any } & ReactProps) {
  const {
    discountItems,
    setDiscountItems,
    discountItemGroups,
    setDiscountItemGroups,
    orderInput,
    setOrderInput,
    isOffer,
    isGroup,
  } = usePaymentContext();

  const selectedCount = useMemo(
    () =>
      isGroup
        ? discountItemGroups.reduce(
            (total, group) => total + group.filter((x) => x.selected).length,
            0
          )
        : discountItems.filter((x) => x.selected).length,
    [discountItems, discountItemGroups]
  );

  const handleToggle = (item: DiscountCartItem, groupIndex?: number) => {
    if (isGroup) {
      if (!item.selected) {
        setOrderInput({ ...orderInput, offerGroupIndex: groupIndex });
        for (let i = 0; i < discountItemGroups.length; i++) {
          if (i != groupIndex) {
            discountItemGroups[i].forEach((item) => (item.selected = false));
          }
        }
      }
      item.selected = !item.selected;
      setDiscountItemGroups([...discountItemGroups]);
    } else {
      const index = discountItems.findIndex((x) => x.productId == item.productId);
      discountItems[index].selected = !discountItems[index].selected;
      setDiscountItems([...discountItems]);
    }
  };

  return (
    <div className="w-full">
      <div className="font-bold text-primary">
        {isOffer ? "Các sản phẩm được tặng kèm khuyến mãi" : "Các sản phẩm được mua đồng giá"}
      </div>
      <div className="text-sm text-gray-600">
        Hãy chọn một hoặc nhiều sản phẩm bên dưới
        {isGroup ? ". Chỉ được chọn sản phẩm trong cùng nhóm." : ""}
      </div>
      <div className="flex flex-col items-center gap-3 mt-4">
        {!isGroup && (
          <>
            {discountItems.map((item, index) => (
              <DiscountItem
                key={item.productId}
                item={item}
                index={index}
                selected={item.selected}
                onToggle={() => handleToggle(item)}
              />
            ))}
          </>
        )}
        {isGroup && (
          <>
            {discountItemGroups.map((group, groupIndex) => (
              <div className="w-full mb-3" key={groupIndex}>
                <div className="pl-2 mb-2 font-semibold text-gray-700 uppercase">
                  Nhóm {groupIndex + 1}
                </div>
                <div className="flex flex-col gap-3">
                  {group.map((item, index) => {
                    return (
                      <DiscountItem
                        key={item.productId}
                        item={item}
                        index={index}
                        selected={item.selected}
                        onToggle={() => handleToggle(item, groupIndex)}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
        <Button
          primary
          text={"Xác nhận"}
          className="h-12 px-12 mt-2"
          disabled={!selectedCount}
          onClick={onConfirm}
        />
      </div>
    </div>
  );
}

function DiscountItem({
  item,
  index,
  selected,
  onToggle,
}: {
  item: { selected: boolean } & CartProduct;
  index: number;
  selected: boolean;
  onToggle: () => any;
}) {
  return (
    <div
      key={item.productId + index}
      className={`w-full border border-gray-100 bg-gray-50 hover:bg-gray-100 rounded py-2 px-3 flex justify-between items-center cursor-pointer`}
      onClick={onToggle}
    >
      <div className="font-medium leading-tight text-gray-700">
        <div>{item.product.name}</div>
        <div>
          <span className="text-sm text-accent">{parseNumber(item.price)}đ</span>
          <span className="ml-3 text-xs line-through">{parseNumber(item.product.basePrice)}đ</span>
        </div>
      </div>
      <Checkbox
        className="pointer-events-none"
        value={item.selected}
        checkedIcon={<MdCheckBox />}
        uncheckedIcon={<MdCheckBoxOutlineBlank />}
      />
    </div>
  );
}
