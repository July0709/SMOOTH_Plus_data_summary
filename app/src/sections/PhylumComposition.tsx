import { phylumData, fmt } from '../data'
import type { PhylumGroupRow } from '../data'

export const PHYLA_COLORS = [
  '#C8A45D', '#7C9EB2', '#A87FB8', '#6FA287', '#B0766A',
  '#8C97C6', '#D0B27A', '#5E8F96', '#9678A8', '#74875F',
]
export const OTHER_COLOR = 'rgba(237,234,226,0.18)'

const LEGEND = [...phylumData.topPhyla, 'Other']

export function phylumColor(ph: string): string {
  const i = LEGEND.indexOf(ph)
  if (ph === 'Other' || i < 0) return OTHER_COLOR
  return PHYLA_COLORS[i % PHYLA_COLORS.length]
}

/** 单个分组（某地区/疾病）的门水平组成面板：堆叠条 + 百分比明细 */
export default function PhylumComposition({ row }: { row: PhylumGroupRow }) {
  const segments = LEGEND.map((ph) => ({ ph, v: Number(row[ph] ?? 0) })).filter((s) => s.v > 0)

  return (
    <div>
      <div className="flex h-7 w-full overflow-hidden rounded-lg bg-white/[0.05]">
        {segments.map((s) => (
          <div
            key={s.ph}
            title={`${s.ph}: ${s.v}%`}
            className="h-full transition-all duration-300 hover:brightness-125"
            style={{ width: `${s.v}%`, backgroundColor: phylumColor(s.ph) }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.ph} className="flex items-center gap-1.5 text-[12px] text-slate-400">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: phylumColor(s.ph) }}
            />
            <span className={s.ph === 'Other' ? '' : 'italic'}>{s.ph}</span>
            <span className="font-semibold text-[#EDEAE2]">{s.v}%</span>
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-xs text-slate-500">
        基于 {row.projects} 个匹配项目 · 总测序计数 {fmt(row.totalCount)}
      </p>
    </div>
  )
}
