import Link from "next/link";
import { formatDate } from "../../../lib/helpers/parser";
import { Img } from "../utilities/misc";

interface Item {
  title: string;
  href: string;
  image: string;
  desc: string;
  date: string;
}

interface NewsCardProps extends ReactProps {
  item: Item;
}

export function NewsCard({ item, ...props }: NewsCardProps) {
  return (
    <Link href={item.href} shallow>
      <a>
        <div className="h-full p-1 transition-all duration-75 bg-white border border-gray-100 rounded shadow cursor-pointer group animate-emerge-up">
          <Img
            className="w-full border border-gray-100 rounded-t group-hover:brightness-90"
            ratio169
            src={item.image}
          />
          <div className="gap-0.5 px-2 break-words flex-cols mb-1.5">
            <div className="my-1.5 text-lg font-bold text-ellipsis-2 h-14 group-hover:text-primary">
              {item.title}
            </div>
            <div className="h-18 text-ellipsis-3">{item.desc}</div>
            <div className="mt-1.5 text-sm font-light text-accent">
              {formatDate(item.date, "dd/MM/yyyy")}
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
