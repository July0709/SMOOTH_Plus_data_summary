import Hero from '../sections/Hero'
import Overview from '../sections/Overview'
import SearchSection from '../sections/SearchSection'
import Prevalence from '../sections/Prevalence'
import PhylaSection from '../sections/PhylaSection'
import Explorer from '../sections/Explorer'

const DIVIDERS = ['#FF4D8D', '#FFC300', '#4CC9F0', '#06D6A0', '#7B61FF']

function Divider({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      className="mx-auto h-1 max-w-3xl rounded-full"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${color}66 30%, ${color}66 70%, transparent 100%)`,
      }}
    />
  )
}

export default function Home() {
  return (
    <div
      className="min-h-screen text-[#1F2430] antialiased"
      style={{
        background:
          'radial-gradient(1000px 520px at 50% -10%, #FFE1EF 0%, transparent 60%), linear-gradient(180deg, #FFF9F0 0%, #FFF3F7 45%, #EFF9FF 100%)',
        fontFamily: "'Inter', 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif",
      }}
    >
      <Hero />
      <Divider color={DIVIDERS[0]} />
      <Overview />
      <Divider color={DIVIDERS[1]} />
      <SearchSection />
      <Divider color={DIVIDERS[2]} />
      <Prevalence />
      <Divider color={DIVIDERS[3]} />
      <PhylaSection />
      <Divider color={DIVIDERS[4]} />
      <Explorer />

      <footer className="mt-10 border-t-2 border-[#FF4D8D]/20 bg-white/70 px-6 py-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center text-sm text-slate-500">
          <p>
            数据来源：<span className="font-medium text-[#E1306C]">SMITH-0331-Sproject.xlsx · 城市已分配版本</span>
            　·　<span className="font-medium text-[#5B3DF5]">phylum_overall_summary / phylum_count_by_sample</span>
          </p>
          <p>按 disease · continent · country · province · city · phylum 汇总 · 样本数以 sample_count 计</p>
        </div>
      </footer>
    </div>
  )
}
