interface OMGStatPillProps {
  number: number | string;
  label: string;
}

export function OMGStatPill({ number, label }: OMGStatPillProps) {
  return (
    <div className="flex-1 bg-[var(--omg-card)] border-[3px] border-[var(--omg-ink)] rounded-[20px] p-[14px_8px] text-center shadow-[3px_3px_0px_var(--omg-ink)]">
      <span className="block font-grotesk text-[24px] font-black text-[var(--omg-purple)]">{number}</span>
      <span className="text-[11px] text-[var(--omg-muted)] font-bold">{label}</span>
    </div>
  );
}
