import { FieldProps, Label, PropsType } from "../utilities/form";

export const labelAccentField: Partial<FieldProps> = {
  labelClassName: "text-accent font-extrabold",
};

export function LabelAccent({ ...props }: PropsType) {
  return (
    <>
      <Label className="text-sm font-extrabold text-accent" {...props} />
    </>
  );
}
