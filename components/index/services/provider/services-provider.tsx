import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CrudProps, useCrud } from "../../../../lib/hooks/useCrud";
import { useQuery } from "../../../../lib/hooks/useQuery";
import { useScreen } from "../../../../lib/hooks/useScreen";
import { MemberService } from "../../../../lib/repo/member.repo";
import { Product, ProductService } from "../../../../lib/repo/product.repo";
import { ServiceTag, ServiceTagService } from "../../../../lib/repo/services/service-tag.repo";
import { Service, ShopServiceService } from "../../../../lib/repo/services/service.repo";

export const ServiceContext = createContext<
  Partial<{
    serviceTagCrud: CrudProps<ServiceTag>;
    serviceCrud: CrudProps<Service>;

    search: string;
    sortBy: string;

    serviceTags: ServiceTag[];
    serviceTagIds: string[];

    onFilterChange: (val: any) => void;
    onSubmit: () => any;

    tagIds: string[];
    countQuery: number;
  }> &
    Partial<CrudProps<Product>>
>({});

export function ServiceProvider(props) {
  const search: string = useQuery("search");
  const router = useRouter();
  const sortBy: string = useQuery("sortBy");

  const serviceTagQuery: string = useQuery("serviceTag");
  const serviceTagIds: string[] = useMemo(
    () => (serviceTagQuery ? JSON.parse(serviceTagQuery) : []),
    [serviceTagQuery]
  );
  const [tagIds, setTagIds] = useState<string[]>(
    serviceTagQuery ? JSON.parse(serviceTagQuery) : []
  );
  const isLg = useScreen("lg");
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const [params, setParams] = useState<any>({
    search: search,
    serviceTag: serviceTagIds.length > 0 ? JSON.stringify(serviceTagIds) : JSON.stringify(tagIds),
    sortBy: sortBy || "latest",
  });

  const [serviceTags, setServiceTags] = useState<ServiceTag[]>();

  const serviceTagCrud = useCrud(ServiceTagService, { limit: 0, order: { createdAt: -1 } });
  const loadDone = useMemo(() => !!serviceTagCrud.items, [serviceTagCrud.items]);

  const handleFilterChange = (val: any) => {
    const check = Object.keys(val).find((x) => x == "serviceTag");

    if (!!check) {
      setTagIds(val["serviceTag"].length > 0 ? JSON.parse(val["serviceTag"]) : []);
    }

    const newObj = { ...params, ...val };
    const objFilter = {};

    Object.keys(newObj).forEach((key) => {
      if (newObj[key]) {
        objFilter[key] = newObj[key];
      }
    });

    setParams(objFilter);
  };

  const handleSubmit = () => {
    router.push({
      pathname: router.pathname,
      query: search ? { ...params, search: search } : params,
    });

    setIsSubmit(true);
  };

  const countQuery = useMemo(() => {
    if (sortBy === "latest") {
      return Object.keys(router.query).length - 1;
    }
    return Object.keys(router.query).length;
  }, [router.query]);

  const filter = () => {
    let queryObj = {
      limit: 12,
      filter: {},
      page: 1,
      search,
      order: {},
    };
    if (sortBy) {
      switch (sortBy) {
        case "latest":
          queryObj.order = { _id: -1 };
          break;
        case "priceAsc":
          queryObj.order = { price: 1 };
          queryObj.filter = { ...queryObj.filter, ...{ servicePriceType: "FIXED" } };
          break;
        case "priceDesc":
          queryObj.order = { price: -1 };
          queryObj.filter = { ...queryObj.filter, ...{ servicePriceType: "FIXED" } };

          break;
      }
    }

    if (!serviceTagIds.length) {
      queryObj.filter = { ...queryObj.filter, serviceTagIds: undefined };
    } else {
      let serviceTagList = [];
      serviceTagIds.forEach((serviceTagId) => {
        const res = serviceTagCrud?.items?.find((x) => x.id == serviceTagId);
        if (res) {
          serviceTagList = [...serviceTagList, res.id];
        }
      });

      queryObj.filter = {
        ...queryObj.filter,
        serviceTagIds: { $in: serviceTagList },
      };
    }
    return queryObj;
  };

  const query = useMemo(() => {
    if (!loadDone) return {};

    if (isLg || !isSubmit) {
      return filter();
    } else {
      if (isSubmit || search) {
        return filter();
      }
    }
  }, [sortBy, search, loadDone, serviceTagIds]);

  const serviceCrud = useCrud(
    ShopServiceService,
    {
      ...query,
      limit: 12,
      ...(!sortBy && {
        order: { _id: -1 },
      }),
    },
    {
      fetchingCondition: loadDone,
      cache: true,
    }
  );

  return (
    <ServiceContext.Provider
      value={{
        serviceTagCrud,
        serviceCrud,
        search,
        sortBy,
        serviceTags,
        serviceTagIds,
        onFilterChange: handleFilterChange,
        onSubmit: handleSubmit,
        tagIds,
        countQuery,
      }}
    >
      {props.children}
    </ServiceContext.Provider>
  );
}

export const useServiceContext = () => useContext(ServiceContext);
