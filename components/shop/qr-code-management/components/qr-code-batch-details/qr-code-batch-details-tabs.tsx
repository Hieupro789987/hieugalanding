import { useState } from "react";
import { QRCodeBatchDetailsListTab } from "./qr-code-batch-details-list-tab";
import { QRCodeBatchDetailsScanHistoryListTab } from "./qr-code-batch-details-scan-history-list-tab";

interface QRCodeBatchDetailsTabsProps extends ReactProps {}

export function QRCodeBatchDetailsTabs({ ...props }: QRCodeBatchDetailsTabsProps) {
  const [selectedTab, setSelectedTab] = useState<string>("LIST");

  return (
    <>
      <div className="flex my-4">
        {TAB_LIST.map((tab, index) => (
          <div
            key={index}
            className={`font-bold text-lg border-gray-300 whitespace-nowrap first:pr-4 first:border-r-2 last:pl-4 hover:underline cursor-pointer ${
              selectedTab === tab.value && "text-primary"
            }`}
            onClick={() => setSelectedTab(tab.value)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {selectedTab === "LIST" ? (
        <QRCodeBatchDetailsListTab />
      ) : (
        <QRCodeBatchDetailsScanHistoryListTab />
      )}
    </>
  );
}

const TAB_LIST = [
  { label: "Danh sách QR Code", value: "LIST" },
  { label: "Lịch sử lượt quét QR Code", value: "HISTORY" },
];
