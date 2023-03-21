import { GraphRepository } from "./graph.repo";

export interface Prescription {
  name: string;
  amount: number;
  dose: string;
  note: string;
}

export class PrescriptionRepository extends GraphRepository {
  fullFragment: string = this.parseFragment(`
    name: String!
    amount: Int
    dose: String
    note: String
  `);
}
export const PrescriptionService = new PrescriptionRepository();
