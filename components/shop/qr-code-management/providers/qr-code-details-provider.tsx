import { createContext, useContext } from "react";
import { useGetOneById } from "../../../../lib/hooks/useGetOneById";
import { QRCode, QRCodeService } from "../../../../lib/repo/qr-code/qr-code.repo";
import { Spinner } from "../../../shared/utilities/misc";

export const QRCodeDetailsContext = createContext<
  Partial<{
    QRCodeDetails: QRCode;
  }>
>({});

interface QRCodeDetailsProviderProps extends ReactProps {
  id: string;
}

export function QRCodeDetailsProvider({ id, ...props }: QRCodeDetailsProviderProps) {
  const [QRCodeDetails] = useGetOneById(id, QRCodeService);

  if (!QRCodeDetails) return <Spinner />;

  return (
    <QRCodeDetailsContext.Provider
      value={{
        QRCodeDetails,
      }}
    >
      {props.children}
    </QRCodeDetailsContext.Provider>
  );
}

export const useQRCodeDetailsContext = () => useContext(QRCodeDetailsContext);
