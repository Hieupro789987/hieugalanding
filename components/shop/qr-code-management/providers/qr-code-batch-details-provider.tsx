import { createContext, useContext } from "react";
import { useGetOneById } from "../../../../lib/hooks/useGetOneById";
import { QRCodeStage, QRCodeStageService } from "../../../../lib/repo/qr-code/qr-code-stage.repo";
import { Spinner } from "../../../shared/utilities/misc";

export const QRCodeBatchDetailsContext = createContext<
  Partial<{
    QRCodeBatchDetails: QRCodeStage;
    onCloseDialog: () => void;
  }>
>({});

interface QRCodeBatchDetailsProviderProps extends ReactProps {
  id: string;
  onCloseDialog: () => void;
}

export function QRCodeBatchDetailsProvider({
  id,
  onCloseDialog,
  ...props
}: QRCodeBatchDetailsProviderProps) {
  const [QRCodeBatchDetails] = useGetOneById(id, QRCodeStageService);

  if (!QRCodeBatchDetails) return <Spinner />;

  return (
    <QRCodeBatchDetailsContext.Provider value={{ QRCodeBatchDetails, onCloseDialog }}>
      {props.children}
    </QRCodeBatchDetailsContext.Provider>
  );
}

export const useQRCodeBatchDetailsContext = () => useContext(QRCodeBatchDetailsContext);
