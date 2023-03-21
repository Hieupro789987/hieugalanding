import { GetGlobalCustomerToken } from "../../graphql/auth.link";
import { GraphRepository } from "../graph.repo";
import { ServiceReservation, ServiceReservationService } from "./service-reservation.repo";

export interface DraftReservation {
  serviceReservation: ServiceReservation;
  invalid: Boolean;
  invalidReason: String;
}

export class DraftReservationRepository extends GraphRepository {
  shortFragment: string = this.parseFragment(`
    serviceReservation {
      ${ServiceReservationService.fullFragment}
    }: ServiceReservation
    invalid: Boolean
    invalidReason: String
  `);
  fullFragment: string = this.parseFragment(`
    serviceReservation{
      ${ServiceReservationService.fullFragment}
    }: ServiceReservation
    invalid: Boolean
    invalidReason: String
  `);

  async generateDraftServiceReservation(data: any) {
    return this.mutate({
      mutation: `
      generateDraftServiceReservation(data: $data ) {
          ${this.fullFragment}
        }
      `,
      variablesParams: `($data: GenerateDraftServiceReservationInput!
        )`,
      token: GetGlobalCustomerToken(),
      options: {
        variables: {
          data,
        },
      },
    }).then((res) => res.data.g0);
  }
}

export const DraftReservationService = new DraftReservationRepository();
