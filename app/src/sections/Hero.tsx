import { data, fmt } from '../data'

export default function Hero() {
  const s = data.summary
  return (
    <header className="relative overflow-hidden">
      {/* dotted contour decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(rgba(216,180,254,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
          maskImage:
            'radial-gradient(ellipse 60% 55% at 50% 42%, black 30%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 55% at 50% 42%, black 30%, transparent 75%)',
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-24 text-center">
        <div className="mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] border-2 border-fuchsia-200/70 shadow-[0_0_50px_rgba(217,70,239,0.35)]">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-fuchsia-100" fill="currentColor">
              <circle cx="12" cy="5.2" r="2.4" />
              <path d="M12 8.2c-2.9 0-4.6 1.7-4.6 4.2 0 1.5.5 2.6 1.1 3.6l.7 5.2c.1.9.9 1.6 1.8 1.6h2c.9 0 1.7-.7 1.8-1.6l.7-5.2c.6-1 1.1-2.1 1.1-3.6 0-2.5-1.7-4.2-4.6-4.2z" />
            </svg>
          </div>
          <div className="h-20 w-px bg-white/25" />
          <h1 className="text-left text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            SMOOTH Plus
            <br />
            Microbiome
            <br />
            Compendium
          </h1>
        </div>
        <p className="max-w-2xl text-lg leading-relaxed text-purple-100/85">
          基于「地理匹配更新 · 城市已分配版本」的数据汇总 —— 按
          <span className="mx-1 font-semibold text-fuchsia-200">Disease</span>/
          <span className="mx-1 font-semibold text-fuchsia-200">Continent</span>/
          <span className="mx-1 font-semibold text-fuchsia-200">Country</span>/
          <span className="mx-1 font-semibold text-fuchsia-200">Province</span>/
          <span className="mx-1 font-semibold text-fuchsia-200">City</span>
          五个维度探索 {fmt(s.totalSamples)} 条样本的地理与疾病分布。
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {[
            { label: `${fmt(s.totalSamples)} samples`, sub: `${s.totalProjects} projects` },
            { label: `${s.totalDiseases} diseases`, sub: '疾病 / 宿主类型' },
            { label: `${s.totalCountries} countries`, sub: `${s.totalCities} cities` },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-6 py-3.5 backdrop-blur-sm"
            >
              <div className="text-base font-semibold text-white">{c.label}</div>
              <div className="text-sm text-purple-200/70">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
