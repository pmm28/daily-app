export default function ChipGroup({ options, value, onChange, size = 'md' }) {
  const sz = size === 'sm'
    ? 'px-3 py-1.5 text-xs'
    : 'px-3.5 py-2 text-[13px]'

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`${sz} rounded-full border-[1.5px] font-medium transition-all ${
            value === opt.value
              ? opt.activeClass || 'bg-rose/30 border-rose-mid text-rose-deep'
              : 'bg-parchment border-border text-ink-mid hover:bg-parchment-2'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
