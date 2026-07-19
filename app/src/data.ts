import raw from './summary_data.json'

export interface AggRow {
  samples: number
  projects: number
  rows: number
  [key: string]: string | number
}

export interface DiseaseRow extends AggRow {
  disease: string
  zh: string
}

export interface CityNode {
  name: string
  samples: number
  projects: number
  diseases: string[]
}

export interface TreeNode {
  name: string
  samples: number
  projects: number
  children: TreeNode[] | CityNode[]
}

export interface SummaryData {
  summary: {
    totalSamples: number
    totalProjects: number
    totalDiseases: number
    totalContinents: number
    totalCountries: number
    totalProvinces: number
    totalCities: number
  }
  diseases: DiseaseRow[]
  continents: AggRow[]
  countries: AggRow[]
  provinces: AggRow[]
  cities: AggRow[]
  tree: TreeNode[]
  diseaseByContinent: Record<string, Record<string, number>>
}

export const data = raw as unknown as SummaryData

export const fmt = (n: number) => n.toLocaleString('en-US')

// ---------- Phylum ----------
import phylumRaw from './phylum_data.json'

export interface PhylumOverall {
  name: string
  speciesNumber: number
  totalCount: number
  relPct: number
}

export interface PhylumGroupRow {
  name: string
  totalCount: number
  projects: number
  Other: number
  [phylum: string]: string | number
}

export interface PhylumData {
  overall: PhylumOverall[]
  topPhyla: string[]
  byDisease: PhylumGroupRow[]
  byContinent: PhylumGroupRow[]
  byCountry: PhylumGroupRow[]
  byProvince: PhylumGroupRow[]
  byCity: PhylumGroupRow[]
  sampleColumns: number
  matchedProjects: number
  matchedSamples: number
}

export const phylumData = phylumRaw as unknown as PhylumData
