import { GraphRepository } from "../graph.repo";
import {
  AdditionalServiceOption,
  AdditionalServiceOptionService,
} from "./additional-service-option.repo";

export interface AdditionalService {
  id: string;
  name: string;
  options: AdditionalServiceOption[];
  required: boolean;
  minRequiredQty: number;
  isMultiEnable: boolean;
  isMaxQtyUnlimited: boolean;
  maxQty: number;
}

export class AdditionalServiceRepository extends GraphRepository {
  shortFragment: string = this.parseFragment(`
    id: String
    name: String
    options{
      ${AdditionalServiceOptionService.fullFragment}
    }: [AdditionalServiceOption]
    required: Boolean
    minRequiredQty: Int
    isMultiEnable: Boolean
    isMaxQtyUnlimited: Boolean
    maxQty: Int
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    name: String
    options{
      ${AdditionalServiceOptionService.fullFragment}
    }: [AdditionalServiceOption]
    required: Boolean
    minRequiredQty: Int
    isMultiEnable: Boolean
    isMaxQtyUnlimited: Boolean
    maxQty: Int
  `);
}

export const AdditionalShopServiceService = new AdditionalServiceRepository();
