import { NextSeo } from "next-seo";
import { useRef, useState } from "react";
import { RiSearchLine, RiTimerFlashLine } from "react-icons/ri";
import { Dialog, Slideout } from "../components/shared/utilities/dialog";
import {
  Button,
  Checkbox,
  DatePicker,
  Editor,
  Field,
  FileInput,
  Form,
  ImageInput,
  Input,
  Label,
  Radio,
  Select,
  Switch,
  Textarea,
} from "../components/shared/utilities/form";
import {
  Accordion,
  Card,
  Img,
  Scrollbar,
  Spinner,
  StatusLabel,
} from "../components/shared/utilities/misc";
import { PaginationComponent } from "../components/shared/utilities/pagination/pagination-component";
import { PaginationRound } from "../components/shared/utilities/pagination/pagination-round";
import { Dropdown } from "../components/shared/utilities/popover/dropdown";
import { Popover } from "../components/shared/utilities/popover/popover";
import { TabButtons } from "../components/shared/utilities/tab/tab-buttons";
import { TabGroup } from "../components/shared/utilities/tab/tab-group";
import { NoneLayout } from "../layouts/none-layout/none-layout";
import { useAlert } from "../lib/providers/alert-provider";
import { useToast } from "../lib/providers/toast-provider";
import { ORDER_STATUS } from "../lib/repo/order.repo";
import { PRODUCT_LABEL_COLORS } from "../lib/repo/product-label.repo";
import { ISO_DAYS_OF_WEEK } from "../lib/repo/shop-voucher.repo";

export default function Page() {
  return (
    <>
      <NextSeo title="Test" />
      <Test />
    </>
  );
}
Page.Layout = NoneLayout;

function Test() {
  const [value, setValue] = useState("Nội dung");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSlideout, setOpenSlideout] = useState(false);
  const [tab, setTab] = useState("James");
  const alert = useAlert();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  const popoverRef = useRef();

  const onLoad = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      <Card>
        <Form className="grid grid-cols-4 gap-3 py-6 main-container">
          <Form.Title title="Form" />
          <Field label="Input" cols={1}>
            <Input value={value} onChange={setValue} />
          </Field>
          <Field label="Input Number" cols={1}>
            <Input number suffix={"VND"} />
          </Field>
          <Field label="Input" cols={1}>
            <Input prefix={<RiSearchLine />} placeholder="Tìm kiếm..." clearable />
          </Field>
          <Field label="Input lỗi" error="Error" cols={1}>
            <Input />
          </Field>
          <Field label="Input Readonly" cols={1}>
            <Input value={"Không thể sửa"} readOnly />
          </Field>
          <Field label="Input Multi" cols={3}>
            <Input multi />
          </Field>
          <Field label="Select" cols={1}>
            <Select options={ORDER_STATUS} />
          </Field>
          <Field label="Select Color" cols={1}>
            <Select options={PRODUCT_LABEL_COLORS} hasColor />
          </Field>
          <Field label="Select Image" cols={1}>
            <Select options={IMAGE_OPTIONS} hasImage isAvatarImage clearable />
          </Field>
          <Field label="Select Multi" cols={1}>
            <Select options={ORDER_STATUS} multi />
          </Field>
          <Field label="Date picker" cols={1}>
            <DatePicker />
          </Field>
          <Field label="Range picker" cols={1}>
            <DatePicker selectsRange monthsShown={2} />
          </Field>
          <Field label="Image input" cols={1}>
            <ImageInput />
          </Field>
          <Field label="Image input" cols={1}>
            <ImageInput ratio169 largeImage />
          </Field>
          <Field label="Image input" cols={2}>
            <ImageInput multi />
          </Field>
          <Field label="Textarea" cols={2}>
            <Textarea />
          </Field>
          <Field label="Switch" cols={1}>
            <Switch placeholder="Bật công tắc" />
          </Field>
          <Field label="Checkbox" cols={1}>
            <Checkbox placeholder="Lựa chọn" />
          </Field>
          <Field label="Checkbox" cols={2}>
            <Checkbox multi options={ISO_DAYS_OF_WEEK} />
          </Field>
          <Field label="Uploader" cols={2}>
            <FileInput />
          </Field>
          <Field label="Radio" cols={2}>
            <Radio options={ISO_DAYS_OF_WEEK} />
          </Field>
          <Field label="Editor" cols={4}>
            <Editor />
          </Field>
          <Form.Title title="Button" />
          <div className="flex flex-col col-span-4 gap-3">
            <div className="flex gap-3">
              <Button primary small text={"Một nút bấm nhỏ"} />
              <Button primary medium text={"Một nút bấm vừa"} />
              <Button primary text={"Một nút bấm mặc định"} />
              <Button primary large text={"Một nút bấm lớn"} />
            </div>
            <div className="flex gap-3">
              <Button text={"Nút mặc định"} />
              <Button primary text={"Nút Solid"} />
              <Button light primary text={"Nút Light"} />
              <Button outline text={"Nút Outline"} />
              <Button outline primary text={"Nút Outline Primary"} />
            </div>
            <div className="flex gap-3">
              <Button className="hover:underline" href="https://google.com" text={"Là link"} />
              <Button accent text={"Nút Accent"} />
              <Button success text={"Nút Success"} />
              <Button warning text={"Nút Warning"} />
              <Button info text={"Nút Info"} />
              <Button danger text={"Nút Danger"} />
            </div>
            <div className="flex gap-3">
              <Button primary icon={<RiSearchLine />} text={"Có Icon"} />
              <Button className="w-10 h-10" primary icon={<RiSearchLine />} />
              <Button primary text={"Icon sau"} iconPosition="end" icon={<RiSearchLine />} />
              <Button
                primary
                icon={<RiSearchLine />}
                isLoading={loading}
                text={"Click để load"}
                onClick={onLoad}
              />
              <Button primary text={"Click để load"} isLoading={loading} onClick={onLoad} />
              <Button primary isLoading text={"Đang load"} />
              <Button primary disabled text={"Đang disabled"} />
            </div>
          </div>
          <Form.Title title="Dialog" />
          <div className="flex flex-col col-span-4 gap-3">
            <div className="flex gap-3">
              <Button outline text={"Mở dialog"} onClick={() => setOpenDialog(true)} />
              <Dialog
                width={500}
                extraBodyClass="h-72"
                isOpen={openDialog}
                onClose={() => setOpenDialog(false)}
                title="Đây là dialog header"
              >
                <Dialog.Body>Nội dung dialog</Dialog.Body>
                <Dialog.Footer>
                  <Form.Footer />
                </Dialog.Footer>
              </Dialog>
              <Button outline text={"Một Slideout"} onClick={() => setOpenSlideout(true)} />
              <Slideout width={"80vw"} isOpen={openSlideout} onClose={() => setOpenSlideout(false)}>
                <div className="p-6">
                  Một slideout với nội dung
                  <img src="https://i.imgur.com/bUYhonv.png" />
                </div>
              </Slideout>
              <Img className="w-10" src={"https://i.imgur.com/bUYhonv.png"} showImageOnClick />
            </div>
            <div className="flex gap-3">
              <Button
                primary
                text={"Mở confirm"}
                onClick={() => {
                  alert.question("Một câu hỏi", "Một mô tả");
                }}
              />
              <Button
                success
                text={"Mở thành công"}
                onClick={() => {
                  alert.success("Thành công");
                }}
              />
              <Button
                warning
                text={"Mở cảnh báo"}
                onClick={() => {
                  alert.warn("Cảnh báo có chắc không?", "Có chắc chắn muốn làm không");
                }}
              />
              <Button
                info
                text={"Mở thông tin"}
                onClick={() => {
                  alert.info("Đây là thông tin");
                }}
              />
              <Button
                danger
                text={"Mở lỗi"}
                onClick={() => {
                  alert.error("Lỗi nè");
                }}
              />
              <Button
                outline
                hoverDanger
                icon={<RiTimerFlashLine />}
                text={"Mở nguy hiểm"}
                onClick={() => {
                  alert.danger("Xoá mục", "Bạn có chắc chắn muốn xoá?");
                }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                success
                text={"Toast thành công"}
                onClick={() => {
                  toast.success("Thành công", "Mô tả Thành công");
                }}
              />
              <Button
                warning
                text={"Toast cảnh báo"}
                onClick={() => {
                  toast.warn("Cảnh báo", "Mô tả cảnh báo");
                }}
              />
              <Button
                info
                text={"Toast thông tin"}
                onClick={() => {
                  toast.info("Đây là thông tin", "Mô tả thông tin");
                }}
              />
              <Button
                danger
                text={"Toast lỗi"}
                onClick={() => {
                  toast.error("Lỗi nè", "Mô tả Lỗi");
                }}
              />
            </div>
          </div>
          <Form.Title title="Misc" />
          <div className="p-3 border">
            <Label text="Accordion" />
            <Button
              accent
              text={"Toggle accordion"}
              onClick={() => {
                setIsOpen(!isOpen);
              }}
            />
            <Accordion className="" isOpen={isOpen}>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
            </Accordion>
          </div>
          <div className="p-3 border">
            <Label text="Scrollbar" />
            <Scrollbar className="border border-gray-600" height={150}>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
              <div>Nội dung ẩn</div>
            </Scrollbar>
          </div>
          <div className="p-3 border">
            <Label text="Spinner" />
            <Spinner className="py-6" />
          </div>
          <div className="p-3 border">
            <Label text="Label" />
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUS.map((x) => (
                <StatusLabel value={x.value} options={ORDER_STATUS} />
              ))}
            </div>
            <Label text="Label type text" />
            <div className="flex flex-wrap gap-2 mt-4">
              {ORDER_STATUS.map((x) => (
                <StatusLabel type="text" value={x.value} options={ORDER_STATUS} />
              ))}
            </div>
            <Label text="Label type light" />
            <div className="flex flex-wrap gap-2 mt-4">
              {ORDER_STATUS.map((x) => (
                <StatusLabel type="light" value={x.value} options={ORDER_STATUS} />
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <Label text="Pagination" />
            <PaginationComponent page={1} limit={20} total={200} onPageChange={() => {}} />
          </div>
          <div className="col-span-2">
            <Label text="Pagination Round" />
            <PaginationRound page={1} limit={20} total={200} onPageChange={() => {}} />
          </div>
          <div className="col-span-1">
            <Label text="Dropdown" />
            <Button primary innerRef={dropdownRef} text="Mở dropdown" />
            <Dropdown reference={dropdownRef}>
              <Dropdown.Item text="Menu 1" />
              <Dropdown.Item text="Menu 2" />
              <Dropdown.Item text="Menu 3" />
              <Dropdown.Divider />
              <Dropdown.Item text="Menu 4" />
            </Dropdown>
          </div>
          <div className="col-span-3">
            <Label text="Popover" />
            <Button primary innerRef={popoverRef} text="Mở Popover" />
            <Popover reference={popoverRef}>
              <div className="h-56 p-4 max-w-screen-xs">Một popover</div>
            </Popover>
          </div>
          <div className="col-span-4">
            <Label text="Tab Group" />
            <TabGroup
              className="px-4 bg-gray-50"
              tabClassName="h-16 py-4 text-base px-4"
              bodyClassName="p-6 v-scrollbar"
              activeClassName="bg-white border-l border-r border-gray-300"
            >
              <TabGroup.Tab label="Tab 1">Tab 1</TabGroup.Tab>
              <TabGroup.Tab label="Tab 2">Tab 2</TabGroup.Tab>
              <TabGroup.Tab label="Tab 3">Tab 3</TabGroup.Tab>
            </TabGroup>
          </div>
          <div className="col-span-4">
            <Label text="Tab Button" />
            <TabButtons value={tab} onChange={setTab} options={ORDER_STATUS} />
          </div>
        </Form>
      </Card>
    </>
  );
}

const IMAGE_OPTIONS = [
  {
    label: "James",
    image: "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745",
    value: `humidity`,
  },
  {
    label: "Robert",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe1_6-PtcF48iM3PkReAZlBpbSaLDhKNyisg&usqp=CAU",
    value: `feels_like`,
  },
];
