import { useMemo, useState, lazy, Suspense } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { data, fmt } from '../data'
import { ChevronDown } from 'lucide-react'

const WorldMap = lazy(() => import('./WorldMap'))

type GeoKey = 'continent' | 'country' | 'province' | 'city'

const PALETTE = [
  '#C8A45D', '#7C9EB2', '#A87FB8', '#6FA287', '#B0766A', '#8C97C6',
  '#D0B27A', '#5E8F96', '#9678A8', '#74875F', '#C08A5E', '#7A8BA8',
  '#B89B5E', '#648A94', '#8F7BA8', '#7E967A', '#A87E7E', '#94A3B8',
  '#C8A45D', '#6FA287',
]

const tooltipStyle = {
  backgroundColor: '#12182B',
  border: '1px solid rgba(200,164,93,0.25)',
  borderRadius: 12,
  color: '#EDEAE2',
  fontSize: 13,
  boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
}

export default function Prevalence() {
  const [geoKey, setGeoKey] = useState<GeoKey>('country')

  const geoRows = useMemo(() => {
    const src = {
      continent: data.continents,
      country: data.countries,
      province: data.provinces,
      city: data.cities,
    }[geoKey]
    return src.slice(0, 14).map((r) => ({
      name: String(r[geoKey]).replace('United States Of America', 'USA'),
      samples: r.samples,
      projects: r.projects,
    }))
  }, [geoKey])

  const diseaseRows = useMemo(
    () =>
      data.diseases.slice(0, 16).map((d) => ({
        name: d.disease,
        zh: d.zh,
        samples: d.samples,
        projects: d.projects,
      })),
    []
  )

  const maxGeo = Math.max(...geoRows.map((r) => r.samples), 1)

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-4 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C8A45D]/60" />
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.45em] text-[#C8A45D]">
          Prevalence
        </h2>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C8A45D]/60" />
      </div>
      <p className="mb-12 text-center text-slate-400">
        世界地图按国家样本量填色，或切换地理层级 / 疾病维度查看分布。
      </p>

      {/* world map */}
      <div className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-2 flex items-center justify-between">
          <h3
            className="text-lg font-semibold tracking-wide text-[#F3EEE3]"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
          >
            World Map · Samples by Country
          </h3>
          <span className="text-sm text-slate-500">滚轮缩放 · 拖拽平移</span>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[480px] w-full items-center justify-center text-sm text-slate-500 sm:h-[540px]">
              地图加载中…
            </div>
          }
        >
          <WorldMap />
        </Suspense>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* geography bars */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex items-center justify-between">
            <h3
              className="text-lg font-semibold tracking-wide text-[#F3EEE3]"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
            >
              Geography
            </h3>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              Group by
              <div className="relative">
                <select
                  value={geoKey}
                  onChange={(e) => setGeoKey(e.target.value as GeoKey)}
                  className="appearance-none rounded-xl border border-white/10 bg-white/[0.04] py-2 pl-4 pr-9 text-sm capitalize text-[#EDEAE2] outline-none [&>option]:bg-[#12182B]"
                >
                  {(['continent', 'country', 'province', 'city'] as const).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              </div>
            </div>
          </div>

          {/* sample-count gradient bars (HMC style) */}
          <div className="space-y-2.5">
            {geoRows.map((r) => (
              <div key={r.name} className="group flex items-center gap-3">
                <div className="w-36 shrink-0 truncate text-right text-[13px] text-slate-400" title={r.name}>
                  {r.name}
                </div>
                <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-white/[0.05]">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-[#7C9EB2] to-[#C8A45D] transition-all duration-500 group-hover:from-[#9FC0D4] group-hover:to-[#E3C888]"
                    style={{ width: `${Math.max((r.samples / maxGeo) * 100, 1.5)}%` }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right text-[13px] font-semibold text-[#EDEAE2]">
                  {fmt(r.samples)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-end gap-3 text-xs text-slate-500">
            <span>Fewer</span>
            <span className="h-2.5 w-24 rounded-full bg-gradient-to-r from-[#7C9EB2]/50 to-[#C8A45D]" />
            <span>More samples</span>
          </div>
        </div>

        {/* disease bars */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-6 flex items-center justify-between">
            <h3
              className="text-lg font-semibold tracking-wide text-[#F3EEE3]"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
            >
              Disease
            </h3>
            <span className="text-sm text-slate-500">Top 16 by samples</span>
          </div>
          <div className="h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseRows} layout="vertical" margin={{ left: 8, right: 44, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fill: '#8A93A6', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={tooltipStyle}
                  formatter={(v: number, _n, item) => [
                    `${fmt(v)} samples · ${(item.payload as { projects: number }).projects} projects`,
                    (item.payload as { zh?: string }).zh || 'Samples',
                  ]}
                />
                <Bar dataKey="samples" radius={[0, 6, 6, 0]} barSize={18}>
                  {diseaseRows.map((_, i) => (
                    <Cell key={i} fill={PALETTE[i % PALETTE.length]} fillOpacity={0.9} />
                  ))}
                  <LabelList
                    dataKey="samples"
                    position="right"
                    formatter={(v: number) => fmt(v)}
                    style={{ fill: '#8A93A6', fontSize: 11 }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
