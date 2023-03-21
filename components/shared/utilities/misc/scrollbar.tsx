import { CSSProperties } from "react";
import Scrollbars, { ScrollbarProps } from "react-custom-scrollbars-2";

interface Props extends ScrollbarProps {
  height?: string | number;
  wrapperClassName?: string;
  innerClassName?: string;
  wrapperStyle?: CSSProperties;
  innerStyle?: CSSProperties;
}
export function Scrollbar({
  height = "auto",
  className = "",
  wrapperClassName = "",
  innerClassName = "",
  wrapperStyle = {},
  innerStyle = {},
  style = {},
  children,
  ...props
}: Props) {
  return (
    <div className={wrapperClassName} style={{ height, ...wrapperStyle }}>
      <Scrollbars {...props} className={className} style={style}>
        <div className={innerClassName}>{children}</div>
      </Scrollbars>
    </div>
  );
}
