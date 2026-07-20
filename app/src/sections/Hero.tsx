import { data, fmt } from '../data'
import ParticleField from './ParticleField'

const DIM_COLORS = ['#FF4D8D', '#FF9F1C', '#4CC9F0', '#06D6A0', '#7B61FF']

const CARD_STYLES = [
  { border: 'border-[#FF4D8D]/40', text: 'text-[#E1306C]', shadow: 'shadow-[0_8px_30px_rgba(255,77,141,0.18)]' },
  { border: 'border-[#FF9F1C]/50', text: 'text-[#D97706]', shadow: 'shadow-[0_8px_30px_rgba(255,159,28,0.18)]' },
  { border: 'border-[#4CC9F0]/50', text: 'text-[#0E8FB8]', shadow: 'shadow-[0_8px_30px_rgba(76,201,240,0.2)]' },
]

export default function Hero() {
  const s = data.summary
  return (
    <header className="relative overflow-hidden">
      {/* 多巴胺粒子背景 */}
      <ParticleField />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center">
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border-2 border-[#FF4D8D] bg-white shadow-[0_10px_40px_rgba(255,77,141,0.35)]">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#FF4D8D]" fill="currentColor">
              <circle cx="12" cy="5.2" r="2.4" />
              <path d="M12 8.2c-2.9 0-4.6 1.7-4.6 4.2 0 1.5.5 2.6 1.1 3.6l.7 5.2c.1.9.9 1.6 1.8 1.6h2c.9 0 1.7-.7 1.8-1.6l.7-5.2c.6-1 1.1-2.1 1.1-3.6 0-2.5-1.7-4.2-4.6-4.2z" />
            </svg>
          </div>
          <div className="h-20 w-1 rounded-full bg-gradient-to-b from-[#FF4D8D] via-[#FFC300] to-[#4CC9F0]" />
          <h1 className="text-left text-4xl font-bold leading-tight tracking-tight text-[#1F2430] sm:text-5xl">
            SMOOTH Plus
            <br />
            <span className="bg-gradient-to-r from-[#FF4D8D] via-[#FF9F1C] to-[#7B61FF] bg-clip-text text-transparent">
              Microbiome
            </span>
            <br />
            Compendium
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
          基于「地理匹配更新 · 城市已分配版本」的数据汇总 —— 按
          {['Disease', 'Continent', 'Country', 'Province', 'City'].map((d, i) => (
            <span key={d} className="mx-1 font-semibold" style={{ color: DIM_COLORS[i] }}>
              {d}
            </span>
          ))}
          五个维度探索 {fmt(s.totalSamples)} 条样本的地理与疾病分布。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {[
            { label: `${fmt(s.totalSamples)} samples`, sub: `${s.totalProjects} projects` },
            { label: `${s.totalDiseases} diseases`, sub: '疾病 / 宿主类型' },
            { label: `${s.totalCountries} countries`, sub: `${s.totalCities} cities` },
          ].map((c, i) => (
            <div
              key={c.label}
              className={`rounded-2xl border-2 bg-white/85 px-6 py-3.5 backdrop-blur-sm ${CARD_STYLES[i].border} ${CARD_STYLES[i].shadow}`}
            >
              <div className={`text-base font-semibold ${CARD_STYLES[i].text}`}>{c.label}</div>
              <div className="text-sm text-slate-500">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
