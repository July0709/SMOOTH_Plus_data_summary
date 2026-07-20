import Hero from '../sections/Hero'
import Overview from '../sections/Overview'
import SearchSection from '../sections/SearchSection'
import Prevalence from '../sections/Prevalence'
import PhylaSection from '../sections/PhylaSection'
import Explorer from '../sections/Explorer'

export default function Home() {
  return (
    <div
      className="min-h-screen text-white antialiased"
      style={{
        background:
          'radial-gradient(1200px 600px at 50% -10%, #3b2066 0%, transparent 60%), linear-gradient(180deg, #2a1a4e 0%, #1c1338 45%, #160f2d 100%)',
        fontFamily: "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
      }}
    >
      <Hero />
      <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Overview />
      <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <SearchSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Prevalence />
      <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <PhylaSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <Explorer />

      <footer className="mt-10 border-t border-fuchsia-400/25 bg-[#2a1150]/80 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center text-sm text-purple-200/70">
          <p>
            数据来源：<span className="text-purple-100">SMITH-0331.xlsx · 城市已分配版本</span>
            　·　<span className="text-purple-100">phylum_overall_summary / phylum_count_by_sample</span>
          </p>
          <p>按 disease · continent · country · province · city · phylum 汇总 · 样本数以 sample_count 计</p>
        </div>
      </footer>
    </div>
  )
}
