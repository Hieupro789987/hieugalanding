interface Props extends ReactProps {
  options?: Option[];
  value: any;
  label?: string;
  type?: StatusLabelType;
  extraClassName?: string;
  maxContent?: boolean;
}
export type StatusLabelType = "label" | "text" | "light";
export function StatusLabel({
  value,
  options,
  type = "label",
  className = "px-2 py-1 text-xs font-semibold uppercase rounded whitespace-nowrap",
  extraClassName = "",
  maxContent,
  style = {},
  ...props
}: Props) {
  const option = options?.find((x) => x.value == value);
  const color = option?.color || "slate";
  const label = props.label || option?.label || "Không có";

  const longestText =
    maxContent &&
    options?.reduce((acc, curr) => {
      acc = acc.length <= curr.label.length ? curr.label : acc;
      return acc;
    }, "");

  return (
    <>
      <span
        className={`${className} ${extraClassName} ${maxContent && "inline-grid"} ${
          type == "label" ? `text-white` : `text-${color}`
        } ${
          type == "label" ? `bg-${color}` : type == "light" ? `bg-${color}-light` : "bg-transparent"
        }`}
        style={style}
      >
        {maxContent && (
          <span className="col-start-1 col-end-auto row-start-1 row-end-auto opacity-0 min-w-max">
            {longestText}
          </span>
        )}
        <span  className={maxContent && "col-start-1 col-end-auto row-start-1 row-end-auto text-center"}>
            {label}
          </span>
      </span>
    </>
  );
}
