import { useScreen } from "../../../lib/hooks/useScreen";

interface Props extends ReactProps {
  options: Option[];
  value: any;
  onChange: (val: any) => any;
  flex?: boolean;
  tabClassName?: string;
  defaultClassName?: string;
  activedClassName?: string;
  notActivedClassName?: string;
}
export function TabMaterial({
  options,
  value,
  onChange,
  flex = true,
  className = "",
  tabClassName = "",
  defaultClassName = "relative py-4 text-sm lg:text-base flex-center font-semibold cursor-pointer border-gray-300 whitespace-nowrap",
  activedClassName = "text-primary border-b-2 border-primary font-bold",
  notActivedClassName = "bg-white text-gray-400 hover:text-primary",
  ...props
}: Props) {
  const screenLg = useScreen("lg");
  return (
    <div className={`flex border-group ${className}`}>
      {options.map((option, index) => (
        <div
          key={option.value}
          className={`${flex ? "flex-1" : ""} ${defaultClassName} ${
            value == option.value ? activedClassName : notActivedClassName
          } ${tabClassName}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          {index !== 0 && <div className="absolute left-0 w-0.5 h-5 bg-gray-300 top-1/3" />}
        </div>
      ))}
    </div>
  );
}
