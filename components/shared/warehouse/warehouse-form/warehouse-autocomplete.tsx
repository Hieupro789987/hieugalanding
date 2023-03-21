import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import ReactSelect, { createFilter, components } from "react-select";
import { useDebounce } from "../../../../lib/hooks/useDebounce";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { Select, SelectProps } from "../../utilities/form";
import { useWarehouseContext } from "../provider/warehouse-provider";

interface InputAutoCompleteProps extends FormControlProps {
  className?: string;
  options?: { label: string; value: string; options?: any }[];
  width?: number;
  onChange?: (val: any, options: any) => void;
  defaultValue?: any;
  value?: any;
  menuIsOpen?: boolean;
  autoFocus?: boolean;
  optionsPromise?: () => Promise<Option[]>;
  autocompletePromise?: ({
    id,
    search,
  }: {
    id?: string | string[];
    search?: string;
  }) => Promise<Option[]>;

  dependency?: any;
  multi?: boolean;
  valueCustom?: any;
  onInputChange?: (val: any) => void;
}

export function WarehouseAutoComplete({
  className = "",
  width,
  menuIsOpen,
  autoFocus,
  multi = false,
  ...props
}: InputAutoCompleteProps) {
  let [value, setValue] = useState<any>();
  let [allOptions, setAllOptions] = useState<Option[]>([]);
  let [loading, setLoading] = useState(false);
  let [options, setOptions] = useState<Option[]>(props.options);
  let [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 300);
  const { branchId } = useWarehouseContext();
  const { watch } = useFormContext();
  const productListWatch = watch("productInventoryList");

  useEffect(() => {
    if (!!props.defaultValue?.value) {
      setValue(props.defaultValue);
    } else {
      setValue(props.valueCustom);
    }
  }, [props.defaultValue, props.valueCustom]);

  useEffect(() => {
    if (props.value !== undefined) {
      if (options) {
        if (options?.length) {
          if (props.autocompletePromise) {
            let newAllOptions = allOptions.concat([
              ...options.filter((x) => !allOptions.find((y) => y.value == x.value)),
            ]);
            setAllOptions(newAllOptions);
          }
        }
      }
    }
  }, [props.value, options]);

  useEffect(() => {
    if (props.autocompletePromise) {
      setLoading(true);
    }
  }, []);

  useEffect(() => {
    if (props.value !== undefined && props.autocompletePromise) {
      setLoading(true);
      let id = props.value
        ? typeof props.value == "string"
          ? props.value
          : props.value.map((v) => (typeof v == "string" ? v : v.value))
        : "";
      let tasks = [];

      tasks.push(props.autocompletePromise({ search: "" }));
      if (typeof id == "string" ? id : id.length) {
        tasks.push(
          props.autocompletePromise({
            id,
          })
        );
      }

      Promise.all(tasks).then((res) => {
        let options = [...res[0]];
        if (res[1]?.length) {
          options = [...options, ...res[1].filter((x) => !options.find((y) => y.value == x.value))];
        }
        setOptions(options);
        setLoading(false);
      });
    }
  }, [props.value]);

  useEffect(() => {
    if (branchId && props.autocompletePromise && debouncedSearch.trim() != "") {
      setLoading(true);
      props.autocompletePromise({ search: debouncedSearch }).then((res) => {
        if (!!productListWatch && productListWatch?.length > 0) {
          let productIds = productListWatch
            .filter((item) => item.productId != "")
            .map((x) => x.productId);

          setOptions([...res].filter((item) => !productIds.includes(item.value)));
          setLoading(false);
        } else {
          setOptions(res);
          setLoading(false);
        }
      });
    } else {
      setOptions([]);
    }
  }, [debouncedSearch, branchId]);

  useEffect(() => {
    if (props.autocompletePromise && allOptions && value) {
      const option = allOptions.find(
        (x) => x.value == (typeof value == "string" ? value : value.value)
      );
      setValue(option);
    }
  }, [allOptions]);

  const onChange = (option: any | Option | Option[]) => {
    if (props.onChange) {
      if (option) {
        if (Array.isArray(option)) {
          props.onChange(
            option.map((x) => x.value),
            option
          );
        } else {
          props.onChange(option.value, { ...option });
        }
      } else {
        props.onChange(null, { ...option });
      }
    }

    setValue(option);
  };
  const onInputChange = (term: string) => {
    if (props.autocompletePromise) {
      setSearch(term);
    }
  };

  const SelectComponent: any = ReactSelect;

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: 5,
    }),
    control: () => ({
      width: width,
      display: "flex",
      gap: "0 2px",
    }),
    menu: (base) => ({
      ...base,
    }),
    menuList: (base) => ({
      ...base,
      "::-webkit-scrollbar": {
        width: "5px",
        height: "0px",
      },
      "::-webkit-scrollbar-track": {
        background: "#f1f1f1",
      },
      "::-webkit-scrollbar-thumb": {
        background: "#888",
      },
      "::-webkit-scrollbar-thumb:hover": {
        background: "#555",
      },
    }),
    valueContainer: (defaultStyles: any) => {
      return {
        ...defaultStyles,
        padding: "5px",
        paddingLeft: "4px",
        display: "flex",
        justifyContent: "start",
      };
    },

    singleValue: (provided, state) => {
      const transition = "opacity 300ms";
      const color = "black";
      const whiteSpace = "break-spaces";
      const textOverflow = "ellipsis";

      return {
        ...provided,
        color,
        transition,
        whiteSpace,
        textOverflow,
        ...{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          "-webkit-line-clamp": "2",
          "line-clamp": "2",
          "-webkit-box-orient": "vertical",
        },
      };
    },
  };

  return (
    <SelectComponent
      options={options}
      styles={customStyles}
      isDisabled={!!props.defaultValue?.value}
      components={{
        ...(!debouncedSearch && { IndicatorsContainer: () => null, Menu: () => null }),
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null,
      }}
      isLoading={loading}
      className="text-sm text-left"
      placeholder=""
      autoFocus={autoFocus}
      isSearchable={true}
      onInputChange={onInputChange}
      isClearable={true}
      menuIsOpen={menuIsOpen}
      noOptionsMessage={() => "Không tìm thấy"}
      LoadingMessage={() => "Đang tìm kiếm..."}
      value={value}
      filterOption={props.autocompletePromise ? (option: Option) => true : filterOption}
      onChange={onChange}
    />
  );
}

const filterOption = createFilter({
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
  matchFrom: "any",
  stringify: (option: Option) => `${option.label} ${option.value}`,
});
