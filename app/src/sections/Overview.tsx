import { data, fmt } from '../data'
import { Microscope, Globe2, Building2, MapPin, FlaskConical, Layers } from 'lucide-react'

const NUM_COLORS = ['#E3C888', '#9FC0D4', '#C9A8D6']

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
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-4 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C8A45D]/60" />
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.45em] text-[#C8A45D]">
          Overview
        </h2>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C8A45D]/60" />
      </div>
      <p className="mx-auto mb-16 max-w-3xl text-center text-lg leading-relaxed text-slate-400">
        本数据集汇总了 <span className="font-semibold" style={{ color: NUM_COLORS[0] }}>{fmt(s.totalSamples)}</span> 条微生物组样本，
        覆盖 <span className="font-semibold" style={{ color: NUM_COLORS[1] }}>{s.totalDiseases}</span> 种疾病 / 宿主类型与
        <span className="font-semibold" style={{ color: NUM_COLORS[2] }}> {s.totalCountries}</span> 个国家，
        所有记录均已完成 continent → country → province → city 的地理匹配。
      </p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.big} className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/[0.06] shadow-[0_14px_36px_rgba(0,0,0,0.4)]">
              <c.icon className="h-7 w-7 text-[#E3C888]" strokeWidth={1.4} />
            </div>
            <div
              className="text-lg font-semibold tracking-wide text-[#F3EEE3]"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
            >
              {c.big}
            </div>
            <div className="mt-1 text-sm text-slate-500">{c.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
