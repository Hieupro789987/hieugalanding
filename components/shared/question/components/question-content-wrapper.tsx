import Link from "next/link";
import { Fragment } from "react";

export function QuestionWrapper({
  href,
  targetBlank = false,
  ...props
}: ReactProps & { href: string; targetBlank?: boolean }) {
  const Wrapper: any = href ? Link : Fragment;

  return (
    <Wrapper {...(href ? { href: `${href}`, shallow: false } : {})}>
      <a {...(targetBlank && { target: "_blank" })}>
        <div className={`${href && "cursor-pointer"}`}>{props.children}</div>
      </a>
    </Wrapper>
  );
}
