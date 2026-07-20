import { useMemo, useState, lazy, Suspense } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import { data, fmt } from '../data'
import { ChevronDown } from 'lucide-react'

const WorldMap = lazy(() => import('./WorldMap'))

type GeoKey = 'continent' | 'country' | 'province' | 'city'

const PALETTE = [
  '#FF4D8D', '#FF9F1C', '#4CC9F0', '#06D6A0', '#7B61FF', '#FFC300',
  '#F754A3', '#FFB84D', '#2BB3E6', '#34D399', '#9B7BFF', '#FFD84D',
  '#E1306C', '#F97316', '#0EA5E9', '#10B981', '#6D28D9', '#F59E0B',
  '#EC4899', '#14B8A6',
]

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid rgba(31,36,48,0.12)',
  borderRadius: 12,
  color: '#1F2430',
  fontSize: 13,
  boxShadow: '0 8px 24px rgba(31,36,48,0.12)',
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
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#4CC9F0]">
        Prevalence
      </h2>
      <p className="mb-12 text-center text-slate-600">
        世界地图按国家样本量填色，或切换地理层级 / 疾病维度查看分布。
      </p>

      {/* world map */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#1F2430]">World Map · Samples by Country</h3>
          <span className="text-sm text-slate-400">滚轮缩放 · 拖拽平移</span>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[480px] w-full items-center justify-center text-sm text-slate-400 sm:h-[540px]">
              地图加载中…
            </div>
          }
        >
          <WorldMap />
        </Suspense>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* geography bars */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1F2430]">Geography</h3>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              Group by
              <div className="relative">
                <select
                  value={geoKey}
                  onChange={(e) => setGeoKey(e.target.value as GeoKey)}
                  className="appearance-none rounded-xl border border-slate-200 bg-white py-2 pl-4 pr-9 text-sm capitalize text-[#1F2430] shadow-sm outline-none [&>option]:bg-white"
                >
                  {(['continent', 'country', 'province', 'city'] as const).map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          {/* sample-count gradient bars (HMC style) */}
          <div className="space-y-2.5">
            {geoRows.map((r) => (
              <div key={r.name} className="group flex items-center gap-3">
                <div className="w-36 shrink-0 truncate text-right text-[13px] text-slate-600" title={r.name}>
                  {r.name}
                </div>
                <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-slate-100">
                  <div
                    className="h-full rounded-md bg-gradient-to-r from-[#4CC9F0] to-[#FF4D8D] transition-all duration-500 group-hover:from-[#2BB3E6] group-hover:to-[#E1306C]"
                    style={{ width: `${Math.max((r.samples / maxGeo) * 100, 1.5)}%` }}
                  />
                </div>
                <div className="w-16 shrink-0 text-right text-[13px] font-semibold text-[#1F2430]">
                  {fmt(r.samples)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-end gap-3 text-xs text-slate-400">
            <span>Fewer</span>
            <span className="h-2.5 w-24 rounded-full bg-gradient-to-r from-[#4CC9F0]/50 to-[#FF4D8D]" />
            <span>More samples</span>
          </div>
        </div>

        {/* disease bars */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#1F2430]">Disease</h3>
            <span className="text-sm text-slate-400">Top 16 by samples</span>
          </div>
          <div className="h-[460px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseRows} layout="vertical" margin={{ left: 8, right: 44, top: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={88}
                  tick={{ fill: '#5B6372', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(31,36,48,0.05)' }}
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
                    style={{ fill: '#5B6372', fontSize: 11 }}
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
