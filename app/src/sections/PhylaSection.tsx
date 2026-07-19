import { useMemo, useState } from 'react'
import { phylumData, fmt } from '../data'
import { PHYLA_COLORS, OTHER_COLOR } from './PhylumComposition'

type GroupKey = 'byDisease' | 'byContinent' | 'byCountry'

const GROUP_TABS: { key: GroupKey; label: string }[] = [
  { key: 'byDisease', label: 'Disease' },
  { key: 'byContinent', label: 'Continent' },
  { key: 'byCountry', label: 'Country' },
]

export default function PhylaSection() {
  const [groupKey, setGroupKey] = useState<GroupKey>('byDisease')

  const overall = useMemo(() => phylumData.overall.slice(0, 16), [])
  const maxCount = Math.max(...overall.map((p) => p.totalCount), 1)

  const groups = useMemo(() => phylumData[groupKey].slice(0, 10), [groupKey])
  const legend = [...phylumData.topPhyla, 'Other']

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-purple-200/80">
        Phyla
      </h2>
      <p className="mx-auto mb-12 max-w-3xl text-center text-purple-100/75">
        门（Phylum）水平物种组成：总体统计基于 {fmt(phylumData.sampleColumns)} 个样本的测序计数；
        分组相对丰度基于与 SMITH 元数据匹配的 {phylumData.matchedProjects} 个项目、
        {' '}{fmt(phylumData.matchedSamples)} 个样本。
      </p>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* overall composition */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Overall</h3>
            <span className="text-sm text-purple-200/60">Top 16 by total count</span>
          </div>
          <div className="space-y-2.5">
            {overall.map((p, i) => (
              <div key={p.name} className="group flex items-center gap-3">
                <div
                  className="w-44 shrink-0 truncate text-right text-[13px] italic text-purple-100/85"
                  title={p.name}
                >
                  {p.name}
                </div>
                <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                  <div
                    className="h-full rounded-md transition-all duration-500 group-hover:brightness-125"
                    style={{
                      width: `${Math.max((p.totalCount / maxCount) * 100, 1.5)}%`,
                      backgroundColor: PHYLA_COLORS[i % PHYLA_COLORS.length],
                      opacity: 0.9,
                    }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right text-[13px] font-semibold text-white">
                  {p.relPct}%
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-right text-xs text-purple-200/50">
            百分比为相对丰度（Relative_Percentage）
          </p>
        </div>

        {/* composition by group */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-white">Composition by group</h3>
            <div className="flex gap-2">
              {GROUP_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setGroupKey(t.key)}
                  className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                    groupKey === t.key
                      ? 'border-fuchsia-300/50 bg-fuchsia-400/20 text-white'
                      : 'border-white/15 bg-white/[0.04] text-purple-200/80 hover:bg-white/[0.08]'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {groups.map((g) => (
              <div key={g.name} className="flex items-center gap-3">
                <div
                  className="w-28 shrink-0 truncate text-right text-[13px] text-purple-100/85"
                  title={`${g.name} · ${g.projects} projects`}
                >
                  {g.name}
                </div>
                <div className="flex h-6 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
                  {legend.map((ph, li) => {
                    const v = Number(g[ph] ?? 0)
                    if (v <= 0) return null
                    return (
                      <div
                        key={ph}
                        title={`${g.name} · ${ph}: ${v}%`}
                        className="h-full transition-all duration-300 hover:brightness-125"
                        style={{
                          width: `${v}%`,
                          backgroundColor:
                            ph === 'Other' ? OTHER_COLOR : PHYLA_COLORS[li % PHYLA_COLORS.length],
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* legend */}
          <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {legend.map((ph, li) => (
              <span key={ph} className="flex items-center gap-1.5 text-[11px] text-purple-200/75">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{
                    backgroundColor:
                      ph === 'Other' ? OTHER_COLOR : PHYLA_COLORS[li % PHYLA_COLORS.length],
                  }}
                />
                <span className={ph === 'Other' ? '' : 'italic'}>{ph}</span>
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-purple-200/50">
            每组为该分组全部样本计数归一化后的相对丰度（%），悬停色块查看数值
          </p>
        </div>
      </div>
    </section>
  )
}
