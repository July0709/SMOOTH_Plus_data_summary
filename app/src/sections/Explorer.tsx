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
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-4 flex items-center justify-center gap-4">
        <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C8A45D]/60" />
        <h2 className="text-center text-sm font-medium uppercase tracking-[0.45em] text-[#C8A45D]">
          Explorer
        </h2>
        <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C8A45D]/60" />
      </div>
      <p className="mb-10 text-center text-slate-400">
        逐层下钻：Continent → Country → Province → City，点击条目进入下一层级并查看该地的门水平组成。
      </p>

      {/* breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 text-sm">
        {path.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
            <button
              onClick={() => jump(i)}
              className={`rounded-full border px-4 py-1.5 transition ${
                i === path.length - 1 && !selectedCity
                  ? 'border-[#C8A45D]/70 bg-[#C8A45D]/10 font-medium text-[#E3C888]'
                  : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-[#C8A45D]/40 hover:text-[#E3C888]'
              }`}
            >
              {c.name}
            </button>
          </span>
        ))}
        {selectedCity && (
          <span className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="rounded-full border border-[#C8A45D]/70 bg-[#C8A45D]/10 px-4 py-1.5 font-medium text-[#E3C888]">
              {selectedCity}
            </span>
          </span>
        )}
      </div>

      {/* phylum composition of selected node */}
      {composition && (
        <div className="mb-6 rounded-2xl border border-[#C8A45D]/25 bg-[#C8A45D]/[0.05] p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <Dna className="h-5 w-5 text-[#E3C888]" />
            <h3
              className="text-base font-semibold tracking-wide text-[#F3EEE3]"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
            >
              {composition.title} · Phylum composition
            </h3>
          </div>
          {composition.row ? (
            <PhylumComposition row={composition.row} />
          ) : (
            <p className="text-sm text-slate-400">
              该条目暂无匹配的门水平测序数据（phylum 矩阵覆盖 {phylumData.matchedProjects} 个项目）。
            </p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LevelIcon className="h-5 w-5 text-[#E3C888]" />
            <h3
              className="text-lg font-semibold tracking-wide text-[#F3EEE3]"
              style={{ fontFamily: "'Playfair Display', 'Noto Serif SC', serif" }}
            >
              {LEVELS[level]} level
            </h3>
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
                    ? 'border-[#C8A45D]/70 bg-[#C8A45D]/[0.08]'
                    : 'border-white/10 bg-white/[0.02] hover:border-[#C8A45D]/40 hover:bg-white/[0.05]'
                }`}
              >
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#C8A45D]/15 to-transparent"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-medium text-slate-200" title={n.name}>{n.name}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {fmt(n.samples)} samples · {n.projects} projects
                    </div>
                    {isCity(n) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {n.diseases.slice(0, 6).map((d) => (
                          <span key={d} className="rounded-full bg-[#7C9EB2]/10 px-2 py-0.5 text-[11px] text-[#9FC0D4]">
                            {d}
                          </span>
                        ))}
                        {n.diseases.length > 6 && (
                          <span className="px-1 text-[11px] text-slate-500">+{n.diseases.length - 6}</span>
                        )}
                      </div>
                    )}
                  </div>
                  {leaf ? (
                    <Dna
                      className={`mt-0.5 h-4 w-4 shrink-0 transition ${
                        selected ? 'text-[#E3C888]' : 'text-slate-600 group-hover:text-[#E3C888]'
                      }`}
                    />
                  ) : (
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-[#E3C888]" />
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
