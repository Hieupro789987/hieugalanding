import { Card } from "../../shared/utilities/misc";
import { WarehouseTable } from "../../shared/warehouse/warehouse-table";

export function WarehousePage() {
  return (
    <Card>
      <WarehouseTable type="shop"/>
    </Card>
  );
}
