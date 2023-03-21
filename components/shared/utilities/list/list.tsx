import { cloneDeep } from "lodash";
import { Children, useEffect, useMemo, useState } from "react";
import { RiAddFill, RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { useMemoCompare } from "../../../../lib/hooks/useMemoCompare";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { BaseModel, CrudRepository } from "../../../../lib/repo/crud.repo";
import { Button, Form } from "../form";
import { Spinner } from "../misc";

interface Props<T extends BaseModel = any> extends ReactProps {
  selectedItem: T;
  crudService?: CrudRepository<Partial<T>>;
  displayName?: string;
  onSelect?: (item?: T) => any;
  onChange?: (item?: T) => any;
  hasAll?: any;
  filter?: any;
  order?: any;
  renderItem: (item: T, selected: boolean) => JSX.Element;
  onLoadItems?: (items: T[]) => any;
  hasAdd?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  saveDisabled?: boolean;
  deleteDisabled?: boolean;
  formWidth?: string | number;
  loadAll?: () => Promise<T[]>;
  customDefaultValues?: any;
  description?: any;
  autoSelect?: boolean;
  selectAllValue?: any;
  hasTitle?: boolean;
  notEditItemIds?: string[];
}
export function List<T extends BaseModel = any>({
  selectedItem,
  crudService,
  onSelect,
  onChange,
  hasAll = true,
  filter = {},
  order = { _id: 1 },
  renderItem,
  onLoadItems,
  hasAdd = true,
  hasUpdate = true,
  hasDelete = true,
  saveDisabled = false,
  deleteDisabled = false,
  className = "",
  style = {},
  customDefaultValues = null,
  description,
  autoSelect = true,
  selectAllValue,
  hasTitle = true,
  notEditItemIds = [],
  ...props
}: Props<T>) {
  const [items, setItems] = useState<T[]>();
  const [openItem, setOpenItem] = useState<T>(undefined);
  const alert = useAlert();
  const toast = useToast();
  const latestOrder = useMemoCompare(order);
  const latestFilter = useMemoCompare(filter);
  const displayName = useMemo(() => props.displayName || crudService?.displayName, [
    crudService,
    props.displayName,
  ]);

  useEffect(() => {
    loadAll();
  }, [latestOrder, latestFilter]);

  useEffect(() => {
    if (!hasAll && items?.length && !selectedItem && autoSelect) {
      onSelect(items[0]);
    }
    if (items) {
      if (onLoadItems) onLoadItems(items);
    }
  }, [selectedItem, items, autoSelect]);

  const loadAll = () => {
    if (props.loadAll) {
      props.loadAll().then((res) => {
        setItems(res);
      });
    } else {
      crudService
        .getAll({
          query: {
            limit: 0,
            filter: latestFilter,
            order: latestOrder,
          },
          toast,
        })
        .then((res) => {
          setItems(res.data as T[]);
        });
    }
  };

  const listForm = useMemo(
    () =>
      Children.map(props.children, (child) =>
        child?.type?.displayName === "ListForm" ? child : null
      ),
    []
  );

  const [defaultValues, setDefaultValues] = useState(null);

  useEffect(() => {
    if (openItem) {
      crudService.getOne({ id: openItem.id }).then((res) => {
        setDefaultValues(cloneDeep(res));
      });
    } else if (openItem === null) {
      setDefaultValues({});
    } else {
      setDefaultValues(undefined);
    }
  }, [openItem]);

  // const defaultValues = useMemo(() => (openItem ? cloneDeep(openItem) : openItem === null ? {} : undefined), [
  //   openItem,
  // ]);

  if (!items) return <Spinner />;

  return (
    <>
      <div className={`flex flex-col rounded ${className}`} style={style}>
        <div
          className={`flex items-center border-b border-gray-300 pb-2.5 ${!hasTitle && "hidden"}`}
        >
          <h6 className="flex flex-col justify-center">
            <div className="font-bold text-gray-600 uppercase">{displayName}</div>
            <div
              className={`text-xs text-gray-500 ${
                typeof description === "string" && description?.length === 0 && "hidden"
              }`}
            >
              Tổng {items?.length} {displayName}
            </div>
          </h6>
          {hasAdd && (
            <Button
              primary
              className="px-0 ml-auto w-11"
              iconClassName="text-2xl"
              icon={<RiAddFill />}
              tooltip={`Thêm ${displayName}`}
              onClick={() => {
                setOpenItem(null);
              }}
              disabled={saveDisabled}
            />
          )}
        </div>
        <div className="flex flex-col flex-1 w-full mt-4 gap-y-2">
          {[
            ...(hasAll === true ? ([{ id: null }] as T[]) : !!hasAll?.id ? [hasAll] : []),
            ...items,
          ].map((item) => (
            <div
              key={item.id}
              className={`p-2 border rounded min-h-14 ${
                (item.id == null && !selectedItem) || item.id == selectedItem?.id
                  ? "bg-primary-light border-primary"
                  : "border-gray-400 hover:border-primary"
              } group flex items-center cursor-pointer transition-colors`}
              onClick={() => onSelect(item.id ? item : null)}
            >
              <div className="flex-1">
                {renderItem(
                  item,
                  (item.id == null && !selectedItem) || item.id == selectedItem?.id
                )}
              </div>
              {!!item.id && item.name !== "Tất cả" && !notEditItemIds.includes(item.id) && (
                <div className="flex ml-auto grow-0 shrink-0">
                  {hasUpdate && (
                    <Button
                      className="px-0 w-7"
                      icon={<RiEdit2Line />}
                      tooltip="Chỉnh sửa"
                      onClick={() => {
                        setOpenItem(item);
                      }}
                      isLoading={
                        openItem !== undefined && openItem?.id == item.id && !defaultValues
                      }
                      disabled={saveDisabled}
                    />
                  )}
                  {hasDelete && (
                    <Button
                      hoverDanger
                      className="px-0 w-7"
                      icon={<RiDeleteBin6Line />}
                      tooltip="Xoá"
                      disabled={deleteDisabled}
                      onClick={async () => {
                        await alert.danger(
                          `Xoá ${displayName}`,
                          `Bạn có chắc chắn muốn xoá ${displayName}?`,
                          `Xoá ${displayName}`,
                          async () => {
                            return crudService
                              .delete({ id: item.id })
                              .then((res) => {
                                onSelect(hasAll ? null : items[0] || null);
                                loadAll();
                                return true;
                              })
                              .catch((err) => {
                                toast.error(err.message);
                                return false;
                              });
                          }
                        );
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Form
        grid
        dialog
        title={`${openItem ? "Chỉnh sửa" : "Tạo"} ${displayName.toLocaleLowerCase()}`}
        defaultValues={
          openItem && !!customDefaultValues
            ? { ...defaultValues, ...customDefaultValues }
            : defaultValues
        }
        isOpen={defaultValues}
        onClose={() => {
          setOpenItem(undefined);
        }}
        width={props.formWidth}
        onSubmit={async (data) => {
          await crudService.createOrUpdate({ id: openItem?.id, data, toast });
          setOpenItem(undefined);
          loadAll();
        }}
      >
        {listForm}
        <Form.Footer />
      </Form>
    </>
  );
}

const ListForm = ({ children }) => children;
ListForm.displayName = "ListForm";
List.Form = ListForm;
