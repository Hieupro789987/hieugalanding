import cloneDeep from "lodash/cloneDeep";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  RiAddCircleLine,
  RiAddFill,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowUpLine,
  RiCloseLine,
  RiDeleteBin6Line,
  RiImageAddFill,
  RiStarFill,
} from "react-icons/ri";
import { useShopLayoutContext } from "../../../../layouts/shop-layout/providers/shop-layout-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { Category, CategoryService } from "../../../../lib/repo/category.repo";
import { GlobalProductCategoryService } from "../../../../lib/repo/global-product-category.repo";
import { ProductLabelService, PRODUCT_LABEL_COLORS } from "../../../../lib/repo/product-label.repo";
import { ProductTopping } from "../../../../lib/repo/product-topping.repo";
import { Product, ProductLabel, ProductService } from "../../../../lib/repo/product.repo";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Button } from "../../../shared/utilities/form/button";
import { Editor } from "../../../shared/utilities/form/editor";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Input } from "../../../shared/utilities/form/input";
import { Label } from "../../../shared/utilities/form/label";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";
import { Accordion, Img, Spinner } from "../../../shared/utilities/misc";
import { Dropdown } from "../../../shared/utilities/popover/dropdown";
import { AvatarUploader } from "../../../shared/utilities/uploader/avatar-uploader";
import { ProductToppingFields } from "../../../shop/product-toppings/components/product-topping-table-form";
import { useProductsContext } from "../providers/products-provider";
import { ProductSpecsField } from "./product-specs-field";
import { ToppingSelection } from "./topping-selection";

interface PropsType extends DialogProps {
  productId: string;
  category: Category;
}
export function ProductForm({ productId, category, ...props }: PropsType) {
  const toast = useToast();
  const { onProductChange, loadTabs, tabs, isShop } = useProductsContext();
  const [labels, setLabels] = useState<ProductLabel[]>(null);
  const [openLabel, setOpenLabel] = useState<ProductLabel>(undefined);
  const { shopConfig } = useShopLayoutContext();
  const [openAdvance, setOpenAdvance] = useState(false);
  const [product, setProduct] = useState<Product>();

  useEffect(() => {
    setProduct(undefined);
    if (productId) {
      ProductService.getOne({ id: productId })
        .then(setProduct)
        .catch((err) => {
          toast.error("Lấy sản phẩm thất bại");
          props.onClose();
        });
    } else if (productId === "") {
      setProduct(null);
    }
  }, [productId]);

  useEffect(() => {
    setLabels(cloneDeep(product?.labels || []));
    loadTabs();
  }, [product]);

  useEffect(() => {
    if (!isShop) setOpenAdvance(true);
  }, [isShop]);

  return (
    <>
      <Form
        grid
        dialog
        extraDialogClass="bg-transparent"
        extraHeaderClass="bg-gray-100 text-xl py-3 justify-center rounded-t-xl border-gray-300 pl-16"
        extraBodyClass={`px-6 bg-gray-100 rounded-b-xl ${!isShop && "pointer-events-none"}`}
        title={`${product ? "Chỉnh sửa" : "Thêm"} sản phẩm`}
        width={product ? "1080px" : "650px"}
        defaultValues={product?.id ? product : {}}
        resetToDefaultAfterSubmit
        isOpen={props.isOpen}
        onClose={props.onClose}
        onChange={(val) => {}}
        validate={{
          toppings: (data) => {
            if (data.toppings.find((topping) => !topping.name)) {
              toast.info("Cần nhập đầy đủ tên topping");
              return "Bắt buộc";
            }
            if (
              data.toppings.find((topping) => topping.options.find((option) => option.name == ""))
            ) {
              toast.info("Cần nhập đầy đủ tên lựa chọn");
              return "Bắt buộc";
            }
            return "";
          },
        }}
        onSubmit={async (data: any) => {
          const { categoryId, productTabs, productSpecs, toppings } = data;

          try {
            let res = await ProductService.createOrUpdate({
              id: product?.id,
              data: {
                ...data,
                labelIds: product?.id ? labels.map((x) => x.id) : undefined,
                categoryId: product?.id ? categoryId : category.id,
                productTabs: productTabs ?? [],
                ...(product?.id && { productSpecs: productSpecs ?? [], toppings: toppings ?? [] }),
              },
              toast,
            });
            onProductChange(res, category);
            props.onClose();
          } catch (err) {}
        }}
      >
        {/* Cheat để bắt lỗi ko hiển thị giá bán (các input number) ở lần đầu truy cập form sản phẩm (F5) */}
        <Field name="basePrice" label="Giá bán" cols={12} required className={"hidden"} readOnly>
          <Input className="h-12 mt-2" number currency />
        </Field>

        {product !== undefined ? (
          <>
            <div
              className={`${
                product ? "col-span-6" : "col-span-12"
              } grid grid-cols-12 gap-x-5 auto-rows-min`}
            >
              <Form.Title title="Thông tin sản phẩm" />
              {product && (
                <Field name="productCode" label="Mã sản phẩm" cols={12} required>
                  <Input className="h-12 mt-2" />
                </Field>
              )}
              {product && <ImageFields />}
              <Field name="name" label="Tên sản phẩm" cols={product ? 12 : 6} required>
                <Input className="h-12 mt-2" />
              </Field>
              {!product && (
                <Field name="productCode" label="Mã sản phẩm" cols={6} required>
                  <Input className="h-12 mt-2" />
                </Field>
              )}
              <Field name="basePrice" label="Giá bán" cols={12} required>
                <Input className="h-12 mt-2" number currency />
              </Field>
              {!product?.id && (
                <Field
                  label="Danh mục sản phẩm GreenAgri"
                  name="globalProductCategoryId"
                  cols={12}
                  tooltip="Hiển thị ở trang Sản phẩm chung của hệ thống"
                  required
                >
                  <Select
                    className="inline-grid h-12 mt-2"
                    optionsPromise={() =>
                      GlobalProductCategoryService.getAll({
                        query: {
                          limit: 10000,
                          filter: {
                            $or: [{ level: 2 }, { level: 1, hasChildren: false }],
                          },
                        },
                        fragment: "id name",
                      }).then((res) => res.data.map((x) => ({ value: x.id, label: x.name })))
                    }
                  />
                </Field>
              )}
              {product && (
                <>
                  <Field name="downPrice" label="Giá bị giảm" cols={6}>
                    <Input className="h-12 mt-2" number currency />
                  </Field>
                  <Field
                    name="saleRate"
                    label="Phần trăm giảm"
                    cols={6}
                    validation={{ min: 0, max: 100 }}
                  >
                    <Input className="h-12 mt-2" number suffix="%" />
                  </Field>
                  {/* <Field name="pricePolicyId" label="Bảng giá">
                    <Select
                      className="inline-grid h-12"
                      placeholder="Không chọn bảng giá"
                      optionsPromise={() => PricePolicyService.getAllOptionsPromise()}
                      clearable
                    />
                  </Field> */}
                  <Field
                    name="limitSale"
                    label="Số lượng tồn kho giới hạn"
                    description="Nhập 0 nếu không giới hạn"
                    cols={6}
                  >
                    <Input className="h-12 mt-2" number />
                  </Field>
                  <Field name="limitSaleByDay" label=" " cols={6}>
                    <Switch placeholder="Giới hạn tồn kho theo ngày" className="pt-8 text-sm" />
                  </Field>
                  {/* <Field name="branchIds" label="Cửa hàng có sản phẩm" cols={12}>
                    <Select
                      className="inline-grid h-12"
                      optionsPromise={() => ShopBranchService.getAllOptionsPromise()}
                      multi
                    />
                  </Field> */}
                  {/* <Field name="subtitle" label="Mô tả ngắn" cols={12}>
                    <Input className="h-12 mt-2" />
                  </Field> */}
                  <Field label="Danh mục" name="categoryId" cols={12}>
                    <Select
                      className="inline-grid h-12 mt-2"
                      optionsPromise={() =>
                        CategoryService.getAll({
                          query: { limit: 0 },
                          fragment: "id name",
                        }).then((res) => res.data.map((x) => ({ value: x.id, label: x.name })))
                      }
                    />
                  </Field>
                  <Field
                    label="Danh mục sản phẩm GreenAgri"
                    name="globalProductCategoryId"
                    cols={12}
                    tooltip="Hiển thị ở trang Sản phẩm chung của hệ thống"
                    required
                  >
                    <Select
                      className="inline-grid h-12 mt-2"
                      optionsPromise={() =>
                        GlobalProductCategoryService.getAll({
                          query: {
                            limit: 0,
                            filter: { $or: [{ level: 2 }, { level: 1, hasChildren: false }] },
                          },
                          fragment: "id name",
                        }).then((res) => res.data.map((x) => ({ value: x.id, label: x.name })))
                      }
                    />
                  </Field>
                  {/* <RatingField /> */}
                  <Field name="soldQty" label="Đã bán" cols={4}>
                    <Input className="h-12 mt-2" number />
                  </Field>
                  <Field name="upsaleProductIds" label="Món mua kèm" cols={12}>
                    <Select
                      className="inline-grid h-12 mt-2"
                      optionsPromise={() =>
                        ProductService.getAllOptionsPromise({
                          fragment: "id name image basePrice",
                          parseOption: (data) => ({
                            value: data.id,
                            label: data.name,
                            image: data.image,
                            basePrice: data.basePrice,
                          }),
                          query: {
                            filter: { _id: { $ne: product.id } },
                          },
                        })
                      }
                      placeholder="Nhập hoặc tìm kiếm sản phẩm mua kèm"
                      multi
                      hasImage
                    />
                  </Field>
                  <div className="col-span-12 mb-6">
                    <Label text="Nhãn sản phẩm (Tối đa 1 nhãn)" />
                    <div className="flex flex-wrap gap-3 mt-2">
                      {labels?.map((label, index) => (
                        <div
                          key={label.name}
                          className="inline-flex items-center px-4 py-2 font-semibold text-gray-100 rounded-full cursor-pointer hover:text-white whitespace-nowrap animate-emerge"
                          style={{ backgroundColor: label.color }}
                          onClick={() => setOpenLabel(label)}
                        >
                          <span className="mr-1">{label.name}</span>
                          <i
                            className="text-gray-100 rounded-full hover:bg-white hover:text-danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              labels.splice(index, 1);
                              setLabels([...labels]);
                            }}
                          >
                            <RiCloseLine />
                          </i>
                        </div>
                      ))}
                      {labels?.length < 1 && (
                        <Button
                          className="inline-flex bg-white rounded-full animate-emerge"
                          icon={<RiAddCircleLine />}
                          outline
                          text="Thêm nhãn"
                          onClick={() => setOpenLabel(null)}
                        />
                      )}
                    </div>
                  </div>
                  {/* <Field label="Tag sản phẩm" name="productTagIds" cols={12}>
                    <Select
                      multi
                      clearable={false}
                      placeholder="Chọn tag đã có hoặc nhập tag mới cho sản phẩm..."
                      createablePromise={(inputValue) =>
                        ProductTagService.getAllCreatablePromise({ inputValue })
                      }
                    />
                  </Field> */}
                  <Field
                    name="cover"
                    label="Ảnh chi tiết sản phẩm"
                    description="Tỉ lệ 4:3. Dùng ảnh sản phẩm nếu không có."
                    cols={12}
                  >
                    <ImageInput percent={75} cover largeImage />
                  </Field>
                  <Field name="images" label="Danh sách hình ảnh" cols={12}>
                    <ImageInput multi />
                  </Field>
                  {/* <Field label="Mô tả chi tiết" name="intro" cols={12}>
                    <Editor />
                  </Field> */}
                  <Field name="youtubeLink" label="Đường dẫn youtube" cols={12}>
                    <Input className="h-12" type="url" />
                  </Field>

                  <div
                    className="flex justify-between cursor-pointer col-span-full group"
                    onClick={() => setOpenAdvance(!openAdvance)}
                  >
                    <Form.Title className="group-hover:text-primary" title="Cài đặt nâng cao" />
                    <i
                      className={`transform flex-center transition group-hover:text-primary w-6 h-6 text-2xl origin-center ${
                        openAdvance ? "rotate-180" : ""
                      }`}
                    >
                      <RiArrowDownSLine />
                    </i>
                  </div>
                  <Accordion isOpen={openAdvance} className="grid grid-cols-12 col-span-12 gap-x-5">
                    {shopConfig?.rewardPointConfig?.rewardBy === "product" && (
                      <Field name="rewardPoint" label="Điểm thưởng" cols={6}>
                        <Input className="h-12 mt-2" number />
                      </Field>
                    )}
                    <Field name="commission2" label="Hoa hồng cộng tác viên" cols={6}>
                      <Input className="h-12 mt-2" number currency />
                    </Field>
                  </Accordion>
                </>
              )}
            </div>
            <div className={`col-span-6 grid grid-cols-12 gap-x-5 auto-rows-min`}>
              {product && <InformationDescProduct productIntro={product.intro} />}
              {product && <TabFields tabs={tabs} productId={product.id} />}
              {product && <ProductSpecsField />}
              {product && <ToppingFields />}
              {/* {product && <SpecificationFields />} */}
            </div>
            {isShop && (
              <Form.Footer
                className="justify-center"
                cancelText=""
                submitText={`${product ? "Chỉnh sửa" : "Thêm"} sản phẩm`}
                submitProps={{ className: "h-14 w-64" }}
              />
            )}
          </>
        ) : (
          <Spinner className="py-32 col-span-full" />
        )}
      </Form>

      <Form
        dialog
        width={450}
        defaultValues={openLabel}
        isOpen={openLabel !== undefined}
        onClose={() => setOpenLabel(undefined)}
        title={`${openLabel ? "Chỉnh sửa" : "Thêm"} nhãn`}
        onSubmit={async (data) => {
          const { name, color } = data;
          if (openLabel) {
            if (!name || !color) {
              toast.info("Cần nhập tên và màu nhãn");
              return;
            }
            let label = await ProductLabelService.update({
              id: openLabel.id,
              data: { name, color },
              toast,
            });
            const index = labels.findIndex((x) => x.id == label.id);
            labels[index] = label;
            setLabels([...labels]);
          } else {
            if (data.create) {
              if (!name || !color) {
                toast.info("Cần nhập tên và màu nhãn");
                return;
              }
              let label = await ProductLabelService.create({
                data: { name, color },
                toast,
              });
              setLabels([...labels, label]);
            } else {
              if (!data.labelData) {
                toast.info("Cần nhập tên và màu nhãn");
                return;
              }
              setLabels([...labels, data.labelData]);
            }
          }
          setOpenLabel(undefined);
        }}
      >
        <LabelFields openLabel={openLabel} labels={product?.labels} />
      </Form>
    </>
  );
}

function ImageFields() {
  const { watch, setValue, register } = useFormContext();
  register("image");
  const image = watch("image");
  const avatarUploaderRef = useRef<any>();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  return (
    <div className="col-span-12 mb-3">
      <Label text="Hình sản phẩm" />
      <div className="flex">
        <div className="w-24 h-24 overflow-hidden bg-white border border-gray-300 rounded-lg flex-center">
          {image ? (
            <Img className="w-full" compress={300} lazyload={false} src={image} showImageOnClick />
          ) : (
            <i className="text-4xl text-gray-500">
              <RiImageAddFill />
            </i>
          )}
        </div>
        <div className="flex-col flex-1 p-4 ml-4 bg-white border border-gray-300 border-dashed rounded flex-center">
          <span className="text-sm">
            Ảnh PNG, JPEG, JPG không vượt quá 10Mb. Tỉ lệ khuyến nghị 1:1.
          </span>
          <Button
            className="px-3 text-sm h-9 hover:underline"
            textPrimary
            text="Tải ảnh lên"
            isLoading={uploadingAvatar}
            onClick={() => {
              avatarUploaderRef.current().onClick();
            }}
          />
          <AvatarUploader
            onRef={(ref) => {
              avatarUploaderRef.current = ref;
            }}
            onUploadingChange={setUploadingAvatar}
            onImageUploaded={(val) => setValue("image", val)}
          />
        </div>
      </div>
    </div>
  );
}

function ToppingFields() {
  const { fields, append, move, remove } = useFieldArray({ name: "toppings" });
  const [openToppingSelection, setOpenToppingSelection] = useState(false);

  return (
    <div className="col-span-12">
      <Form.Title title="Thông tin tuỳ chọn" />
      <div className="col-span-12">
        <Label
          text="Danh sách thuộc tính"
          description="Chọn thuộc tính từ mẫu và chỉnh sửa lại cho phù hợp"
        />
        {(fields as ({ id: string } & ProductTopping)[])?.map((topping, index) => (
          <div
            className="grid grid-cols-12 p-4 mt-3 bg-white rounded shadow-md gap-x-5"
            key={topping.id}
          >
            <div className="flex col-span-12 mb-1 font-semibold uppercase text-primary">
              <span>Topping {index + 1}</span>
              <Button
                className="h-auto px-2 ml-auto"
                icon={<RiArrowUpLine />}
                tooltip="Di chuyển lên"
                disabled={index == 0}
                onClick={() => {
                  move(index, index - 1);
                }}
              />
              <Button
                className="h-auto px-2"
                icon={<RiArrowDownLine />}
                tooltip="Di chuyển xuống"
                disabled={index == fields.length - 1}
                onClick={() => {
                  move(index, index + 1);
                }}
              />
              <Button
                className="h-auto px-2 pr-0"
                icon={<RiDeleteBin6Line />}
                text="Xoá"
                hoverDanger
                onClick={() => {
                  remove(index);
                }}
              />
            </div>
            <ProductToppingFields name={`toppings.${index}`} productTopping={topping} />
          </div>
        ))}
        <Button
          className="px-0 my-3"
          textPrimary
          icon={<RiAddFill />}
          text="Chọn mẫu thuộc tính"
          onClick={() => setOpenToppingSelection(true)}
        />

        <Dialog isOpen={openToppingSelection} onClose={() => setOpenToppingSelection(false)}>
          <ToppingSelection
            onToppingSelect={(topping) => {
              append(topping);
              setOpenToppingSelection(false);
            }}
          />
        </Dialog>
      </div>
    </div>
  );
}

function LabelFields({ openLabel, labels }) {
  const { watch, register, setValue } = useFormContext();
  const create: boolean = watch("create");
  register("labelData");

  return (
    <>
      {!openLabel && (
        <>
          <Field
            name="label"
            label="Chọn nhãn"
            className={`${create ? "opacity-70 pointer-events-none" : ""}`}
          >
            <Select
              readOnly={create}
              optionsPromise={() =>
                ProductLabelService.getAllOptionsPromise({
                  query: { limit: 0, filter: { _id: { $nin: labels.map((x) => x.id) } } },
                  parseOption: (data) => ({
                    value: data.id,
                    label: data.name,
                    color: data.color,
                    data,
                  }),
                })
              }
              onChange={(_, fullData) => {
                setValue("labelData", fullData.data);
              }}
              hasColor
            />
          </Field>
          <hr />
          <Field className="my-2" noError name="create">
            <Switch placeholder="Tạo nhãn mới" />
          </Field>
        </>
      )}
      <div className={`${create || openLabel ? "" : "opacity-70 pointer-events-none"}`}>
        <Field name="name" label="Tên nhãn">
          <Input readOnly={!create && !openLabel} />
        </Field>
        <Field name="color" label="Màu nhãn">
          <Select options={PRODUCT_LABEL_COLORS} hasColor readOnly={!create && !openLabel} />
        </Field>
      </div>
      <Form.Footer submitText={`${openLabel ? "Chỉnh sửa" : create ? "Thêm" : "Chọn"} nhãn`} />
    </>
  );
}

function RatingField() {
  const { watch } = useFormContext();
  const rating = watch("rating");

  return (
    <Field name="rating" label="Đánh giá" validation={{ min: 0, max: 5 }} cols={8}>
      <Input
        className="h-12 mt-2"
        number
        decimal
        suffix={
          <div className="flex mr-2">
            {[1, 2, 3, 4, 5].map((star) => {
              let width = "0";
              const rest = rating - star + 1;
              if (rest >= 1) {
                width = "100%";
              } else if (rest > 0) {
                let percent = rest * 100 + 2;
                width = (percent > 100 ? 100 : percent) + "%";
              }
              return (
                <div className="relative mr-2" key={star}>
                  <i className="text-xl text-gray-400">
                    <RiStarFill />
                  </i>
                  <i
                    className="absolute top-0 left-0 h-full overflow-hidden text-xl text-yellow-400"
                    style={{ width }}
                  >
                    <RiStarFill />
                  </i>
                </div>
              );
            })}
          </div>
        }
      />
    </Field>
  );
}

function TabFields({ tabs, productId }) {
  const tabRef = useRef(null);
  const name = "productTabs";
  const { fields, append, remove, update } = useFieldArray({ name });
  const tabList = fields as {
    id: string;
    tabId: string;
    productId: string;
    content: string;
    isActive: boolean;
  }[];

  if (!tabs) return <Spinner />;

  const tabName = (tabId): string => {
    const name = [...tabs].find((x) => x.id == tabId)?.name;
    return name;
  };

  return (
    <div className="col-span-12">
      {tabList.map((item, index) => (
        <div key={item.tabId} className="mb-4">
          <div className="flex flex-row items-center justify-between mb-2">
            <Label text={tabName(item.tabId)} />
            <div className="flex flex-row items-center">
              <Field name={`productTabs[${index}].isActive`} noError>
                <Switch
                  value={item.isActive}
                  onChange={(value) => {
                    console.log("value: ", typeof value);
                    update(index, { ...item, isActive: !!value });
                  }}
                />
              </Field>
              <Button
                className="px-0 ml-2 text-2xl Ccursor-pointer "
                onClick={() => {
                  remove(index);
                }}
                icon={<RiDeleteBin6Line />}
                iconClassName="hover:text-danger"
              />
            </div>
          </div>
          {item.isActive == true && (
            <>
              <Field name={`productTabs[${index}].content`}>
                <Editor maxWidth="none" placeholder="Nội dung..." maxHeight="415px" />
              </Field>
            </>
          )}
          <Field name={`productTabs[${index}].productId`} noError className="hidden">
            <Input value={productId} />
          </Field>
          <Field name={`productTabs[${index}].tabId`} noError className="hidden">
            <Input value={item.tabId} />
          </Field>
        </div>
      ))}
      {tabs.length - [...tabList].length !== 0 && (
        <>
          <Button
            unfocusable
            className="px-0 mb-3"
            textPrimary
            icon={<RiAddFill />}
            text="Thêm tab thông tin sản phẩm"
            innerRef={tabRef}
          />

          <Dropdown placement="bottom-start" reference={tabRef} appendTo={tabRef.current}>
            {tabs.map(
              (item) =>
                ![...tabList].find((x) => item.id == x.tabId) && (
                  <Dropdown.Item
                    text={item.name}
                    key={item.id}
                    hoverPrimary
                    unfocusable
                    onClick={() => {
                      console.log("item.tabId: ", item.id);
                      append({
                        tabId: item.id,
                        productId: productId,
                        content: "",
                        isActive: true,
                      });
                    }}
                  />
                )
            )}
          </Dropdown>
        </>
      )}
    </div>
  );
}

export function InformationDescProduct({ productIntro }) {
  const { isShop } = useProductsContext();

  return (
    <div className="col-span-12">
      <Form.Title title="Thông tin mô tả sản phẩm" />
      <div className="col-span-12">
        <Field name="subtitle" label="Mô tả ngắn" cols={12}>
          <Input className="h-12 mt-2" />
        </Field>
        <Field label="Mô tả chi tiết" name="intro" cols={12}>
          <Editor
            maxHeight="415px"
            defaultValue={!!productIntro ? productIntro : ""}
            className={`${!isShop && "pointer-events-none"}`}
          />
        </Field>
      </div>
    </div>
  );
}

function SpecificationFields() {
  return (
    <div className="grid grid-cols-12 col-span-12 gap-x-5">
      <Form.Title title="Thông tin tuỳ chọn" />
      {/* <div className="col-span-12">

      </div> */}
      <div className="flex justify-end col-span-12"></div>
      <Field cols={4} name="" label="Tên thông số">
        <Input />
      </Field>
      <Field cols={8} name="" label="Mô tả">
        <Input />
      </Field>
    </div>
  );
}
