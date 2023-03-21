import { GraphRepository } from "../graph.repo";

export interface AdditionalServiceOption {
  id: string;
  name: string;
  price: number;
}

export class AdditionalServiceOptionRepository extends GraphRepository {
  shortFragment: string = this.parseFragment(`
    id: String
    name: String
    price: Float
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    name: String
    price: Float
  `);
}

export const AdditionalServiceOptionService = new AdditionalServiceOptionRepository();
