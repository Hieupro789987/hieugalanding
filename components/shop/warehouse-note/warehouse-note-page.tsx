import { Card } from "../../shared/utilities/misc";
import { WarehouseNoteTable } from "../../shared/warehouse/warehouse-note/warehouse-note-table";

export function WarehouseNotePage() {
  return (
    <Card className="h-full">
      <WarehouseNoteTable type="shop" />
    </Card>
  );
}
