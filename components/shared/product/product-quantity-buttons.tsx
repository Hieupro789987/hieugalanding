import { FaPlus, FaMinus } from "react-icons/fa";
import { Button } from "../utilities/form";

interface PropsType extends ReactProps {
  inputClassName?: string;
  isTextPrimaryButton?: boolean;
  buttonClassName?: string;
  quantity: number;
  hasToppings: boolean;
  onAdd: () => any;
  onMinus: () => any;
  onlyAdd?: boolean;
}
export function ProductQuantityButtons({
  className = "",
  buttonClassName = "",
  inputClassName = "",
  isTextPrimaryButton = true,
  quantity = 0,
  hasToppings,
  onAdd,
  onMinus,
  onlyAdd = false,
  ...props
}: PropsType) {
  return (
    <div className={`flex items-center ${className}`}>
      {!onlyAdd && (
        <>
          <Button
            unfocusable
            hoverDarken
            className={`px-2 h-6 transition ${
              quantity ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${buttonClassName}`}
            icon={<FaMinus />}
            onClick={(e) => {
              e.preventDefault();
              onMinus();
            }}
          />
          <div
            className={`w-6 font-bold h-5 text-lg text-center flex-center text-primary transition ${
              quantity ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${inputClassName}`}
          >
            {quantity}
          </div>
        </>
      )}
      <Button
        unfocusable
        textPrimary={isTextPrimaryButton}
        className={`px-2 h-6 ${buttonClassName}`}
        icon={<FaPlus />}
        onClick={(e) => {
          if (!hasToppings) {
            e.preventDefault();
            e.stopPropagation();
            onAdd();
          }
        }}
      />
    </div>
  );
}
