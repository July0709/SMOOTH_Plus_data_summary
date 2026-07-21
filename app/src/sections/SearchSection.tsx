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

const BADGE: Record<string, string> = {
  Continent: 'bg-[#7C9EB2]/15 text-[#9FC0D4]',
  Country: 'bg-[#C8A45D]/15 text-[#E3C888]',
  Province: 'bg-[#A87FB8]/15 text-[#C9A8D6]',
  City: 'bg-[#6FA287]/15 text-[#94C4AA]',
  Phylum: 'bg-[#5E8F96]/15 text-[#8FBCC3]',
  Disease: 'bg-[#B0766A]/15 text-[#D09A8C]',
}

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
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-12 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C8A45D]/60" />
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.45em] text-[#C8A45D]">
          Search
        </h2>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C8A45D]/60" />
      </div>

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
            className={`rounded-full border px-7 py-2.5 text-sm font-medium tracking-wider transition-all ${
              tab === k
                ? 'border-[#C8A45D]/70 bg-[#C8A45D]/10 text-[#E3C888] shadow-[0_10px_30px_rgba(200,164,93,0.12)]'
                : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-[#C8A45D]/40 hover:text-[#E3C888]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="mb-8 text-center text-slate-400">
        {tab === 'geo'
          ? '搜索 continent / country / province / city，查看每个地理层级关联的样本量。'
          : tab === 'disease'
            ? '搜索 disease 代码或中文疾病类型，查看样本与项目数量。'
            : '搜索 phylum 名称，查看测序总计数、相对丰度与物种数。'}
      </p>

      {/* controls */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
        <div className="flex min-w-64 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm text-[#EDEAE2] placeholder-slate-500 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="clear">
              <X className="h-4 w-4 text-slate-500 hover:text-[#E3C888]" />
            </button>
          )}
        </div>
        {tab === 'geo' && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            Type:
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'All' | GeoType)}
                className="appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-2.5 pl-4 pr-9 text-sm text-[#EDEAE2] outline-none [&>option]:bg-[#12182B]"
              >
                {(['All', 'Continent', 'Country', 'Province', 'City'] as const).map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </div>
          </div>
        )}
        <span className="text-sm text-slate-500">{fmt(filtered.length)} items</span>
      </div>

      {/* table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#C8A45D]/20 bg-[#C8A45D]/[0.06] text-[#E3C888]">
              <th className="px-6 py-4 font-semibold tracking-wider">Name</th>
              <th className="px-6 py-4 font-semibold tracking-wider">Type</th>
              <th className="px-6 py-4 text-right font-semibold tracking-wider">
                {tab === 'phylum' ? 'Total Count' : 'Samples'}
              </th>
              <th className="hidden px-6 py-4 text-right font-semibold tracking-wider sm:table-cell">
                {tab === 'phylum' ? 'Species' : 'Projects'}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r, i) => (
              <tr key={`${r.type}-${r.name}`} className={i % 2 ? 'bg-white/[0.02]' : ''}>
                <td className="px-6 py-3.5 text-slate-300">
                  <span className={tab === 'phylum' ? 'italic' : ''}>{r.name}</span>
                  {r.zh && r.zh !== r.name && (
                    <span className="ml-2 text-slate-500">{r.zh}</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${BADGE[r.type] ?? BADGE.Disease}`}
                  >
                    {r.type}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right font-semibold text-[#EDEAE2]">{fmt(r.samples)}</td>
                <td className="hidden px-6 py-3.5 text-right text-slate-500 sm:table-cell">{r.projects}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
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
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-7 py-2.5 text-sm text-slate-400 transition hover:border-[#C8A45D]/50 hover:text-[#E3C888]"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            {expanded ? 'Less' : 'More'}
          </button>
        </div>
      )}
    </section>
  )
}
