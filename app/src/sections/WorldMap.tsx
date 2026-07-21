import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import worldGeo from '../world.geo.json'
import { data, fmt } from '../data'

// 数据中的国家名 → GeoJSON 中的国家名
const NAME_MAP: Record<string, string> = {
  USA: 'United States of America',
  UK: 'United Kingdom',
  'Korea,South': 'South Korea',
  Czechia: 'Czech Republic',
}

echarts.registerMap('world', worldGeo as never)

interface CountryDatum {
  name: string
  value: number
  projects: number
  rawName: string
}

const countryData: CountryDatum[] = data.countries
  .filter((c) => String(c.country) !== 'Unknown')
  .map((c) => {
    const raw = String(c.country)
    return {
      name: NAME_MAP[raw] ?? raw,
      value: c.samples,
      projects: c.projects,
      rawName: raw,
    }
  })

const MAX = Math.max(...countryData.map((c) => c.value), 1)

export default function WorldMap() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current, undefined, { renderer: 'canvas' })

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: '#12182B',
        borderColor: 'rgba(200,164,93,0.3)',
        textStyle: { color: '#EDEAE2', fontSize: 13 },
        formatter: (p: { data?: CountryDatum; name: string }) => {
          const d = p.data
          if (!d || d.value == null || Number.isNaN(d.value)) {
            return `<b>${p.name}</b><br/>无数据`
          }
          return `<b>${d.rawName}</b><br/>${fmt(d.value)} samples · ${d.projects} projects`
        },
      },
      visualMap: {
        min: 0,
        max: MAX,
        left: 12,
        bottom: 8,
        orient: 'horizontal',
        text: ['More samples', 'Fewer'],
        textStyle: { color: '#8A93A6', fontSize: 12 },
        inRange: { color: ['#232C44', '#4E5A7E', '#8A7B52', '#C8A45D', '#E3C888'] },
        calculable: false,
        itemWidth: 14,
        itemHeight: 120,
      },
      series: [
        {
          type: 'map',
          map: 'world',
          roam: true,
          scaleLimit: { min: 0.8, max: 8 },
          layoutCenter: ['50%', '52%'],
          layoutSize: '105%',
          itemStyle: {
            areaColor: 'rgba(255,255,255,0.035)',
            borderColor: 'rgba(148,163,184,0.28)',
            borderWidth: 0.6,
          },
          emphasis: {
            label: { show: false },
            itemStyle: { areaColor: '#C8A45D', shadowBlur: 20, shadowColor: 'rgba(200,164,93,0.55)' },
          },
          select: { disabled: true },
          data: countryData,
          nameProperty: 'name',
        },
      ],
    })

    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => {
      ro.disconnect()
      chart.dispose()
    }
  }, [])

  return <div ref={ref} className="h-[480px] w-full sm:h-[540px]" />
}
