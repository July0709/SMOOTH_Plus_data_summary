import { useMemo, useState } from 'react'
import { data, phylumData, fmt } from '../data'
import type { TreeNode, CityNode, PhylumGroupRow } from '../data'
import PhylumComposition from './PhylumComposition'
import { ChevronRight, Globe2, Flag, Building2, MapPin, Dna } from 'lucide-react'

const LEVELS = ['Continent', 'Country', 'Province', 'City'] as const
const ICONS = [Globe2, Flag, Building2, MapPin]

interface Crumb {
  name: string
  node: TreeNode | null
}

function isCity(n: TreeNode | CityNode): n is CityNode {
  return 'diseases' in n
}

export default function Explorer() {
  const [path, setPath] = useState<Crumb[]>([{ name: 'All', node: null }])
  const [selectedCity, setSelectedCity] = useState<string | null>(null)

  const current: (TreeNode | CityNode)[] = useMemo(() => {
    const node = path[path.length - 1].node
    return node ? (node.children as (TreeNode | CityNode)[]) : (data.tree as (TreeNode | CityNode)[])
  }, [path])

  const level = path.length - 1 // 0..3
  const total = current.reduce((s, n) => s + n.samples, 0)

  const drill = (node: TreeNode | CityNode) => {
    if (level >= 3 || isCity(node)) {
      // 城市不可再下钻，改为选中查看门水平组成
      setSelectedCity((cur) => (cur === node.name ? null : node.name))
      return
    }
    setSelectedCity(null)
    setPath([...path, { name: node.name, node }])
  }

  const jump = (i: number) => {
    setSelectedCity(null)
    setPath(path.slice(0, i + 1))
  }

  // 当前选中节点的门水平组成
  const composition = useMemo<{ title: string; row?: PhylumGroupRow } | null>(() => {
    if (selectedCity) {
      return {
        title: selectedCity,
        row: phylumData.byCity.find((r) => r.name === selectedCity),
      }
    }
    if (path.length <= 1) return null
    const key = ['byContinent', 'byCountry', 'byProvince'][path.length - 2] as
      | 'byContinent'
      | 'byCountry'
      | 'byProvince'
    const name = path[path.length - 1].name
    return { title: name, row: phylumData[key].find((r) => r.name === name) }
  }, [path, selectedCity])

  const LevelIcon = ICONS[Math.min(level, 3)]

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <h2 className="mb-4 text-center text-sm font-semibold uppercase tracking-[0.35em] text-[#7B61FF]">
        Explorer
      </h2>
      <p className="mb-10 text-center text-slate-600">
        逐层下钻：Continent → Country → Province → City，点击条目进入下一层级并查看该地的门水平组成。
      </p>

      {/* breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-sm">
        {path.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-300" />}
            <button
              onClick={() => jump(i)}
              className={`rounded-full border px-4 py-1.5 transition ${
                i === path.length - 1 && !selectedCity
                  ? 'border-[#FF4D8D] bg-[#FF4D8D]/10 font-medium text-[#E1306C]'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-[#4CC9F0]/60 hover:text-[#0E8FB8]'
              }`}
            >
              {c.name}
            </button>
          </span>
        ))}
        {selectedCity && (
          <span className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="rounded-full border border-[#FF4D8D] bg-[#FF4D8D]/10 px-4 py-1.5 font-medium text-[#E1306C]">
              {selectedCity}
            </span>
          </span>
        )}
      </div>

      {/* phylum composition of selected node */}
      {composition && (
        <div className="mb-6 rounded-3xl border-2 border-[#7B61FF]/25 bg-[#7B61FF]/[0.05] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Dna className="h-5 w-5 text-[#7B61FF]" />
            <h3 className="text-base font-semibold text-[#1F2430]">
              {composition.title} · Phylum composition
            </h3>
          </div>
          {composition.row ? (
            <PhylumComposition row={composition.row} />
          ) : (
            <p className="text-sm text-slate-500">
              该条目暂无匹配的门水平测序数据（phylum 矩阵覆盖 {phylumData.matchedProjects} 个项目）。
            </p>
          )}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LevelIcon className="h-5 w-5 text-[#FF4D8D]" />
            <h3 className="text-lg font-semibold text-[#1F2430]">{LEVELS[level]} level</h3>
          </div>
          <span className="text-sm text-slate-500">
            {current.length} entries · {fmt(total)} samples
          </span>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          {current.map((n) => {
            const pct = total ? (n.samples / total) * 100 : 0
            const leaf = level >= 3 || isCity(n)
            const selected = leaf && selectedCity === n.name
            return (
              <button
                key={n.name}
                onClick={() => drill(n)}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition ${
                  selected
                    ? 'border-[#FF4D8D] bg-[#FF4D8D]/[0.08]'
                    : 'border-slate-200 bg-white hover:border-[#FF4D8D]/50 hover:bg-[#FFF6FA]'
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FF9F1C]/15 to-transparent"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-800" title={n.name}>{n.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {fmt(n.samples)} samples · {n.projects} projects
                    </div>
                    {isCity(n) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {n.diseases.slice(0, 6).map((d) => (
                          <span key={d} className="rounded-full bg-[#4CC9F0]/10 px-2 py-0.5 text-[11px] text-[#0E8FB8]">
                            {d}
                          </span>
                        ))}
                        {n.diseases.length > 6 && (
                          <span className="px-1 text-[11px] text-slate-400">+{n.diseases.length - 6}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {leaf ? (
                    <Dna
                      className={`mt-0.5 h-4 w-4 shrink-0 transition ${
                        selected ? 'text-[#FF4D8D]' : 'text-slate-300 group-hover:text-[#FF4D8D]'
                      }`}
                    />
                  ) : (
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#FF4D8D]" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
