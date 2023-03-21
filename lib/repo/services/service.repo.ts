import { Member, MemberService } from "./../member.repo";
import { BaseModel, CrudRepository } from "../crud.repo";
import { AdditionalService, AdditionalShopServiceService } from "./additional-service.repo";
import { ServiceTag, ServiceTagService } from "./service-tag.repo";
import { ShopServiceCategory, ShopServiceCategoryService } from "./shop-service-category.repo";
import {
  ShopServiceSpecialist,
  ShopServiceSpecialistService,
} from "./shop-service-specialist.repo";

export type ServicePriceType = "FIXED" | "CONTACT";

export interface Service extends BaseModel {
  isHidden: boolean;
  hiddenAt: string;
  slug: string;
  memberId: string;
  member: Member;
  name: string;
  shopServiceCategoryId: string;
  shopServiceCategory: ShopServiceCategory;
  serviceTagIds: string[];
  serviceTags: ServiceTag[];
  servicePriceType: ServicePriceType;
  price: number;
  description: string;
  images: string[];
  video: string;
  availableAddressType: string[];
  minAdvanceReservationInDay: number;
  canChangeReservation: boolean;
  minAdvanceReservationChangeInDay: number;
  canCancelReservation: boolean;
  minAdvanceReservationCancelInDay: number;
  canReserverSetSpecialist: boolean;
  shopServiceSpecialistIds: string[];
  additionalServices: AdditionalService[];
  shopServiceSpecialists: ShopServiceSpecialist[];
}

export class ServiceRepository extends CrudRepository<Service> {
  apiName: string = "Service";
  displayName: string = "Dịch vụ";
  shortFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isHidden: Boolean
    hiddenAt: DateTime
    slug: String
    memberId: String
    member{
      ${MemberService.fullFragment}
    }: Member
    name: String
    shopServiceCategoryId: String
    shopServiceCategory {
      ${ShopServiceCategoryService.fullFragment}
    }
    serviceTagIds: [String]
    serviceTags{
      ${ServiceTagService.fullFragment}
    }:[ServiceTag]
    servicePriceType: String
    price: Float
    description: String
    images: [String]
    video: String
    availableAddressType: [String]
    minAdvanceReservationInDay: Int
    canChangeReservation: Boolean
    minAdvanceReservationChangeInDay: Int
    canCancelReservation: Boolean
    minAdvanceReservationCancelInDay: Int
    canReserverSetSpecialist: Boolean
    shopServiceSpecialistIds: [String]
    additionalServices{
      ${AdditionalShopServiceService.fullFragment}
    }: [AdditionalService]
    shopServiceSpecialists{
      ${ShopServiceSpecialistService.fullFragment}
    }: [ShopServiceSpecialist]
  `);
  fullFragment: string = this.parseFragment(`
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    isHidden: Boolean
    hiddenAt: DateTime
    slug: String
    memberId: String
    member{
      ${MemberService.fullFragment}
    }: Member
    name: String
    shopServiceCategoryId: String
    shopServiceCategory {
      ${ShopServiceCategoryService.fullFragment}
    }
    serviceTagIds: [String]
    serviceTags{
      ${ServiceTagService.fullFragment}
    }:[ServiceTag]
    servicePriceType: String
    price: Float
    description: String
    images: [String]
    video: String
    availableAddressType: [String]
    minAdvanceReservationInDay: Int
    canChangeReservation: Boolean
    minAdvanceReservationChangeInDay: Int
    canCancelReservation: Boolean
    minAdvanceReservationCancelInDay: Int
    canReserverSetSpecialist: Boolean
    shopServiceSpecialistIds: [String]
    additionalServices{
      ${AdditionalShopServiceService.fullFragment}
    }: [AdditionalService]
    shopServiceSpecialists{
      ${ShopServiceSpecialistService.fullFragment}
    }: [ShopServiceSpecialist]
  `);

  async serviceMarkHidden(id: string, isHidden: Boolean) {
    return this.mutate({
      mutation: `
      serviceMarkHidden(id: "${id}",isHidden: ${isHidden} ) {
          ${this.fullFragment}
        }
      `,
    }).then((res) => res.data.g0);
  }
}

export const ShopServiceService = new ServiceRepository();
