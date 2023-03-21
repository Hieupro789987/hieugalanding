import { Spinner } from "../../shared/utilities/misc";
import { ShopsBody } from "./components/shops-body";
import { ShopsFooter } from "./components/shops-footer";
import { ShopsHeader } from "./components/shops-header";
import { ShopsProvider, useShopsContext } from "./providers/shops-provider";

export function ShopsPage() {
  return <ShopsComponent />;
}
export function ShopsComponent() {
  const { products } = useShopsContext();
  if (products === undefined) return <Spinner />;
  return (
    <div className="relative flex flex-col min-h-screen text-gray-700 bg-gray-200">
      <div className="relative flex flex-col w-full max-w-lg min-h-screen mx-auto bg-gray-100 shadow-md">
        <ShopsHeader />
        <ShopsBody />
        <ShopsFooter />
      </div>
    </div>
  );
}
