import { GraphRepository } from "../graph.repo";
import {
  AdditionalServiceOptionItem,
  AdditionalServiceOptionItemService,
} from "./additional-service-option-item.repo";

export interface AdditionalServiceItem {
  additionalServiceId: string;
  name: string;
  options: AdditionalServiceOptionItem[];
}

export class AdditionalServiceItemRepository extends GraphRepository {
  shortFragment: string = this.parseFragment(`
    additionalServiceId: ID
    name: String
    options{
      ${AdditionalServiceOptionItemService.shortFragment}
    }: [AdditionalServiceOptionItem]
  `);
  fullFragment: string = this.parseFragment(` 
    additionalServiceId: ID
    name: String
    options{
      ${AdditionalServiceOptionItemService.fullFragment}
    }: [AdditionalServiceOptionItem]
   `);
}

export const AdditionalServiceItemService = new AdditionalServiceItemRepository();
