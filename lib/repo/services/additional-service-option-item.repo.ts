import { GraphRepository } from "../graph.repo";

export interface AdditionalServiceOptionItem {
  additionalServiceOptionId: string;
  name: string;
  price: number;
}

export class AdditionalServiceOptionItemRepository extends GraphRepository {
  shortFragment: string = this.parseFragment(`
    additionalServiceOptionId: ID
    name: String
    price: Float
  `);
  fullFragment: string = this.parseFragment(`
    additionalServiceOptionId: ID
    name: String
    price: Float
  `);
}

export const AdditionalServiceOptionItemService = new AdditionalServiceOptionItemRepository();
