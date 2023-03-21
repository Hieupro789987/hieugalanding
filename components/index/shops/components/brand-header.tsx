import Link from "next/link";
import { useRef } from "react";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { Button } from "../../../shared/utilities/form/button";
import { Dropdown } from "../../../shared/utilities/popover/dropdown";
import { useShopsContext } from "../providers/shops-provider";

export function BrandHeader(props) {
  const ref = useRef();
  const lg = useScreen("lg");
  const { listMode } = useShopsContext();

  if (!lg) return <></>;

  return (
    <>
      <header className={`sticky top-0 max-w-lg w-full z-100`}>
        <div className="flex items-center justify-between w-full max-w-lg px-3 mx-auto text-white bg-gray-800 shadow h-14">
          <Link href={`/`}>
            <a className="">
              <img className="w-8 h-auto mx-auto sm:w-10" src="/assets/img/logo.png" />
            </a>
          </Link>
          <span className="flex-1 text-base font-semibold text-center uppercase">
            {listMode == "products" ? "Sản phẩm" : listMode == "shops" ? "Cửa hàng" : "Trang chủ"}
          </span>
        </div>
      </header>
    </>
  );
}
// export function Header(props) {
//   return (
//     <>
//       <header className={`fixed top-0 max-w-lg w-full z-100`}>
//         <div className="flex items-center justify-between w-full h-16 max-w-lg px-4 mx-auto text-white bg-gray-800 shadow">
//           <Link href={`/`}>
//             <a className="">
//               <img className="w-12 h-auto py-6 mx-auto sm:w-14" src="/assets/img/logo.png" />
//             </a>
//           </Link>
//           <span className="w-full text-lg font-semibold text-center uppercase">Trang chủ</span>
//           <div className="w-12"></div>
//         </div>
//       </header>
//     </>
//   );
// }
