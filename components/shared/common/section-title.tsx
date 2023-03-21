export function SectionTitle(props: ReactProps) {
  return (
    <div
      className={`font-extrabold uppercase text-accent sm:text-lg lg:text-xl xl:text-2xl ${
        props.className || ""
      }`}
    >
      {props.children}
    </div>
  );
}
