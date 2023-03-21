import { GraphRepository } from "./graph.repo";

export interface Place {
  province: string;
  provinceId: string;
  district: string;
  districtId: string;
  ward: string;
  wardId: string;
  street: string;
  houseNumber: string;
  location: any;
  note: string;
}

export class PlaceRepository extends GraphRepository {
  fullFragment: string = this.parseFragment(`
    province: String
    provinceId: String
    district: String
    districtId: String
    ward: String
    wardId: String
    street: String
    houseNumber: String
    location: Mixed
    note: String
  `);
}

export const PlaceService = new PlaceRepository();
