import { GetGlobalCustomerToken } from "../../graphql/auth.link";
import { BaseModel, CrudRepository } from "../crud.repo";
import { MemberService } from "../member.repo";
import { Place, PlaceService } from "../place.repo";
import { ShopBranch, ShopBranchService } from "../shop-branch.repo";
import {
  AdditionalServiceItem,
  AdditionalServiceItemService,
} from "./additional-service-item.repo";
import { Service, ServicePriceType, ShopServiceService } from "./service.repo";
import {
  ShopServiceSpecialist,
  ShopServiceSpecialistService,
} from "./shop-service-specialist.repo";

export type UpdatedTotalPrice = "RESERVED" | "UPDATED" | "CONFIRMED" | "COMPLETED" | "CANCELED";

export interface HistoryServiceReservation {
  date: string;
  name: string;
  type: UpdatedTotalPrice;
  updatedTotalPrice: number;
}

export interface ServiceReservation extends BaseModel {
  id: string;
  createdAt: string;
  updatedAt: string;
  code: string;
  status: ServiceReservationStatus;
  memberId: string;
  serviceId: string;
  service: Service;
  name: string;
  shopServiceCategoryId: string;
  serviceTagIds: string[];
  servicePriceType: ServicePriceType;
  totalPrice: number;
  images: string[];
  reservationDate: string;
  addressType: AddressType;
  reserverId: string;
  reserverFullname: string;
  reserverInternationalPhone: string;
  reservationShopBranchId: string;
  reservationShopBranch: ShopBranch;
  reservationAddress: Place;
  note: string;
  paymentMethod: string;
  shopServiceSpecialistId: string;
  shopServiceSpecialist: ShopServiceSpecialist;
  additionalServices: AdditionalServiceItem[];
  logs: HistoryServiceReservation[];
}

export class ServiceReservationRepository extends CrudRepository<ServiceReservation> {
  apiName: string = "ServiceReservation";
  displayName: string = "Lịch hẹn";
  shortFragment: string = this.parseFragment(`
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      code: String
      status: String
      memberId: String
      member {
        code shopName
      }: Member
      serviceId: String
      service{
        price minAdvanceReservationInDay shopServiceSpecialistIds
      }: Service
      name: String
      shopServiceCategoryId: String
      serviceTagIds: [String]
      servicePriceType: String
      totalPrice: Float
      images: [String]
      reservationDate: DateTime
      addressType: String
      reserverId: String
      reserverFullname: String
      reserverInternationalPhone: String
      reservationShopBranchId: String
      reservationShopBranch{
        ${ShopBranchService.fullFragment}
      }:ShopBranch
      reservationAddress{
        ${PlaceService.fullFragment}
      }: Place
      note: String
      paymentMethod: String
      shopServiceSpecialistId: String
      shopServiceSpecialist{
        id name
      }: [ShopServiceSpecialist]
      additionalServices{
        ${AdditionalServiceItemService.shortFragment}
      }: [AdditionalServiceItem]
  `);
  fullFragment: string = this.parseFragment(`
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      code: String
      status: String
      memberId: String
      member {
        ${MemberService.fullFragment}
      }: Member
      serviceId: String
      service{
        ${ShopServiceService.fullFragment}
      }: Service
      name: String
      shopServiceCategoryId: String
      serviceTagIds: [String]
      servicePriceType: String
      totalPrice: Float
      images: [String]
      reservationDate: DateTime
      addressType: String
      reserverId: String
      reserverFullname: String
      reserverInternationalPhone: String
      reservationShopBranchId: String
      reservationShopBranch{
        ${ShopBranchService.fullFragment}
      }:ShopBranch
      reservationAddress{
        ${PlaceService.fullFragment}
      }: Place
      note: String
      paymentMethod: String
      shopServiceSpecialistId: String
      shopServiceSpecialist{
        ${ShopServiceSpecialistService.fullFragment}
      }: [ShopServiceSpecialist]
      additionalServices{
        ${AdditionalServiceItemService.fullFragment}
      }: [AdditionalServiceItem]
      logs{
        date: DateTime
        name: String
        type: String
        updatedTotalPrice: Float
      }: [HistoryServiceReservation]
  `);

  async generateServiceReservation(data) {
    return this.mutate({
      mutation: `
      generateServiceReservation(data: $data ) {
          ${this.fullFragment}
        }
      `,
      variablesParams: `($data: GenerateDraftServiceReservationInput!)`,
      token: GetGlobalCustomerToken(),
      options: {
        variables: {
          data,
        },
      },
    }).then((res) => res.data.g0);
  }

  async cancelServiceReservation(id: string) {
    return this.mutate({
      mutation: `
      cancelServiceReservation(id: $id ) {
          ${this.fullFragment}
        }
      `,
      variablesParams: `($id: ID!)`,
      token: GetGlobalCustomerToken(),
      options: {
        variables: {
          id,
        },
      },
    }).then((res) => res.data.g0);
  }

  async updateServiceReservationByGlobalCustomer(id: string, data: any) {
    return this.mutate({
      mutation: `
      updateServiceReservationByGlobalCustomer(id: $id, data: $data ) {
          ${this.fullFragment}
        }
      `,
      variablesParams: `($id: ID!
        $data: UpdateServiceReservationByGlobalCustomerInput!
        )`,
      token: GetGlobalCustomerToken(),
      options: {
        variables: {
          id,
          data,
        },
      },
    }).then((res) => res.data.g0);
  }

  async updateServiceReservationByMember(id: string, data: any) {
    return this.mutate({
      mutation: `
      updateServiceReservationByMember(id: $id, data: $data ) {
          ${this.fullFragment}
        }
      `,
      variablesParams: `($id: ID!
        $data: UpdateServiceReservationByMemberInput!
        )`,
      options: {
        variables: {
          id,
          data,
        },
      },
    }).then((res) => res.data.g0);
  }

  async confirmServiceReservationByMember(id: string): Promise<ServiceReservation> {
    return await this.mutate({
      mutation: `confirmServiceReservation(id: "${id}") {
        ${this.fullFragment}
      }`,
    }).then((res) => {
      return res.data["g0"];
    });
  }

  async completeServiceReservationByMember(id: string): Promise<ServiceReservation> {
    return await this.mutate({
      mutation: `completeServiceReservation(id: "${id}") {
        ${this.fullFragment}
      }`,
    }).then((res) => {
      return res.data["g0"];
    });
  }

  async cancelServiceReservationByMember(id: string): Promise<ServiceReservation> {
    return await this.mutate({
      mutation: `cancelServiceReservation(id: "${id}") {
        ${this.fullFragment}
      }`,
    }).then((res) => {
      return res.data["g0"];
    });
  }
}

export const ServiceReservationService = new ServiceReservationRepository();

export type ServiceReservationStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELED";

export const SERVICE_RESERVATION_STATUS_LIST: Option<ServiceReservationStatus>[] = [
  { value: "PENDING", label: "Chờ xác nhận", color: "warning" },
  { value: "CONFIRMED", label: "Đã xác nhận", color: "info" },
  { value: "COMPLETED", label: "Đã hoàn thành", color: "success" },
  { value: "CANCELED", label: "Đã hủy", color: "danger" },
];

export type AddressType = "AT_SHOP" | "AT_RESERVER";

export const SERVICE_RESERVATION_ADDRESS_TYPE_LIST: Option<AddressType>[] = [
  { value: "AT_SHOP", label: "Tại chi nhánh cửa hàng" },
  { value: "AT_RESERVER", label: "Tại địa chỉ khách hàng" },
];
