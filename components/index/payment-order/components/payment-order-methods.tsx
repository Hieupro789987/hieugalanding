import { useEffect, useState } from "react";
import { FaCcVisa, FaMoneyBillAlt } from "react-icons/fa";
import { OrderService } from "../../../../lib/repo/order.repo";
import { Momo } from "../../../../public/assets/svg/svg";
import { Button } from "../../../shared/utilities/form";
import { usePaymentContext } from "../../payment/providers/payment-provider";

export function PaymentOrderMethods() {
  const { orderInput, setOrderInput } = usePaymentContext();
  const [paymentMethods, setPaymentMethods] = useState<
    { value: string; label: string; icon: JSX.Element }[]
  >([]);
  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "COD":
        return <FaMoneyBillAlt />;
      case "MOMO":
        return <Momo />;
      default:
        return <FaCcVisa />;
    }
  };
  const getPaymentLabel = (method) => {
    switch (method) {
      case "COD":
        return "Thanh toán khi nhận hàng";
      case "MOMO":
        return "Ví MoMo";
      default:
        return "";
    }
  };

  useEffect(() => {
    OrderService.getAllPaymentMethod().then((res) => {
      setPaymentMethods(
        res.map((x) => ({
          value: x.value,
          label: getPaymentLabel(x.value) || x.label,
          icon: getPaymentMethodIcon(x.value),
        }))
      );
    });
  }, []);

  return (
    <div className="p-5 my-8 bg-white rounded-md">
      <div className="mb-5 font-semibold text-accent">Phương thức thanh toán</div>
      {paymentMethods.map((item, index) => (
        <Button
          key={index}
          icon={item.icon}
          text={item.label}
          iconPosition="start"
          iconClassName="text-primary text-2xl mr-3"
          className="h-12 border border-primary"
          textAccent
          onClick={() => {
            setOrderInput({ ...orderInput, paymentMethod: item.value });
          }}
        />
      ))}
      {/* <Button
        icon={<AiOutlineCreditCard />}
        text="Tiền mặt"
        iconPosition="start"
        iconClassName="text-primary text-2xl mr-3"
        className="h-12 border border-primary"
        textAccent
      />
      <Button
        icon={<AiOutlineCreditCard />}
        text="COD"
        iconPosition="start"
        iconClassName="text-primary text-2xl mr-3"
        className="h-12 ml-4 border"
        textAccent
      /> */}
    </div>
  );
}
