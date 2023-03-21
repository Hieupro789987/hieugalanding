import { useState } from "react";
import { RiCheckboxCircleLine, RiTimerLine } from "react-icons/ri";
import { useShopLayoutContext } from "../../../../layouts/shop-layout/providers/shop-layout-provider";
import { formatDate, parseNumber } from "../../../../lib/helpers/parser";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  ShopSubscription,
  ShopSubscriptionService,
  SUBSCRIPTION_PAYMENT_STATUS,
  SUBSCRIPTION_PLANS,
} from "../../../../lib/repo/shop-subscription.repo";
import {
  SubscriptionRequest,
  SubscriptionRequestService,
} from "../../../../lib/repo/subscription-request.repo";
import { Dialog } from "../../../shared/utilities/dialog/dialog";
import { Button, Field, Form, Radio } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function SubscriptionSettings() {
  const { subscriptionStatus } = useShopLayoutContext();
  const { member } = useAuth();
  const [openCreateRequestDialog, setOpenCreateRequestDialog] = useState(false);
  const [openRequest, setOpenRequest] = useState<SubscriptionRequest>();
  const toast = useToast();

  return (
    <>
      <div className="max-w-screen-sm pb-6 border-b border-gray-300">
        <div className="pl-1 mt-4 mb-4 text-lg font-semibold text-gray-600">
          Gói dịch vụ hiện tại
        </div>
        {member.subscription && (
          <div className="grid grid-cols-2 gap-1 p-3 text-gray-700 bg-white border border-gray-400 rounded">
            <div className="flex items-center">
              <div className="w-32">Gói cước</div>
              <div
                className={`status-text text-${
                  SUBSCRIPTION_PLANS.find((x) => x.value == member.subscription.plan)?.color
                }`}
              >
                {SUBSCRIPTION_PLANS.find((x) => x.value == member.subscription.plan)?.label}
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-32">Trạng thái</div>
              <div className={`status-label bg-${subscriptionStatus?.color}`}>
                {subscriptionStatus?.label}
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-32">Cước phí</div>
              <div className="font-semibold">{parseNumber(member.subscription.fee, true)}</div>
            </div>
            <div className="flex items-center">
              <div className="w-32">Thanh toán</div>
              <div className={`font-semibold`}>
                {
                  SUBSCRIPTION_PAYMENT_STATUS.find(
                    (x) => x.value == member.subscription?.request?.payment?.status
                  )?.label
                }
              </div>
            </div>
            {member.subscription.expiredAt && (
              <div className="flex items-center">
                <div className="w-32">Ngày hết hạn</div>
                <div className="font-semibold">
                  {formatDate(member.subscription.expiredAt, "dd-MM-yyyy")}
                </div>
              </div>
            )}
            {member.subscription.lockedAt && (
              <div className="flex items-center">
                <div className="w-32">Ngày bị khoá</div>
                <div className="font-semibold">
                  {formatDate(member.subscription.lockedAt, "dd-MM-yyyy")}
                </div>
              </div>
            )}
          </div>
        )}
        <Button
          className="mt-2 bg-white"
          outline
          text="Gia hạn gói dịch vụ"
          onClick={() => setOpenCreateRequestDialog(true)}
        />
      </div>
      <Form
        dialog
        title="Gia hạn gói dịch vụ"
        isOpen={openCreateRequestDialog}
        onClose={() => setOpenCreateRequestDialog(false)}
        onSubmit={async (data) => {
          try {
            const res = await SubscriptionRequestService.create({ data });
            setOpenCreateRequestDialog(false);
            setOpenRequest(res);
            return true;
          } catch (err) {
            toast.error("Yêu cầu gia hạn gói dịch vụ thất bại");
          }
        }}
      >
        <Field name="plan" label="Chọn gói dịch vụ">
          <Radio options={SUBSCRIPTION_PLANS.filter((x) => x.value != "FREE")} />
        </Field>
        <Form.Footer className="justify-end gap-3" />
      </Form>
      <Dialog
        isOpen={!!openRequest}
        onClose={() => setOpenRequest(null)}
        extraBodyClass="flex flex-col items-center text-center text-gray-700 p-8"
        width="400px"
      >
        <Dialog.Body>
          <div className="mb-1 text-xl font-bold text-success" style={{ color: "#AE2070" }}>
            Yêu cầu gia hạn thành công
          </div>
          <div className="text-sm">
            Hãy bấm vào nút bên dưới để chuyển hướng thanh toán qua ví điện tử MoMo
          </div>
          <div className="flex items-center mt-4">
            <img src="/assets/img/momo.png" className="w-24" />
            <div className="flex-1 pl-4">
              <div>
                Phí thanh toán:{" "}
                <span className="font-semibold">{parseNumber(openRequest?.amount, true)}</span>
              </div>
              {openRequest?.expiredAt && (
                <div>
                  Ngày hết hạn:{" "}
                  <span className="font-semibold">
                    {formatDate(openRequest?.expiredAt, "dd-MM-yyyy")}
                  </span>
                </div>
              )}
              <a
                className="block px-4 py-2 mt-2 font-semibold text-white rounded hover:opacity-90"
                target="_blank"
                href={openRequest?.payment.meta.payUrl}
                style={{ backgroundColor: "#AE2070" }}
              >
                Thanh toán MoMo
              </a>
            </div>
          </div>
        </Dialog.Body>
      </Dialog>
      <Card className="max-w-screen-lg">
        <DataTable<ShopSubscription>
          crudService={ShopSubscriptionService}
          order={{ createdAt: -1 }}
          filter={{ memberId: member?.id }}
          fetchingCondition={!!member}
        >
          <DataTable.Header>
            <DataTable.Title>Lịch sử đăng ký dịch vụ của {member?.shopName}</DataTable.Title>
            <DataTable.Buttons>
              <DataTable.Button outline isRefreshButton refreshAfterTask />
            </DataTable.Buttons>
          </DataTable.Header>

          <DataTable.Divider />

          <DataTable.Toolbar>
            <DataTable.Search className="h-12" />
            <DataTable.Filter></DataTable.Filter>
          </DataTable.Toolbar>

          <DataTable.Table className="mt-4">
            <DataTable.Column
              center
              label="Ngày bắt đầu"
              render={(item: ShopSubscription) => <DataTable.CellDate value={item.createdAt} />}
            />
            <DataTable.Column
              center
              label="Ngày hết hạn"
              render={(item: ShopSubscription) => <DataTable.CellDate value={item.expiredAt} />}
            />

            <DataTable.Column
              center
              label="Gói dịch vụ"
              render={(item: ShopSubscription) => (
                <DataTable.CellStatus value={item.plan} options={SUBSCRIPTION_PLANS} />
              )}
            />
            <DataTable.Column
              label="Thanh toán"
              render={(item: ShopSubscription) => (
                <DataTable.CellText
                  value={
                    <>
                      {item.fee ? (
                        <div>
                          <div className="text-gray-700">
                            Cước phí: {parseNumber(item.fee, true)}
                          </div>
                          <div
                            className={`flex items-center gap-1 ${
                              item.paymentStatus == "PENDING" ? "text-gray-600" : "text-success"
                            }`}
                          >
                            {item.paymentStatus == "PENDING" ? (
                              <>
                                <RiTimerLine />
                                <span>Chờ thanh toán</span>
                              </>
                            ) : (
                              <>
                                <RiCheckboxCircleLine />
                                <span>Đã thanh toán</span>
                              </>
                            )}
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  }
                />
              )}
            />
          </DataTable.Table>
          <DataTable.Pagination />
        </DataTable>
      </Card>
    </>
  );
}
