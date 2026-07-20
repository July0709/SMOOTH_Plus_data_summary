import { phylumData, fmt } from '../data'
import type { PhylumGroupRow } from '../data'

export const PHYLA_COLORS = [
  '#FF4D8D', '#FF9F1C', '#4CC9F0', '#06D6A0', '#7B61FF',
  '#FFC300', '#EC4899', '#0EA5E9', '#10B981', '#F97316',
]
export const OTHER_COLOR = 'rgba(31,36,48,0.15)'

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
      <div className="flex h-7 w-full overflow-hidden rounded-lg bg-slate-100">
        {segments.map((s) => (
          <div
            key={s.ph}
            title={`${s.ph}: ${s.v}%`}
            className="h-full transition-all duration-300 hover:brightness-110"
            style={{ width: `${s.v}%`, backgroundColor: phylumColor(s.ph) }}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.ph} className="flex items-center gap-1.5 text-[12px] text-slate-600">
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: phylumColor(s.ph) }}
            />
            <span className={s.ph === 'Other' ? '' : 'italic'}>{s.ph}</span>
            <span className="font-semibold text-[#1F2430]">{s.v}%</span>
          </span>
        ))}
      </div>
      <p className="mt-2.5 text-xs text-slate-400">
        基于 {row.projects} 个匹配项目 · 总测序计数 {fmt(row.totalCount)}
      </p>
    </div>
  )
}
