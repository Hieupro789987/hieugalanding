interface InfoRowProps {
  label: string;
  value: string | number;
}

export function InfoRow({ label, value, ...props }: InfoRowProps) {
  return (
    <div className="flex flex-row gap-x-2">
      <div className={`shrink-0 grow-0 w-1/5 font-semibold`}>{label}</div>
      <div className="flex-1 whitespace-pre-line">{value}</div>
    </div>
  );
}
