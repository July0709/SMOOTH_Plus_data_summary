import { useMemo, useState } from 'react'
import { data, phylumData, fmt } from '../data'
import { Search, X, ChevronDown } from 'lucide-react'

type GeoType = 'Continent' | 'Country' | 'Province' | 'City'

interface Row {
  name: string
  type: string
  samples: number
  projects: number
  zh?: string
}

const PAGE = 10

export default function SearchSection() {
  const [tab, setTab] = useState<'geo' | 'disease' | 'phylum'>('geo')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'All' | GeoType>('All')
  const [expanded, setExpanded] = useState(false)

  const geoRows = useMemo<Row[]>(() => {
    const rows: Row[] = [
      ...data.continents.map((r) => ({ name: String(r.continent), type: 'Continent', samples: r.samples, projects: r.projects })),
      ...data.countries.map((r) => ({ name: String(r.country), type: 'Country', samples: r.samples, projects: r.projects })),
      ...data.provinces.map((r) => ({ name: String(r.province), type: 'Province', samples: r.samples, projects: r.projects })),
      ...data.cities.map((r) => ({ name: String(r.city), type: 'City', samples: r.samples, projects: r.projects })),
    ]
    return rows.sort((a, b) => b.samples - a.samples)
  }, [])

  const diseaseRows = useMemo<Row[]>(
    () =>
      data.diseases.map((d) => ({
        name: d.disease,
        zh: d.zh,
        type: 'Disease',
        samples: d.samples,
        projects: d.projects,
      })),
    []
  )

  const phylumRows = useMemo<Row[]>(
    () =>
      phylumData.overall.map((p) => ({
        name: p.name,
        type: 'Phylum',
        samples: p.totalCount,
        projects: p.speciesNumber,
        zh: `${p.relPct}%`,
      })),
    []
  )

  const filtered = useMemo(() => {
    const base = tab === 'geo' ? geoRows : tab === 'disease' ? diseaseRows : phylumRows
    const q = query.trim().toLowerCase()
    return base.filter((r) => {
      if (tab === 'geo' && typeFilter !== 'All' && r.type !== typeFilter) return false
      if (!q) return true
      return r.name.toLowerCase().includes(q) || (r.zh ?? '').toLowerCase().includes(q)
    })
  }, [tab, query, typeFilter, geoRows, diseaseRows, phylumRows])

  const visible = expanded ? filtered : filtered.slice(0, PAGE)

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-10 text-center text-sm font-semibold uppercase tracking-[0.35em] text-purple-200/80">
        Search
      </h2>

      {/* tabs */}
      <div className="mb-8 flex justify-center gap-3">
        {([
          ['geo', 'Geography'],
          ['disease', 'Disease'],
          ['phylum', 'Phylum'],
        ] as const).map(([k, label]) => (
          <button
            key={k}
            onClick={() => { setTab(k); setExpanded(false) }}
            className={`rounded-full border px-7 py-2.5 text-sm font-medium transition-all ${
              tab === k
                ? 'border-fuchsia-300/50 bg-fuchsia-400/20 text-white shadow-[0_0_25px_rgba(217,70,239,0.25)]'
                : 'border-white/15 bg-white/[0.04] text-purple-200/80 hover:bg-white/[0.08]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mb-8 text-center text-purple-100/75">
        {tab === 'geo'
          ? '搜索 continent / country / province / city，查看每个地理层级关联的样本量。'
          : tab === 'disease'
            ? '搜索 disease 代码或中文疾病类型，查看样本与项目数量。'
            : '搜索 phylum 名称，查看测序总计数、相对丰度与物种数。'}
      </p>

      {/* controls */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <div className="flex min-w-64 items-center gap-2 rounded-xl border border-white/12 bg-white/[0.06] px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-purple-200/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-white placeholder-purple-200/50 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="clear">
              <X className="h-4 w-4 text-purple-200/60 hover:text-white" />
            </button>
          )}
        </div>
        {tab === 'geo' && (
          <div className="flex items-center gap-2 text-sm text-purple-100/80">
            Type:
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'All' | GeoType)}
                className="appearance-none rounded-xl border border-white/12 bg-white/[0.06] py-2.5 pl-4 pr-9 text-sm text-white outline-none [&>option]:bg-[#2a1d4d]"
              >
                {(['All', 'Continent', 'Country', 'Province', 'City'] as const).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-200/60" />
            </div>
          </div>
        )}
        <span className="text-sm text-purple-200/70">{fmt(filtered.length)} items</span>
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-white/[0.08] text-white">
              <th className="px-6 py-4 font-semibold">Name</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 text-right font-semibold">
                {tab === 'phylum' ? 'Total Count' : 'Samples'}
              </th>
              <th className="hidden px-6 py-4 text-right font-semibold sm:table-cell">
                {tab === 'phylum' ? 'Species' : 'Projects'}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={`${r.type}-${r.name}`} className={i % 2 ? 'bg-white/[0.02]' : 'bg-white/[0.05]'}>
                <td className="px-6 py-3.5 text-purple-50">
                  <span className={tab === 'phylum' ? 'italic' : ''}>{r.name}</span>
                  {r.zh && r.zh !== r.name && (
                    <span className="ml-2 text-purple-300/70">{r.zh}</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.type === 'Continent'
                        ? 'bg-sky-400/15 text-sky-300'
                        : r.type === 'Country'
                          ? 'bg-fuchsia-400/15 text-fuchsia-300'
                          : r.type === 'Province'
                            ? 'bg-violet-400/15 text-violet-300'
                            : r.type === 'City'
                              ? 'bg-emerald-400/15 text-emerald-300'
                              : r.type === 'Phylum'
                                ? 'bg-teal-400/15 text-teal-300'
                                : 'bg-amber-400/15 text-amber-300'
                    }`}
                  >
                    {r.type}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right font-semibold text-white">{fmt(r.samples)}</td>
                <td className="hidden px-6 py-3.5 text-right text-purple-200/80 sm:table-cell">{r.projects}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-purple-200/60">
                  没有匹配的条目
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > PAGE && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-7 py-2.5 text-sm text-purple-100 transition hover:bg-white/[0.1]"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      )}
    </section>
  )
}
