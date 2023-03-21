import { cloneDeep } from "lodash";
import { ChangeEvent, MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BiImageAdd } from "react-icons/bi";
import { RiCloseLine } from "react-icons/ri";
import { uploadImage } from "../../../lib/helpers/image";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useToast } from "../../../lib/providers/toast-provider";
import { Button } from "../utilities/form";
import { Img } from "../utilities/misc";
import { LabelAccent } from "./label-accent";

export interface ImageUploadFieldProps extends ReactProps {
  defaultValue?: string[];
  name: string;
  maxImage: number;
  muti?: boolean;
  label?: string;
  accept?: string;
  required?: boolean;
  noError?: boolean;
}

export function ImageUploadField({
  name,
  muti = true,
  maxImage,
  required = false,
  ...props
}: ImageUploadFieldProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();
  const ref: MutableRefObject<HTMLInputElement> = useRef();
  const [values, setValues] = useState<string[]>([]);
  const toast = useToast();
  const screenLg = useScreen("lg");

  const error = useMemo(() => {
    return errors && errors[name] && !values?.length ? errors[name].message : null;
  }, [errors[name], values]);

  register(name, { required });

  useEffect(() => {
    if (props.defaultValue?.length > 0) {
      setValues(props.defaultValue);
    }
  }, [props.defaultValue]);

  const onAddImage = async (e: ChangeEvent<HTMLInputElement>) => {
    let files = e.target.files;
    if (files.length == 0) return;
    if (files.length > maxImage || values?.length + files.length > maxImage) {
      toast.info(`Hình ảnh đính kèm không vượt quá ${maxImage} ảnh`);
      return;
    }

    try {
      let tasks = [];
      for (let i = 0; i < files.length; i++) {
        tasks.push(uploadImage(files.item(i)));
      }
      let res = await Promise.all(tasks);
      let images = res.map((x) => x.link);
      const newImages = [...values, ...images];
      setValues(newImages);
      setValue(name, newImages);
    } catch (error) {
      console.error(error);
      toast.error(`Upload ảnh thất bại. Xin thử lại.`);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className={`col-span-12 ${props.className || "mb-6"}`}>
      {props.label && <LabelAccent text={props.label} required={required} error={error} />}
      <div className={`flex flex-wrap ${screenLg ? "gap-3" : "gap-1"}`}>
        {values?.length > 0 &&
          values.map((image, index) => (
            <div className="p-1 border border-gray-400 rounded-sm h-28 w-28" key={index}>
              <Img src={image} className="relative object-cover h-32 group " rounded>
                <Button
                  hoverDanger
                  icon={<RiCloseLine />}
                  iconClassName="text-3xl"
                  className="absolute w-10 h-10 bg-white opacity-0  bottom-1 left-1/2 -translate-x-1/2 z-100 tranform rounded-full scale-[0.7]  group-hover:opacity-100 group-hover:border-red-400 group-hover:text-red-400"
                  onClick={() => {
                    let newValue = cloneDeep(values);
                    newValue.splice(index, 1);
                    setValues(newValue);
                    setValue(name, newValue);
                  }}
                />
              </Img>
            </div>
          ))}

        <Button
          icon={<BiImageAdd />}
          text="Tải ảnh lên"
          className={`flex-col px-3 h-28`}
          iconClassName="text-3xl"
          style={{ border: "2px dotted" }}
          unfocusable
          onClick={() => ref.current?.click()}
        />
        <input
          hidden
          multiple={muti}
          type="file"
          accept={props.accept}
          ref={ref}
          onChange={onAddImage}
        />
      </div>
      {!props.noError && (
        <div className="font-semibold text-sm pt-0.5 min-h-6 text-danger text-right w-28">
          {error && <span className="form-error animate-emerge-up">{error}</span>}
        </div>
      )}
    </div>
  );
}
