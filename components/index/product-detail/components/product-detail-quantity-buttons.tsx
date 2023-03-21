import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { HiMinus, HiMinusSm, HiPlus } from "react-icons/hi";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Button } from "../../../shared/utilities/form";

interface Props extends ReactProps {
  value: number;
  onChange: (number) => any;
  disabled?: boolean;
  maxValue?: number;
}
export function ProductDetailQuantityButtons({
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
    // <div className={`flex items-center justify-center font-semibold ${className}`}>
    //   <i
    //     className={`text-5xl text-gray-500 cursor-pointer font-semibold ${
    //       value == 1 ? "opacity-50 pointer-events-none" : ""
    //     } ${disabled ? "pointer-events-none opacity-40" : ""}`}
    //     onClick={() => handleClick(-1)}
    //   >
    //     <HiMinusSm />
    //   </i>
    //   <div className={`text-3xl font-semibold px-3 text-gray-700`}>{value}</div>
    //   <i
    //     className={`text-5xl cursor-pointer font-semibold ${
    //       disabled ? "pointer-events-none opacity-40 text-gray-500" : "text-primary"
    //     }`}
    //     onClick={() => handleClick(1)}
    //   >
    //     <HiPlus />
    //   </i>
    // </div>
    <div className="flex flex-row items-center">
      <Button
        className={`px-[10px] mr-4 border rounded-full  lg:border-none border-gray-500   ${
          value == 1 ? "opacity-50 pointer-events-none" : ""
        }  ${disabled ? "pointer-events-none opacity-40" : ""}`}
        textAccent
        hoverAccent
        icon={<AiOutlineMinus />}
        onClick={() => handleClick(-1)}
      />
      <div className="mr-3 text-xl font-semibold text-accent">{value}</div>

      <Button
        className={`px-[10px] border rounded-full lg:border-none border-gray-500 hover:border-primary hover:text-primary ${
          disabled ? "pointer-events-none opacity-40 text-gray-500" : "text-primary"
        }`}
        textAccent
        hoverAccent
        icon={<AiOutlinePlus />}
        onClick={() => handleClick(1)}
      />
    </div>
  );
}
