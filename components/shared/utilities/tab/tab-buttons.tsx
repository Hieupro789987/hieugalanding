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
export function TabButtons({
  options,
  value,
  onChange,
  flex = true,
  className = "",
  tabClassName = "",
  defaultClassName = "py-2 font-semibold text-sm border flex-center cursor-pointer border-gray-300 whitespace-nowrap",
  activedClassName = "bg-primary text-white hover:bg-primary-dark",
  notActivedClassName = "bg-white text-gray-600 hover:text-primary",
  ...props
}: Props) {
  return (
    <div className={`flex rounded border-group ${className}`}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${flex ? "flex-1" : ""} ${defaultClassName} ${
            value == option.value ? activedClassName : notActivedClassName
          } ${tabClassName}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}
