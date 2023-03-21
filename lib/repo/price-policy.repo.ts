import { BaseModel, CrudRepository } from "./crud.repo";

export interface PricePolicy extends BaseModel {
  memberId: string;
  name: string;
  type: PricePolicyType;
  adjustType: PricePolicyAdjustType;
  adjustUnit: PricePolicyAdjustUnit;
  adjustValue: number;
  active: boolean;
  productIds: string[];
  productMinQty: number;
  qtyMatrix: QtyMatrix[];
}

export interface QtyMatrix {
  minQty: number;
  normal: number;
  ctv: number;
  ctvSan: number;
  dl: number;
  npp: number;
}

export class PricePolicyRepository extends CrudRepository<PricePolicy> {
  apiName: string = "PricePolicy";
  displayName: string = "bảng giá";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    adjustUnit: String
    active: Boolean
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    memberId: ID
    name: String
    adjustUnit: String
    active: Boolean
    qtyMatrix {
      minQty: Int
      normal: Float
      ctv: Float
      ctvSan: Float
      dl: Float
      npp: Float
    }: QtyMatrix[];
  `);
}

export const PricePolicyService = new PricePolicyRepository();

export type PricePolicyAdjustType = "INC" | "DEC";
export const PRICE_POLICY_ADJUST_TYPES: Option<PricePolicyAdjustType>[] = [
  {
    value: "INC",
    label: "Tăng",
    color: "success",
  },
  {
    value: "DEC",
    label: "Giảm",
    color: "gray",
  },
];

export type PricePolicyAdjustUnit = "PERCENT" | "AMOUNT";
export const PRICE_POLICY_ADJUST_UNITS: Option<PricePolicyAdjustUnit>[] = [
  {
    value: "PERCENT",
    label: "Phần trăm",
  },
  {
    value: "AMOUNT",
    label: "Số tiền cố định",
  },
];

export type PricePolicyType = "ADJUST_PRICE" | "QTY_MATRIX";
export const PRICE_POLICY_TYPES: Option<PricePolicyType>[] = [
  { value: "ADJUST_PRICE", label: "Điều chỉnh giá" },
  {
    value: "QTY_MATRIX",
    label: "Bảng giá theo số lượng",
  },
];

export const calculateProductPriceWithPolicy = ({
  policyBestPrice,
  basePrice,
  qty,
}: {
  policyBestPrice: {
    minQty: number;
    price: number;
  }[];
  basePrice: number;
  qty: number;
}) => {
  if (policyBestPrice) {
    let value = basePrice;
    for (let bestPrice of policyBestPrice) {
      if (bestPrice.minQty <= qty) {
        value = bestPrice.price;
      } else {
        break;
      }
    }

    return value;
  } else {
    return basePrice;
  }
};

export type PricePolicyActor = "normal" | "ctv" | "ctvSan" | "dl" | "npp";
export const PRICE_POLICY_ACTORS: Option<PricePolicyActor>[] = [
  { value: "normal", label: "Giá bán lẻ" },
  { value: "ctv", label: "CTV" },
  // { value: "ctvSan", label: "CTV hệ thống" },
  { value: "dl", label: "Đại lý" },
  { value: "npp", label: "Nhà phân phối" },
];
