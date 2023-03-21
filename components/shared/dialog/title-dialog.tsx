import { RiCloseLine } from "react-icons/ri";
import { DialogProps } from "../utilities/dialog";
import { Button } from "../utilities/form";

export function TitleDialog({
  title,
  subtitle,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  onClose,
  hasBorder = true,
  isShowTooltipCloseButton = true,
  ...props
}: DialogProps & {
  title?: string;
  subtitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  hasBorder?: boolean;
  isShowTooltipCloseButton?: boolean;
}) {
  return (
    <div className={`text-accent ${className}`}>
      {onClose ? (
        <div className={`pb-2.5 flex-between-center ${hasBorder && "border-b"}`}>
          <div className="text-xl font-bold">{title}</div>
          <Button
            icon={<RiCloseLine />}
            iconClassName={`text-2xl text-gray-400 ${
              isShowTooltipCloseButton ? "hover:text-danger" : "hover:text-gray-700"
            }`}
            className="px-2 -mr-2"
            onClick={onClose}
            {...(isShowTooltipCloseButton && { tooltip: "Đóng" })}
          />
        </div>
      ) : (
        <>
          <div className={`text-xl font-bold text-center ${titleClassName}`}>{title}</div>
          <div className={`mt-2 mb-4 text-center text-gray-600 ${subtitleClassName}`}>
            {subtitle}
          </div>
        </>
      )}
    </div>
  );
}
