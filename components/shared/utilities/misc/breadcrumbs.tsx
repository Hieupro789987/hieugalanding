import Link from "next/link";
import { Fragment } from "react";
import { AiOutlineRight } from "react-icons/ai";

export interface BreadCrumb {
  href?: string;
  label: string;
}

interface PropsType extends ReactProps {
  breadcrumbs: BreadCrumb[];
}

export function BreadCrumbs({ breadcrumbs, className = "", ...props }: PropsType) {
  const truncateLabel = (label: string) => {
    if (!label) return "";

    if (label.split(" ").length > 10) {
      return `${label.split(" ").slice(0, 10).join(" ")}...`;
    }

    return label;
  };

  return (
    <div
      className={`m-0 text-sm font-semibold main-container flex flex-row items-center overflow-hidden w-full ${className}`}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <Fragment key={index}>
          {breadcrumb.href ? (
            <div className="flex items-center grow-0 shrink-0">
              <Link href={breadcrumb.href}>
                <a className="">
                  <div className="lowercase transition-all duration-200 first-letter:uppercase text-primary-dark hover:text-primary hover:underline whitespace-nowrap">
                    {breadcrumb.label}
                  </div>
                </a>
              </Link>
              <div className="px-1.5">
                <AiOutlineRight className="font-semibold text-gray-500" />
              </div>
            </div>
          ) : (
            <div className="flex-1 lowercase text-accent whitespace-nowrap first-letter:uppercase">
              {truncateLabel(breadcrumb.label)}
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
