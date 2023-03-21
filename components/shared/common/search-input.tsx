import { useRouter } from "next/router";
import { useState } from "react";
import { RiSearchLine } from "react-icons/ri";
import { useDevice } from "../../../lib/hooks/useDevice";
import { Button, Field, Form, Input } from "../utilities/form";

interface SearchInputProps extends ReactProps {
  onValueChange?: (val: string) => void;
  onBlur?: Function;
  onClear?: Function;
}

export function SearchInput({ onValueChange, onBlur, onClear, ...props }: SearchInputProps) {
  const { isMobile } = useDevice();
  const router = useRouter();
  const { query } = router;
  const [search, setSearch] = useState("");

  const handleSubmitSearch = () => {
    let newQuery = { ...query };
    const searchTrim = search.trim();

    if (!!searchTrim) {
      newQuery = { ...newQuery, search: searchTrim };
    } else {
      delete newQuery["search"];
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Form onSubmit={handleSubmitSearch}>
      <Field name="" noError>
        <Input
          clearable
          placeholder="Tìm kiếm..."
          className="w-full py-1 border-none shadow lg:min-w-md"
          inputClassName="ml-2.5 w-full"
          suffix={
            <Button
              primary
              unfocusable
              submit
              icon={<RiSearchLine />}
              iconClassName="text-2xl"
              className="px-6 mr-1"
            />
          }
          value={query?.search || ""}
          onChange={(val) => {
            setSearch(val);
            onValueChange?.(val);

            if (!val) {
              let newQuery = { search, ...query };
              delete newQuery["search"];
              router.push(
                {
                  pathname: router.pathname,
                  query: newQuery,
                },
                undefined,
                { shallow: true }
              );
            }
          }}
          onClear={onClear}
          {...(onBlur && { onBlur })}
          autoFocus={isMobile ? true : false}
        />
      </Field>
    </Form>
  );
}
