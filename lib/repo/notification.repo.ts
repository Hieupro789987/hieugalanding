import { User } from "./user.repo";
import { BaseModel, CrudRepository } from "./crud.repo";
import { Customer } from "./customer.repo";
import { Expert, ExpertService } from "./expert/expert.repo";
import { GlobalCustomer, GlobalCustomerService } from "./global-customer/global-customer.repo";
import { Member } from "./member.repo";
import { Order } from "./order.repo";
import { Product } from "./product.repo";
import { QuestionComment, QuestionCommentService } from "./question/question-comment.repo";
import { Question, QuestionService } from "./question/question.repo";
import { Staff } from "./staff.repo";
import { SupportTicket } from "./support-ticket.repo";
import { Writer, WriterService } from "./writer/writer.repo";

export interface Notification extends BaseModel {
  target: string;
  userId: string;
  memberId: string;
  staffId: string;
  customerId: string;
  globalId: string;
  title: string;
  body: string;
  type: string;
  seen: Boolean;
  seenAt: string;
  image: string;
  sentAt: string;
  orderId: string;
  productId: string;
  link: string;
  ticketId: string;
  writerId: string;
  expertId: string;
  user: User;
  member: Member;
  staff: Staff;
  customer: Customer;
  globalCustomer: GlobalCustomer;
  order: Order;
  product: Product;
  ticket: SupportTicket;
  writer: Writer;
  expert: Expert;
  questionId: string;
  question: Question;
  commentId: string;
  comment: QuestionComment;

  interactorId: string;
  interactorType: string;
  interactorGlobalCustomer: GlobalCustomer;
  interactorExpert: Expert;
  interactWithId: string;
  interactWithType: string;
  interactWithGlobalCustomer: GlobalCustomer;
  interactWithExpert: Expert;
  interactionActionType: string;
}

export class NotificationRepository extends CrudRepository<Notification> {
  apiName: string = "Notification";
  displayName: string = "thông báo";
  shortFragment: string = this.parseFragment(
    `
    id: String
    createdAt: DateTime
    updatedAt: DateTime
    target: String
    userId: ID
    memberId: ID
    staffId: ID
    customerId: ID
    globalId: ID
    title: String
    body: String
    type: String
    seen: Boolean
    seenAt: DateTime
    image: String
    sentAt: DateTime
    orderId: ID
    productId: ID
    link: String
    ticketId: ID
    writerId: String
    expertId: String
    user{
      id 
    }: User
    member
    {
      id
    }: Member
    staff{
      id
    }: Staff
    customer{
      id
    }: Customer
    globalCustomer{
      ${GlobalCustomerService.fullFragment}
    }: GlobalCustomer
    order{
      id
    }: Order
    product{
      id
    }: Product
    ticket{
      id
    }: SupportTicket
    writer{
      ${WriterService.fullFragment}
    }: Writer
    expert{
      ${ExpertService.fullFragment}
    }: Expert
    questionId: String
    question{
      ${QuestionService.fullFragment}
    }: Question
    commentId: String
    comment{
      ${QuestionCommentService.fullFragment}
    }: QuestionComment


    interactorId: String;
    interactorType: String;
    interactorGlobalCustomer{
      id name
    }: GlobalCustomer;
    interactorExpert{
      id name
    }: Expert;
    interactWithId: String;
    interactWithType: String;
    interactWithGlobalCustomer{
      id name
    }: GlobalCustomer;
    interactWithExpert{
      id name
    }: Expert;
    interactionActionType: String;
    `
  );
  fullFragment: string = this.parseFragment(
    `
      id: String
      createdAt: DateTime
      updatedAt: DateTime
      target: String
      userId: ID
      memberId: ID
      staffId: ID
      customerId: ID
      globalId: ID
      title: String
      body: String
      type: String
      seen: Boolean
      seenAt: DateTime
      image: String
      sentAt: DateTime
      orderId: ID
      productId: ID
      link: String
      ticketId: ID
      writerId: String
      expertId: String
      user{
        id 
      }: User
      member
      {
        id
      }: Member
      staff{
        id
      }: Staff
      customer{
        id
      }: Customer
      globalCustomer{
        ${GlobalCustomerService.fullFragment}
      }: GlobalCustomer
      order{
        id
      }: Order
      product{
        id
      }: Product
      ticket{
        id
      }: SupportTicket
      writer{
        ${WriterService.fullFragment}
      }: Writer
      expert{
        ${ExpertService.fullFragment}
      }: Expert
      questionId: String
      question{
        ${QuestionService.fullFragment}
      }: Question
      commentId: String
      comment{
        ${QuestionCommentService.fullFragment}
      }: QuestionComment

      interactorId: String;
      interactorType: String;
      interactorGlobalCustomer{
        id name
      }: GlobalCustomer;
      interactorExpert{
        id name
      }: Expert;
      interactWithId: String;
      interactWithType: String;
      interactWithGlobalCustomer{
        id name
      }: GlobalCustomer;
      interactWithExpert{
        id name
      }: Expert;
      interactionActionType: String;
      `
  );
  async readNotification(id: string): Promise<Notification> {
    return await this.mutate({
      mutation: `readNotification(notificationId: "${id}") {
            ${this.fullFragment}
          }`,
    }).then((res) => {
      return res.data["g0"];
    });
  }
  async readAllNotification(): Promise<boolean> {
    return await this.mutate({
      mutation: `readAllNotification`,
      clearStore: true,
    }).then((res) => {
      return res.data["g0"];
    });
  }
}

export const NotificationService = new NotificationRepository();

