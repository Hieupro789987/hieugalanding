import { RiCloseLine } from "react-icons/ri";
import { useScreen } from "../../../../../lib/hooks/useScreen";
import { Prescription } from "../../../../../lib/repo/prescription.repo";
import { Button, Label } from "../../../utilities/form";

interface QuestionPrescriptionProps extends ReactProps {
  prescriptions: Prescription[];
  onDelete?: (index: number) => void;
  onDeleteAll?: () => void;
  isEdit?: boolean;
  onEditClick?: (index: number) => void;
}

export function QuestionPrescription({
  prescriptions,
  onDelete,
  onDeleteAll,
  isEdit = false,
  onEditClick,
  ...props
}: QuestionPrescriptionProps) {
  return (
    <>
      <div className="flex gap-2">
        <Label text="Toa thuốc của chuyên gia" className="w-auto text-base" />
        {isEdit && (
          <Button
            text="Xóa hết"
            hoverDanger
            className="-mt-1 text-sm underline cursor-pointer text-slate-500"
            onClick={() => onDeleteAll?.()}
          />
        )}
      </div>
      <QuestionPrescriptionList
        isEdit={isEdit}
        prescriptions={prescriptions}
        onDelete={onDelete}
        onEditClick={onEditClick}
      />
    </>
  );
}

interface QuestionPrescriptionListProps extends ReactProps {
  prescriptions: Prescription[];
  onDelete: (index: number) => void;
  isEdit?: boolean;
  onEditClick?: (index: number) => void;
}

export function QuestionPrescriptionList({
  prescriptions,
  onDelete,
  isEdit = false,
  onEditClick,
  ...props
}: QuestionPrescriptionListProps) {
  return (
    <div className="flex-cols gap-2.5 items-stretch">
      {prescriptions.map((prescription, index) => (
        <QuestionPrescriptionItem
          key={index}
          index={index}
          isEdit={isEdit}
          prescription={prescription}
          onDelete={onDelete}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
}

interface QuestionPrescriptionItemProps extends ReactProps {
  index: number;
  prescription: Prescription;
  onDelete: (index: number) => void;
  isEdit?: boolean;
  onEditClick?: (index: number) => void;
}

function QuestionPrescriptionItem({
  index,
  prescription,
  onDelete,
  isEdit = false,
  onEditClick,
  ...props
}: QuestionPrescriptionItemProps) {
  const screenLg = useScreen("lg");

  return (
    <div
      className={`flex justify-between gap-2 py-2 pl-4 pr-0 border rounded cursor-pointer bg-white/90 border-slate-300 ${
        isEdit && "hover:border-primary"
      }`}
    >
      <div className="flex-1 w-full text-sm leading-6" onClick={() => onEditClick?.(index)}>
        <div className="text-base font-semibold">{prescription.name}</div>
        <div className="">{`Số lượng: ${prescription.dose}`}</div>
        {prescription.note ? (
          <div className="">{`Ghi chú: ${prescription.note}`}</div>
        ) : (
          <>{!screenLg && <div className="">Ghi chú: Không</div>}</>
        )}
      </div>
      {isEdit && (
        <div className="w-10 flex-center grow-0 shrink-0" onClick={() => onDelete?.(index)}>
          <Button
            icon={<RiCloseLine />}
            iconClassName="text-2xl"
            className="text-gray-400 hover:text-danger"
            hoverDanger
            tooltip="Xóa"
          />
        </div>
      )}
    </div>
  );
}
