import { data, fmt } from '../data'
import { Microscope, Globe2, Building2, MapPin, FlaskConical, Layers } from 'lucide-react'

const ICON_COLORS = ['#FF4D8D', '#FF9F1C', '#4CC9F0', '#06D6A0', '#7B61FF', '#FFC300']
const NUM_COLORS = ['#E1306C', '#5B3DF5', '#0E8FB8']

export default function Overview() {
  const s = data.summary
  const cards = [
    { icon: Microscope, big: `${fmt(s.totalSamples)} samples`, sub: `${s.totalProjects} projects` },
    { icon: FlaskConical, big: `${s.totalDiseases} diseases`, sub: 'disease / host types' },
    { icon: Globe2, big: `${s.totalContinents} continents`, sub: `${s.totalCountries} countries` },
    { icon: Building2, big: `${s.totalProvinces} provinces`, sub: '省 / 州级行政区' },
    { icon: MapPin, big: `${s.totalCities} cities`, sub: '城市已分配版本' },
    { icon: Layers, big: '48 phyla', sub: '门水平物种注释' },
  ]
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#FF4D8D]">
        Overview
      </h2>
      <p className="mx-auto mb-14 max-w-3xl text-center text-lg leading-relaxed text-slate-600">
        本数据集汇总了 <span className="font-semibold" style={{ color: NUM_COLORS[0] }}>{fmt(s.totalSamples)}</span> 条微生物组样本，
        覆盖 <span className="font-semibold" style={{ color: NUM_COLORS[1] }}>{s.totalDiseases}</span> 种疾病 / 宿主类型与
        <span className="font-semibold" style={{ color: NUM_COLORS[2] }}> {s.totalCountries}</span> 个国家，
        所有记录均已完成 continent → country → province → city 的地理匹配。
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
        {cards.map((c, i) => {
          const color = ICON_COLORS[i % ICON_COLORS.length]
          return (
            <div key={c.big} className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 10px 28px ${color}55` }}
              >
                <c.icon className="h-7 w-7 text-white" strokeWidth={1.6} />
              </div>
              <div className="text-lg font-semibold text-[#1F2430]">{c.big}</div>
              <div className="text-sm text-slate-500">{c.sub}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
