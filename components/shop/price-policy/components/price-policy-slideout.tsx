import { useRouter } from "next/router";
import { Slideout, SlideoutProps } from "../../../shared/utilities/dialog/slideout";
import { Spinner } from "../../../shared/utilities/misc";
import { TabGroup } from "../../../shared/utilities/tab/tab-group";
import {
  PricePolicyDetailProvider,
  usePricePolicyDetailContext,
} from "../providers/price-policy-detail-provider";
import { PricePolicyOverview } from "./price-policy-overview";
import { PricePolicyProductsTab } from "./price-policy-products";

interface Props extends SlideoutProps {
  pricePolicyId: string;
  onSubmit: () => void;
}
export function PricePolicySlideout({ pricePolicyId, onSubmit, ...props }: Props) {
  const router = useRouter();

  const onClose = () => {
    router.replace({ pathname: location.pathname, query: {} });
  };

  return (
    <PricePolicyDetailProvider id={pricePolicyId}>
      <Slideout width="86vw" maxWidth="1080px" isOpen={!!pricePolicyId} onClose={onClose}>
        <PricePolicyBody onSubmit={onSubmit} />
      </Slideout>
    </PricePolicyDetailProvider>
  );
}

function PricePolicyBody({ onSubmit }: { onSubmit: () => any }) {
  const { pricePolicy } = usePricePolicyDetailContext();

  if (!pricePolicy) return <Spinner />;

  return (
    <TabGroup
      name="pricePolicy"
      flex={false}
      className="px-4 bg-gray-50"
      tabClassName="h-16 py-4 text-base px-4"
      activeClassName="bg-white border-l border-r border-gray-300"
      bodyStyle={{
        height: "calc(100vh - 64px)",
      }}
    >
      <TabGroup.Tab label="Thông tin bảng giá">
        <PricePolicyOverview onSubmit={onSubmit} />
      </TabGroup.Tab>
      <TabGroup.Tab label="Sản phẩm áp dụng">
        <PricePolicyProductsTab />
      </TabGroup.Tab>
    </TabGroup>
  );
}
