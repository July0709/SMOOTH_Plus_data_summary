import Hero from '../sections/Hero'
import Overview from '../sections/Overview'
import SearchSection from '../sections/SearchSection'
import Prevalence from '../sections/Prevalence'
import PhylaSection from '../sections/PhylaSection'
import Explorer from '../sections/Explorer'

function Divider() {
  return (
    <div aria-hidden className="mx-auto flex max-w-3xl items-center gap-5 px-6">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#C8A45D]/45" />
      <div className="h-1.5 w-1.5 rotate-45 border border-[#C8A45D]/70" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#C8A45D]/45" />
    </div>
  )
}

export default function Home() {
  return (
    <div
      className="min-h-screen text-[#EDEAE2] antialiased"
      style={{
        background:
          'radial-gradient(1100px 560px at 50% -12%, rgba(200,164,93,0.10) 0%, transparent 62%), radial-gradient(900px 500px at 88% 30%, rgba(124,158,178,0.05) 0%, transparent 60%), linear-gradient(180deg, #0B1020 0%, #0A0E1A 45%, #0B1120 100%)',
        fontFamily: "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
      }}
    >
      <Hero />
      <Divider />
      <Overview />
      <Divider />
      <SearchSection />
      <Divider />
      <Prevalence />
      <Divider />
      <PhylaSection />
      <Divider />
      <Explorer />

      <footer className="mt-10 border-t border-[#C8A45D]/15 bg-black/20 px-6 py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center text-sm text-slate-500">
          <p>
            数据来源：<span className="font-medium text-[#E3C888]">SMITH-0331-Sproject.xlsx · 城市已分配版本</span>
            　·　<span className="font-medium text-[#9FC0D4]">phylum_overall_summary / phylum_count_by_sample</span>
          </p>
          <p>按 disease · continent · country · province · city · phylum 汇总 · 样本数以 sample_count 计</p>
        </div>
      </footer>
    </div>
  )
}
