import { useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import { useAlert } from "../../../lib/providers/alert-provider";
import { ShopBranch } from "../../../lib/repo/shop-branch.repo";
import { ShopPageTitle } from "../../shared/shop-layout/shop-page-title";
import { Button } from "../../shared/utilities/form";
import { Spinner } from "../../shared/utilities/misc";
import { BranchForm } from "./components/branch-form";
import { BranchItem } from "./components/branch-item";
import { BranchesContext, BranchesProvider } from "./providers/branches-provider";

export function BranchesPage(props: ReactProps) {
  const [openBranch, setOpenBranch] = useState<ShopBranch>(undefined);
  const alert = useAlert();

  return (
    <BranchesProvider>
      <BranchesContext.Consumer>
        {({ branches, onRemoveBranch, onToggleBranch, loadBranches }) => (
          <>
            <div className="sticky top-16 z-10 flex items-center py-3 transition-all bg-gray-100 border-b border-gray-300">
              <ShopPageTitle title="Cửa hàng" subtitle="Quản lý các cửa hàng" />
              <Button
                outline
                className="w-12 h-12 px-0 ml-auto mr-2 bg-white"
                icon={<HiOutlineRefresh />}
                iconClassName="text-xl"
                onClick={() => loadBranches(true)}
              />
              <Button
                primary
                className="h-12"
                text="Thêm cửa hàng"
                onClick={() => setOpenBranch(null)}
              />
            </div>
            {!branches ? (
              <Spinner />
            ) : (
              <div className="flex flex-col mt-4 gap-y-2">
                {branches.map((branch) => (
                  <BranchItem
                    key={branch.id}
                    branch={branch}
                    onClick={() => {
                      setOpenBranch({
                        ...branch,
                        longitude: branch.location.coordinates[0],
                        latitude: branch.location.coordinates[1],
                      });
                    }}
                    onDeleteClick={async () => {
                      if (
                        !(await alert.danger(
                          `Xoá cửa hàng ${branch.name}`,
                          "Bạn có chắc chắn muốn xoá cửa hàng này không?"
                        ))
                      )
                        return;
                      await onRemoveBranch(branch);
                    }}
                    onToggleClick={() => {
                      onToggleBranch(branch);
                    }}
                  />
                ))}
              </div>
            )}
            <BranchForm
              openBranch={openBranch}
              isOpen={openBranch !== undefined}
              onClose={() => setOpenBranch(undefined)}
            />
          </>
        )}
      </BranchesContext.Consumer>
    </BranchesProvider>
  );
}
