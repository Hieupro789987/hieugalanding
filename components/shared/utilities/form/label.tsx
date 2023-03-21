import { FaAsterisk } from "react-icons/fa";
import { RiInformationFill } from "react-icons/ri";

export interface PropsType extends ReactProps {
  text: string;
  subText?: string;
  description?: string;
  htmlFor?: string;
  tooltip?: string;
  required?: boolean;
  error?: string;
  subTextClassName?: string;
}

export function Label({ className = "", subTextClassName = "", ...props }: PropsType) {
  return (
    <>
      <label
        htmlFor={props.htmlFor}
        className={`flex items-center text-sm w-full font-semibold min-h-6 pl-0.5 mb-1 text-gray-600 ${className}`}
      >
        <span className={`inline-flex items-center ${props.error ? "text-danger" : ""}`}>
          {props.text}
          {props.subText && (
            <span className={`ml-1 font-normal italic text-xs text-gray-500 ${subTextClassName}`}>
              {props.subText}
            </span>
          )}

          {props.required && (
            <sup className={`ml-1 text-[8px] ${props.error ? "text-danger" : "text-primary"}`}>
              <FaAsterisk />
            </sup>
          )}
          {props.tooltip && (
            <i
              className={`text-sm inline-block ml-1.5 ${
                props.error ? "text-danger" : "text-gray-500"
              }`}
              data-tooltip={props.tooltip}
            >
              <RiInformationFill />
            </i>
          )}
        </span>
        {props.children}
      </label>
      {props.description && (
        <div className="text-sm text-gray-600 pl-0.5 -mt-0.5 mb-1">{props.description}</div>
      )}
    </>
  );
}
