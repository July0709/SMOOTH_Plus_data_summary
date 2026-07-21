import { data, fmt } from '../data'
import ParticleField from './ParticleField'

const DIM_COLORS = ['#E3C888', '#9FC0D4', '#C9A8D6', '#94C4AA', '#D09A8C']

const CARD_STYLES = [
  { border: 'border-[#C8A45D]/30', text: 'text-[#E3C888]', shadow: 'shadow-[0_18px_50px_rgba(0,0,0,0.45)]' },
  { border: 'border-[#C8A45D]/30', text: 'text-[#E3C888]', shadow: 'shadow-[0_18px_50px_rgba(0,0,0,0.45)]' },
  { border: 'border-[#C8A45D]/30', text: 'text-[#E3C888]', shadow: 'shadow-[0_18px_50px_rgba(0,0,0,0.45)]' },
]

export default function Hero() {
  const s = data.summary
  return (
    <header className="relative overflow-hidden">
      {/* 星尘粒子背景 */}
      <ParticleField />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-28 text-center">
        <div className="mb-10 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#C8A45D]/50 bg-[#C8A45D]/[0.06] shadow-[0_18px_50px_rgba(200,164,93,0.15)]">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-[#E3C888]" fill="currentColor">
              <circle cx="12" cy="5.2" r="2.4" />
              <path d="M12 8.2c-2.9 0-4.6 1.7-4.6 4.2 0 1.5.5 2.6 1.1 3.6l.7 5.2c.1.9.9 1.6 1.8 1.6h2c.9 0 1.7-.7 1.8-1.6l.7-5.2c.6-1 1.1-2.1 1.1-3.6 0-2.5-1.7-4.2-4.6-4.2z" />
            </svg>
          </div>
          <div className="h-20 w-px bg-gradient-to-b from-transparent via-[#C8A45D]/70 to-transparent" />
          <h1
            className="text-left text-4xl font-semibold leading-tight tracking-wide text-[#F3EEE3] sm:text-5xl"
            style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
          >
            SMOOTH Plus
            <br />
            <span className="bg-gradient-to-r from-[#E3C888] via-[#C8A45D] to-[#9FC0D4] bg-clip-text text-transparent">
              Microbiome
            </span>
            <br />
            Compendium
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-400">
          基于「地理匹配更新 · 城市已分配版本」的数据汇总 —— 按
          {['Disease', 'Continent', 'Country', 'Province', 'City'].map((d, i) => (
            <span key={d} className="mx-1 font-semibold" style={{ color: DIM_COLORS[i] }}>
              {d}
            </span>
          ))}
          五个维度探索 {fmt(s.totalSamples)} 条样本的地理与疾病分布。
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
          {[
            { label: `${fmt(s.totalSamples)} samples`, sub: `${s.totalProjects} projects` },
            { label: `${s.totalDiseases} diseases`, sub: '疾病 / 宿主类型' },
            { label: `${s.totalCountries} countries`, sub: `${s.totalCities} cities` },
          ].map((c, i) => (
            <div
              key={c.label}
              className={`rounded-xl border bg-white/[0.04] px-8 py-4 backdrop-blur-sm ${CARD_STYLES[i].border} ${CARD_STYLES[i].shadow}`}
            >
              <div
                className={`text-base font-semibold tracking-wide ${CARD_STYLES[i].text}`}
                style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
              >
                {c.label}
              </div>
              <div className="mt-0.5 text-sm text-slate-500">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
