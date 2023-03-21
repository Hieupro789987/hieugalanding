import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { HiMinus, HiMinusSm, HiPlus } from "react-icons/hi";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../utilities/form";

interface Props extends ReactProps {
  value: number;
  onChange: (number) => any;
  disabled?: boolean;
  maxValue?: number;
}
export function ProductDetailsQuantityButtons({
  value,
  onChange,
  disabled,
  maxValue,
  className = "",
}: Props) {
  const toast = useToast();
  const handleClick = (offset) => {
    if (value + offset >= 1) {
      if (maxValue && value + offset > maxValue) {
        toast.info(`Sản phẩm này được chọn tối đa ${maxValue} sản phẩm`);
      } else {
        onChange(value + offset);
      }
    }
  };

  return (
    <div className={`flex items-center gap-2 lg:gap-0 justify-center font-semibold ${className}`}>
      <i
        className={`text-3xl rounded-full border border-gray-300 lg:border-none lg:text-5xl text-gray-500 cursor-pointer font-semibold ${
          value == 1 ? "opacity-50 pointer-events-none" : ""
        } ${disabled ? "pointer-events-none opacity-40" : ""}`}
        onClick={() => handleClick(-1)}
      >
        <HiMinusSm />
      </i>
      <div className={`text-xl lg:text-3xl font-semibold px-3 text-gray-700`}>{value}</div>
      <i
        className={`rounded-full border border-gray-300 lg:border-none text-3xl lg:text-5xl cursor-pointer font-semibold ${
          disabled ? "pointer-events-none opacity-40 text-gray-500" : "text-primary"
        }`}
        onClick={() => handleClick(1)}
      >
        <HiPlus />
      </i>
    </div>
  );
}
