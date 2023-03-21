import { Place, PlaceService } from "./../place.repo";
import { QuestionCommentService } from "./../question/question-comment.repo";
import { QuestionService } from "./../question/question.repo";
import { BaseModel, CrudRepository } from "../crud.repo";
import { QuestionComment } from "../question/question-comment.repo";
import { Question } from "../question/question.repo";
import { GlobalCustomer, GlobalCustomerService } from "./global-customer.repo";

export interface AddressBook extends BaseModel {
  fullName: string;
  globalCustomerId: string;
  globalCustomer: GlobalCustomer;
  internationalPhone: string;
  address: Place;
  isDefault: Boolean;
}
export class AddressBookRepository extends CrudRepository<AddressBook> {
  apiName: string = "AddressBook";
  displayName: string = "sổ địa chỉ";
  shortFragment: string = this.parseFragment(`
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      fullName: String
      globalCustomerId: String
      globalCustomer{
        ${GlobalCustomerService.fullFragment}
      }: GlobalCustomer
      internationalPhone: String
      address{
        ${PlaceService.fullFragment}
      }: Place
      isDefault: Boolean
  `);
  fullFragment: string = this.parseFragment(`
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      fullName: String
      globalCustomerId: String
      globalCustomer{
        ${GlobalCustomerService.fullFragment}
      }: GlobalCustomer
      internationalPhone: String
      address{
        ${PlaceService.fullFragment}
      }: Place
      isDefault: Boolean
  `);
}

export const AddressBookService = new AddressBookRepository();
