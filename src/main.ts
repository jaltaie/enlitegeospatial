import mapboxgl from 'mapbox-gl'
import './style.css'
import { manualData } from './data/manualData'
import { saudiEastWestPipelineData, type SaudiPipelineFeature } from './data/saudiEastWestPipeline'

// Prefer VITE_MAPBOX_TOKEN from .env.local, but keep a placeholder as a visible fallback.
const configuredToken = (import.meta.env.VITE_MAPBOX_TOKEN ?? 'YOUR_MAPBOX_TOKEN_HERE').trim()
const hasValidMapboxToken = configuredToken.length > 0 && configuredToken !== 'YOUR_MAPBOX_TOKEN_HERE'

if (hasValidMapboxToken) {
  mapboxgl.accessToken = configuredToken
}

interface InfrastructureFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    name: string
    type: string
    category: 'upstream' | 'pipelines' | 'storage' | 'refineries' | 'terminals' | 'damage'
    country?: string
    event_date?: string
    confidence?: string
    damage_status?: 'confirmed' | 'suspected' | 'minimal' | 'severe'
    capacity?: string
    notes?: string
    comment?: string
    [key: string]: any
  }
}

function inferCountryFromCoordinates([lng, lat]: [number, number]): string {
  if (lng >= 44 && lng <= 64 && lat >= 25 && lat <= 40) return 'Iran'
  if (lng >= 38 && lng <= 51 && lat >= 28 && lat <= 38) return 'Iraq'
  if (lng >= 46 && lng <= 49 && lat >= 28 && lat <= 31) return 'Kuwait'
  if (lng >= 34 && lng <= 56 && lat >= 16 && lat <= 33) return 'Saudi Arabia'
  if (lng >= 50 && lng <= 52.1 && lat >= 24 && lat <= 26.4) return 'Qatar'
  if (lng >= 51 && lng <= 57 && lat >= 22 && lat <= 27) return 'UAE'
  if (lng >= 50 && lng <= 51 && lat >= 25.5 && lat <= 27) return 'Bahrain'
  if (lng >= 52 && lng <= 60 && lat >= 16 && lat <= 27) return 'Oman'
  if (lng >= 35 && lng <= 45 && lat >= 31 && lat <= 42) return 'Syria'
  if (lng >= 35 && lng <= 43 && lat >= 35 && lat <= 43) return 'Turkey'
  if (lng >= 44 && lng <= 51 && lat >= 38 && lat <= 42) return 'Azerbaijan'
  if (lng >= 52 && lng <= 67 && lat >= 35 && lat <= 43) return 'Turkmenistan'
  if (lng >= 60 && lng <= 75 && lat >= 25 && lat <= 39) return 'Afghanistan'
  if (lng >= 60 && lng <= 78 && lat >= 23 && lat <= 37) return 'Pakistan'
  if (lng >= 34 && lng <= 41 && lat >= 29 && lat <= 34) return 'Jordan'
  if (lng >= 34 && lng <= 36 && lat >= 29 && lat <= 34) return 'Israel/Palestine'
  if (lng >= 35 && lng <= 37 && lat >= 33 && lat <= 35) return 'Lebanon'
  if (lng >= 40 && lng <= 47 && lat >= 41 && lat <= 44.5) return 'Georgia'
  if (lng >= 43 && lng <= 47 && lat >= 38 && lat <= 41.5) return 'Armenia'
  if (lng >= 42 && lng <= 55 && lat >= 12 && lat <= 20) return 'Yemen'
  if (lng >= 24 && lng <= 37 && lat >= 21 && lat <= 32) return 'Egypt'
  if (lng >= 55 && lng <= 74 && lat >= 37 && lat <= 46) return 'Uzbekistan'
  if (lng >= 69 && lng <= 81 && lat >= 39 && lat <= 44) return 'Kyrgyzstan'
  if (lng >= 67 && lng <= 75 && lat >= 36 && lat <= 41) return 'Tajikistan'

  return 'Unknown'
}

function withCountry(feature: InfrastructureFeature): InfrastructureFeature {
  const inferredCountry = inferCountryFromCoordinates(feature.geometry.coordinates)
  return {
    ...feature,
    properties: {
      ...feature.properties,
      country: feature.properties.country ?? inferredCountry
    }
  }
}

function abbreviateName(name: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/\bRefinery\b/gi, 'Ref.'],
    [/\bProcessing\b/gi, 'Proc.'],
    [/\bTerminal\b/gi, 'Term.'],
    [/\bComplex\b/gi, 'Cplx'],
    [/\bStation\b/gi, 'Stn'],
    [/\bDistribution\b/gi, 'Dist.'],
    [/\bTransfer\b/gi, 'Xfer'],
    [/\bPipeline\b/gi, 'Pipe'],
    [/\bGathering\b/gi, 'Gath.'],
    [/\bCompressor\b/gi, 'Compr.'],
    [/\bOnshore\b/gi, 'Onsh.'],
    [/\bOffshore\b/gi, 'Offsh.'],
    [/\bFacility\b/gi, 'Fac.'],
    [/\bCorridor\b/gi, 'Cor.'],
    [/\bStrategic\b/gi, 'Strat.'],
    [/\bProduction\b/gi, 'Prod.'],
    [/\bInfrastructure\b/gi, 'Infra.'],
    [/\bStorage\b/gi, 'Stor.'],
    [/\bExport\b/gi, 'Exp.'],
    [/\bDamage\b/gi, 'Dmg.']
  ]

  let shortened = name
  for (const [pattern, replacement] of replacements) {
    shortened = shortened.replace(pattern, replacement)
  }

  if (shortened.length > 28) {
    shortened = `${shortened.slice(0, 25).trimEnd()}...`
  }

  return shortened
}

function withShortName(feature: InfrastructureFeature): InfrastructureFeature {
  const shortName = abbreviateName(feature.properties.name)
  return {
    ...feature,
    properties: {
      ...feature.properties,
      short_name: shortName
    }
  }
}

// Expanded demonstration dataset across Iran.
// Replace with your verified conflict dataset for production use.
const sampleData: InfrastructureFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.5707, 27.4767]
    },
    properties: {
      name: 'South Pars Gas Complex',
      type: 'Gas Processing Hub',
      category: 'upstream',
      capacity: '700 MMcm/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.6753, 31.3190]
    },
    properties: {
      name: 'Ahvaz Oil Field Cluster',
      type: 'Onshore Production Field',
      category: 'upstream',
      capacity: '650,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.8386, 30.3475]
    },
    properties: {
      name: 'Gachsaran Production Area',
      type: 'Onshore Production Field',
      category: 'upstream',
      capacity: '500,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [46.2919, 38.0798]
    },
    properties: {
      name: 'Tabriz Production Support Site',
      type: 'Field Services Hub',
      category: 'upstream'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.1840, 32.4279]
    },
    properties: {
      name: 'Central Trunkline Junction',
      type: 'Pipeline Node',
      category: 'pipelines'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.8765, 34.6401]
    },
    properties: {
      name: 'Northbound Transmission Segment',
      type: 'Pipeline Segment',
      category: 'pipelines'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.4679, 36.2742]
    },
    properties: {
      name: 'West-East Transmission Link',
      type: 'Pipeline Segment',
      category: 'pipelines'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [51.5181, 35.5541]
    },
    properties: {
      name: 'Rey Strategic Storage',
      type: 'Storage Facility',
      category: 'storage',
      capacity: '11 MMbbl'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [56.2749, 27.1832]
    },
    properties: {
      name: 'Bandar Abbas Tank Farm',
      type: 'Storage Facility',
      category: 'storage',
      capacity: '8 MMbbl'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [46.2927, 38.0698]
    },
    properties: {
      name: 'Tabriz Tank Farm',
      type: 'Storage Facility',
      category: 'storage'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.3043, 30.3479]
    },
    properties: {
      name: 'Abadan Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '400,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [51.7070, 32.6539]
    },
    properties: {
      name: 'Isfahan Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '375,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.6885, 34.0940]
    },
    properties: {
      name: 'Arak Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '250,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [51.4102, 35.6223]
    },
    properties: {
      name: 'Tehran Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '250,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.1000, 25.0500]
    },
    properties: {
      name: 'Ghawar Supergiant Field',
      type: 'Onshore Oilfield',
      category: 'upstream',
      capacity: '3,000,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.6800, 25.9400]
    },
    properties: {
      name: 'Abqaiq Processing and Stabilization',
      type: 'Oil Processing Hub',
      category: 'upstream',
      capacity: '7,000,000 bbl/day processing'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.9300, 25.2900]
    },
    properties: {
      name: 'Khurais Field',
      type: 'Onshore Oilfield',
      category: 'upstream',
      capacity: '1,500,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.9800, 24.8900]
    },
    properties: {
      name: 'Shaybah Field',
      type: 'Onshore Oilfield',
      category: 'upstream',
      capacity: '1,000,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.5800, 28.1500]
    },
    properties: {
      name: 'Safaniyah Offshore Field',
      type: 'Offshore Oilfield',
      category: 'upstream',
      capacity: '1,300,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [47.9700, 29.3600]
    },
    properties: {
      name: 'Burgan Field Complex',
      type: 'Onshore Oilfield',
      category: 'upstream',
      capacity: '1,700,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.6000, 24.1700]
    },
    properties: {
      name: 'Dukhan Oilfield',
      type: 'Onshore Oilfield',
      category: 'upstream',
      capacity: '300,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [53.7900, 24.3200]
    },
    properties: {
      name: 'Upper Zakum Field',
      type: 'Offshore Oilfield',
      category: 'upstream',
      capacity: '750,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [54.4600, 24.4200]
    },
    properties: {
      name: 'Murban Bab Field Cluster',
      type: 'Onshore Oilfield',
      category: 'upstream',
      capacity: '1,600,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [56.4500, 24.4200]
    },
    properties: {
      name: 'Saih Rawl Gas-Condensate Field',
      type: 'Gas Condensate Field',
      category: 'upstream',
      capacity: '110,000 bbl/day liquids'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.0000, 26.6200]
    },
    properties: {
      name: 'Ras Tanura Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '550,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.6400, 27.0200]
    },
    properties: {
      name: 'SATORP Jubail Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '400,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [39.1300, 23.9800]
    },
    properties: {
      name: 'Yanbu Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '250,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [47.9800, 29.0800]
    },
    properties: {
      name: 'Mina Al Ahmadi Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '466,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.1200, 29.0500]
    },
    properties: {
      name: 'Mina Abdullah Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '270,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [47.7200, 28.9500]
    },
    properties: {
      name: 'Al Zour Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '615,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.5900, 26.1600]
    },
    properties: {
      name: 'Bapco Sitra Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '267,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [56.7400, 24.3500]
    },
    properties: {
      name: 'Sohar Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '198,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [57.7100, 19.6500]
    },
    properties: {
      name: 'Duqm Refinery',
      type: 'Refinery',
      category: 'refineries',
      capacity: '230,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [53.3500, 24.1200]
    },
    properties: {
      name: 'Ruwais Refinery Complex',
      type: 'Refinery',
      category: 'refineries',
      capacity: '800,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [56.3600, 25.1300]
    },
    properties: {
      name: 'Fujairah Refining Hub',
      type: 'Refinery',
      category: 'refineries',
      capacity: '85,000 bbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.3256, 29.2394]
    },
    properties: {
      name: 'Kharg Island Terminal',
      type: 'Export Terminal',
      category: 'terminals',
      capacity: '5 MMbbl/day'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [53.3719, 26.8017]
    },
    properties: {
      name: 'Lavan Island Terminal',
      type: 'Export Terminal',
      category: 'terminals'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [54.5465, 25.8847]
    },
    properties: {
      name: 'Sirri Island Terminal',
      type: 'Export Terminal',
      category: 'terminals'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [56.2810, 27.1931]
    },
    properties: {
      name: 'Bandar Abbas Export Terminal',
      type: 'Export Terminal',
      category: 'terminals'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.2924, 30.3361]
    },
    properties: {
      name: 'Abadan Refinery Unit 2',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'severe'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [48.7012, 31.3311]
    },
    properties: {
      name: 'Ahvaz Gathering Station',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.3103, 29.2140]
    },
    properties: {
      name: 'Kharg Loading Berth Area',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [56.2478, 27.1650]
    },
    properties: {
      name: 'Bandar Abbas Jetty Corridor',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [51.3985, 35.5981]
    },
    properties: {
      name: 'Rey Pipeline Manifold',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [51.6751, 32.6397]
    },
    properties: {
      name: 'Isfahan Utility Block',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [49.6766, 34.0824]
    },
    properties: {
      name: 'Arak Distillation Area',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [46.3034, 38.0811]
    },
    properties: {
      name: 'Tabriz Storage Rack B',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [52.5628, 27.4918]
    },
    properties: {
      name: 'South Pars Compressor Train',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'severe'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [50.8269, 30.3334]
    },
    properties: {
      name: 'Gachsaran Manifold 4',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [53.3572, 26.7801]
    },
    properties: {
      name: 'Lavan Transfer Station',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [54.5331, 25.8749]
    },
    properties: {
      name: 'Sirri Metering Skid',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [51.4289, 35.6355]
    },
    properties: {
      name: 'Tehran Refinery Pipe Rack',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed'
    }
  }
]

// Regional damage entries for surrounding countries (demonstration records).
const regionalDamageData: InfrastructureFeature[] = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [47.8140, 30.5085] },
    properties: {
      name: 'Basra Export Corridor',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Iraq',
      event_date: '2026-03-14',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [44.3661, 35.4681] },
    properties: {
      name: 'Kirkuk Transfer Manifold',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Iraq',
      event_date: '2026-02-06',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [47.9874, 29.3759] },
    properties: {
      name: 'Mina Al Ahmadi Handling Zone',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Kuwait',
      event_date: '2026-01-28',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.6481, 26.9580] },
    properties: {
      name: 'Eastern Province Stabilization Unit',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Saudi Arabia',
      event_date: '2026-02-18',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.5223, 25.2867] },
    properties: {
      name: 'Ras Laffan Processing Train',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Qatar',
      event_date: '2026-03-02',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [54.3667, 24.4539] },
    properties: {
      name: 'Abu Dhabi Export Feedline',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'UAE',
      event_date: '2026-01-19',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [35.8263, 36.9877] },
    properties: {
      name: 'Ceyhan Receipt Segment',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Turkey',
      event_date: '2026-02-12',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [40.1553, 35.3358] },
    properties: {
      name: 'Euphrates Pumping Cluster',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'severe',
      country: 'Syria',
      event_date: '2026-03-11',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.8932, 40.4093] },
    properties: {
      name: 'Baku Coastal Metering Point',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Azerbaijan',
      event_date: '2026-01-30',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [52.9552, 40.0220] },
    properties: {
      name: 'Turkmenbashi Transfer Node',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Turkmenistan',
      event_date: '2026-03-05',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [62.1910, 34.3529] },
    properties: {
      name: 'Herat Distribution Spur',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Afghanistan',
      event_date: '2026-02-25',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [62.3295, 25.1264] },
    properties: {
      name: 'Gwadar Marine Intake Link',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Pakistan',
      event_date: '2026-03-09',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [50.5852, 26.2235] },
    properties: {
      name: 'Bahrain Offshore Transfer Spur',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Bahrain',
      event_date: '2026-02-02',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [58.5663, 23.6143] },
    properties: {
      name: 'Muscat Import Terminal Spur',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Oman',
      event_date: '2026-03-17',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.6763, 25.9347] },
    properties: {
      name: 'Abqaiq Processing Center',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'severe',
      country: 'Saudi Arabia',
      event_date: '2026-03-21',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [48.9202, 25.2988] },
    properties: {
      name: 'Khurais Oilfield Stabilization Trains',
      type: 'Oilfield Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Saudi Arabia',
      event_date: '2026-03-08',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.0990, 25.0971] },
    properties: {
      name: 'Ghawar North Gathering Hub',
      type: 'Oilfield Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Saudi Arabia',
      event_date: '2026-02-19',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.9882, 26.6163] },
    properties: {
      name: 'Ras Tanura Refinery Transfer Block',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Saudi Arabia',
      event_date: '2026-03-12',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.6583, 27.0174] },
    properties: {
      name: 'Jubail Refinery Utility Grid',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Saudi Arabia',
      event_date: '2026-02-23',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [38.0641, 24.0898] },
    properties: {
      name: 'Yanbu Refinery Distillation Zone',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Saudi Arabia',
      event_date: '2026-03-04',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [50.0901, 28.1582] },
    properties: {
      name: 'Mina Al Ahmadi Refinery Crude Unit',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Kuwait',
      event_date: '2026-03-16',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [48.1243, 29.0620] },
    properties: {
      name: 'Mina Abdullah Refinery Expansion Block',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Kuwait',
      event_date: '2026-02-20',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [47.7347, 28.9927] },
    properties: {
      name: 'Al Zour Refinery Power Corridor',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Kuwait',
      event_date: '2026-01-26',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.5320, 25.9495] },
    properties: {
      name: 'Ras Laffan GTL Processing Trains',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Qatar',
      event_date: '2026-03-18',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [52.6026, 24.1688] },
    properties: {
      name: 'Dukhan Onshore Oilfield Wells Cluster',
      type: 'Oilfield Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Qatar',
      event_date: '2026-02-11',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [53.3436, 24.1127] },
    properties: {
      name: 'Ruwais Refinery Hydrocracker Zone',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'UAE',
      event_date: '2026-03-07',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [56.3568, 25.1324] },
    properties: {
      name: 'Fujairah Refining and Storage Link',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'UAE',
      event_date: '2026-01-22',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [50.5910, 26.1545] },
    properties: {
      name: 'Sitra Refinery Distillation Unit',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Bahrain',
      event_date: '2026-02-16',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [56.7392, 24.3499] },
    properties: {
      name: 'Sohar Refinery Transfer Compound',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Oman',
      event_date: '2026-03-19',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [57.7117, 19.6451] },
    properties: {
      name: 'Duqm Refinery Marine Intake Block',
      type: 'Refinery Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Oman',
      event_date: '2026-02-01',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [36.0672, 31.9405] },
    properties: {
      name: 'Jordan River Product Line Node',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Jordan',
      event_date: '2026-01-24',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [35.2137, 31.7710] },
    properties: {
      name: 'Mediterranean Feedline Junction',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Israel/Palestine',
      event_date: '2026-03-06',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [35.5080, 33.8938] },
    properties: {
      name: 'Beirut Coastal Fuel Depot Link',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Lebanon',
      event_date: '2026-02-09',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [43.8472, 40.1792] },
    properties: {
      name: 'Tbilisi Product Pipeline Segment',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Georgia',
      event_date: '2026-01-31',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [44.5152, 40.1872] },
    properties: {
      name: 'Yerevan Fuel Transfer Node',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Armenia',
      event_date: '2026-03-03',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [42.4509, 18.9712] },
    properties: {
      name: 'Red Sea Shipping Fuel Link',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Yemen',
      event_date: '2026-03-10',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [31.2357, 30.0444] },
    properties: {
      name: 'Cairo Strategic Product Pump',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Egypt',
      event_date: '2026-02-14',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [44.3661, 33.3152] },
    properties: {
      name: 'Baghdad Inland Fuel Hub',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Iraq',
      event_date: '2026-03-15',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [66.9237, 39.6542] },
    properties: {
      name: 'Samarkand Product Relay Node',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Uzbekistan',
      event_date: '2026-02-27',
      confidence: 'high',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [69.2401, 41.2995] },
    properties: {
      name: 'Tashkent Distribution Spur',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'minimal',
      country: 'Uzbekistan',
      event_date: '2026-02-05',
      confidence: 'medium',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [74.6120, 42.8746] },
    properties: {
      name: 'Bishkek Fuel Handling Spur',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'suspected',
      country: 'Kyrgyzstan',
      event_date: '2026-03-01',
      confidence: 'low',
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [68.7739, 38.5598] },
    properties: {
      name: 'Dushanbe Fuel Pumping Yard',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Tajikistan',
      event_date: '2026-03-13',
      confidence: 'medium',
    }
  }
]

const allFeatures: InfrastructureFeature[] = [
  ...sampleData,
  ...regionalDamageData,
  ...(manualData as InfrastructureFeature[])
]
  .map(withCountry)
  .map(withShortName)

const saudiEastWestPipelineFeatures: SaudiPipelineFeature[] = saudiEastWestPipelineData

const SAUDI_EW_LAYER_IDS = ['saudi-ew-pipeline-route', 'saudi-ew-pipeline-nodes'] as const
const PROJECT_VIEWS = ['regional-damage', 'saudi-ew-pipeline'] as const

type ProjectView = (typeof PROJECT_VIEWS)[number]

const featuresByCategory = allFeatures.reduce<Record<string, InfrastructureFeature[]>>((acc, feature) => {
  const category = feature.properties.category
  if (!acc[category]) {
    acc[category] = []
  }
  acc[category].push(feature)
  return acc
}, {})

class InfrastructureMap {
  map: mapboxgl.Map
  projectView: ProjectView
  hoveredFeatureId: string | number | undefined = undefined
  statusElement: HTMLDivElement | null = null
  selectedCountry = 'All'
  layerVisibility: Record<string, boolean> = {
    upstream: true,
    pipelines: true,
    'saudi-ew-pipeline': true,
    storage: true,
    refineries: true,
    terminals: true,
    damage: true,
    labels: false
  }

  constructor(projectView: ProjectView) {
    this.projectView = projectView
    this.applyProjectDefaults()
    this.syncControlState()

    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [52.5, 32.0],
      zoom: 5,
      pitch: 0,
      bearing: 0
    })

    this.createStatusBanner()

    this.map.on('load', () => this.onMapLoad())
    this.map.on('error', (event) => {
      console.error('Map rendering error:', event.error)
      this.showStatus(
        'Map tiles failed to load. If this persists, set VITE_MAPBOX_TOKEN in .env.local and restart dev server.'
      )
    })
  }

  applyProjectDefaults() {
    if (this.projectView !== 'saudi-ew-pipeline') {
      return
    }

    this.selectedCountry = 'Saudi Arabia'
    this.layerVisibility = {
      upstream: false,
      pipelines: false,
      'saudi-ew-pipeline': true,
      storage: false,
      refineries: false,
      terminals: false,
      damage: false,
      labels: false
    }
  }

  syncControlState() {
    const checkboxes = document.querySelectorAll(
      '.layer-controls input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>

    checkboxes.forEach((checkbox) => {
      const layerId = checkbox.getAttribute('data-layer')
      if (!layerId) {
        return
      }

      if (layerId in this.layerVisibility) {
        checkbox.checked = this.layerVisibility[layerId]
      }
    })
  }

  createStatusBanner() {
    const container = document.querySelector('#layer-controls') as HTMLElement | null
    if (!container) {
      return
    }

    const status = document.createElement('div')
    status.className = 'map-status'
    status.style.cssText =
      'margin-top:8px;padding:8px 10px;border-radius:6px;background:rgba(255,165,0,0.15);border:1px solid rgba(255,165,0,0.35);font-size:12px;color:#ffd8a8;display:none;'

    container.appendChild(status)
    this.statusElement = status
  }

  showStatus(message: string) {
    if (!this.statusElement) {
      return
    }
    this.statusElement.textContent = message
    this.statusElement.style.display = 'block'
  }

  onMapLoad() {
    // Add source for all infrastructure features
    this.map.addSource('infrastructure', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: allFeatures
      }
    })

    // Create layers for each category
    this.createUpstreamLayer()
    this.createMidstreamLayers()
    this.createSaudiEastWestPipelineLayer()
    this.createDownstreamLayers()
    this.createDamageLayer()
    this.createLabelsLayer()

    this.setupLayerControls()
    this.setupCountryControls()
    this.applyDataFilters()
    this.setupLayerInteractions()

    if (this.projectView === 'saudi-ew-pipeline') {
      this.focusLayer('saudi-ew-pipeline')
      this.showStatus('Saudi East/West pipeline project loaded.')
      return
    }

    this.fitMapToFeatures(allFeatures)
  }

  fitMapToFeatures(features: InfrastructureFeature[]) {
    if (!features.length) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds(features[0].geometry.coordinates, features[0].geometry.coordinates)
    for (let i = 1; i < features.length; i += 1) {
      bounds.extend(features[i].geometry.coordinates)
    }

    this.map.fitBounds(bounds, {
      padding: 50,
      maxZoom: 5.5,
      duration: 800
    })
  }

  createUpstreamLayer() {
    this.map.addLayer({
      id: 'upstream',
      type: 'circle',
      source: 'infrastructure',
      filter: ['==', ['get', 'category'], 'upstream'],
      paint: {
        'circle-radius': 8,
        'circle-color': '#4a90e2',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#2c5cbb',
        'circle-opacity': 0.8
      }
    })
  }

  createMidstreamLayers() {
    // Pipelines layer
    this.map.addLayer({
      id: 'pipelines',
      type: 'circle',
      source: 'infrastructure',
      filter: ['==', ['get', 'category'], 'pipelines'],
      paint: {
        'circle-radius': 7,
        'circle-color': '#f5a623',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#d68910',
        'circle-opacity': 0.8
      }
    })

    // Storage facilities layer
    this.map.addLayer({
      id: 'storage',
      type: 'circle',
      source: 'infrastructure',
      filter: ['==', ['get', 'category'], 'storage'],
      paint: {
        'circle-radius': 9,
        'circle-color': '#f8e71c',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#d4af37',
        'circle-opacity': 0.8
      }
    })
  }

  createSaudiEastWestPipelineLayer() {
    this.map.addSource('saudi-ew-pipeline', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: saudiEastWestPipelineFeatures
      }
    })

    this.map.addLayer({
      id: 'saudi-ew-pipeline-route',
      type: 'line',
      source: 'saudi-ew-pipeline',
      filter: ['==', ['geometry-type'], 'LineString'],
      paint: {
        'line-color': '#19d3a2',
        'line-width': 4,
        'line-opacity': 0.95
      }
    })

    this.map.addLayer({
      id: 'saudi-ew-pipeline-nodes',
      type: 'circle',
      source: 'saudi-ew-pipeline',
      filter: ['==', ['geometry-type'], 'Point'],
      paint: {
        'circle-radius': 7,
        'circle-color': '#19d3a2',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#0f8b6c',
        'circle-opacity': 0.9
      }
    })
  }

  createDownstreamLayers() {
    // Refineries layer
    this.map.addLayer({
      id: 'refineries',
      type: 'circle',
      source: 'infrastructure',
      filter: ['==', ['get', 'category'], 'refineries'],
      paint: {
        'circle-radius': 10,
        'circle-color': '#e74c3c',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#c0392b',
        'circle-opacity': 0.8
      }
    })

    // Export terminals layer
    this.map.addLayer({
      id: 'terminals',
      type: 'circle',
      source: 'infrastructure',
      filter: ['==', ['get', 'category'], 'terminals'],
      paint: {
        'circle-radius': 10,
        'circle-color': '#9b59b6',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#8e44ad',
        'circle-opacity': 0.8
      }
    })
  }

  createDamageLayer() {
    this.map.addLayer({
      id: 'damage',
      type: 'circle',
      source: 'infrastructure',
      filter: ['all', ['has', 'damage_status'], ['!=', ['get', 'damage_status'], null]],
      paint: {
        'circle-radius': [
          'case',
          ['==', ['get', 'damage_status'], 'severe'],
          12,
          10
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'damage_status'], 'severe'],
          '#ff0000',
          ['==', ['get', 'damage_status'], 'confirmed'],
          '#ff6b6b',
          ['==', ['get', 'damage_status'], 'suspected'],
          '#ffa500',
          '#ffff00'
        ],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.9
      }
    })
  }

  createLabelsLayer() {
    this.map.addLayer({
      id: 'labels',
      type: 'symbol',
      source: 'infrastructure',
      filter: this.getLabelsFilter(),
      layout: {
        visibility: 'none',
        'text-field': ['coalesce', ['get', 'short_name'], ['get', 'name']],
        'text-size': 10,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 1],
        'text-anchor': 'top',
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 0.6,
        'text-justify': 'auto',
        'text-max-width': 16,
        'text-optional': true,
        'text-allow-overlap': false,
        'text-ignore-placement': false
      },
      paint: {
        'text-color': '#f8f8f8',
        'text-halo-color': 'rgba(18, 18, 18, 0.95)',
        'text-halo-width': 1.2
      }
    })
  }

  getVisibleCategoryFilter(): mapboxgl.Expression {
    const visibleCategories = Object.entries(this.layerVisibility)
      .filter(([category, isVisible]) => category !== 'labels' && isVisible)
      .map(([category]) => category)

    return ['in', ['get', 'category'], ['literal', visibleCategories]]
  }

  getCountryFilter(): mapboxgl.Expression {
    if (this.selectedCountry === 'All') {
      return ['has', 'name']
    }

    // Backward compatibility: many original Iran records do not have a country field.
    if (this.selectedCountry === 'Iran') {
      return ['any', ['==', ['get', 'country'], 'Iran'], ['!', ['has', 'country']]]
    }

    return ['==', ['get', 'country'], this.selectedCountry]
  }

  getLabelsFilter(): mapboxgl.Expression {
    return ['all', this.getVisibleCategoryFilter(), this.getCountryFilter()]
  }

  syncLabelsWithVisibleCategories() {
    if (!this.map.getLayer('labels')) {
      return
    }

    this.map.setFilter('labels', this.getLabelsFilter())
  }

  applyDataFilters() {
    if (this.selectedCountry === 'All') {
      this.map.setFilter('upstream', ['==', ['get', 'category'], 'upstream'])
      this.map.setFilter('pipelines', ['==', ['get', 'category'], 'pipelines'])
      this.map.setFilter('storage', ['==', ['get', 'category'], 'storage'])
      this.map.setFilter('refineries', ['==', ['get', 'category'], 'refineries'])
      this.map.setFilter('terminals', ['==', ['get', 'category'], 'terminals'])
      this.map.setFilter('damage', ['all', ['has', 'damage_status'], ['!=', ['get', 'damage_status'], null]])
    } else {
      const countryFilter = this.getCountryFilter()
      this.map.setFilter('upstream', ['all', ['==', ['get', 'category'], 'upstream'], countryFilter])
      this.map.setFilter('pipelines', ['all', ['==', ['get', 'category'], 'pipelines'], countryFilter])
      this.map.setFilter('storage', ['all', ['==', ['get', 'category'], 'storage'], countryFilter])
      this.map.setFilter('refineries', ['all', ['==', ['get', 'category'], 'refineries'], countryFilter])
      this.map.setFilter('terminals', ['all', ['==', ['get', 'category'], 'terminals'], countryFilter])
      this.map.setFilter('damage', [
        'all',
        ['has', 'damage_status'],
        ['!=', ['get', 'damage_status'], null],
        countryFilter
      ])
    }

    this.applySaudiPipelineVisibility()

    this.syncLabelsWithVisibleCategories()
  }

  applySaudiPipelineVisibility() {
    const isLayerEnabled = this.layerVisibility['saudi-ew-pipeline']
    const inCountryScope = this.selectedCountry === 'All' || this.selectedCountry === 'Saudi Arabia'
    const visibility: 'visible' | 'none' = isLayerEnabled && inCountryScope ? 'visible' : 'none'

    SAUDI_EW_LAYER_IDS.forEach((layerId) => {
      if (this.map.getLayer(layerId)) {
        this.map.setLayoutProperty(layerId, 'visibility', visibility)
      }
    })
  }

  focusCountry(country: string) {
    if (country === 'All') {
      this.fitMapToFeatures(allFeatures)
      this.showStatus('Showing all countries.')
      return
    }

    const countryFeatures = allFeatures.filter((feature) => feature.properties.country === country)
    if (!countryFeatures.length) {
      this.showStatus(`No records found for ${country}.`)
      return
    }

    this.fitMapToFeatures(countryFeatures)
    this.showStatus(`Showing ${country}: ${countryFeatures.length} records.`)
  }

  setupCountryControls() {
    const container = document.getElementById('layer-controls')
    if (!container) {
      return
    }

    const countryGroup = document.createElement('div')
    countryGroup.className = 'layer-group'
    countryGroup.innerHTML = '<h4>Country Filter</h4>'

    const buttonWrap = document.createElement('div')
    buttonWrap.className = 'country-filter-buttons'

    const countries = [
      'All',
      ...Array.from(
        new Set(
          allFeatures
            .map((feature) => feature.properties.country)
            .filter((country): country is string => typeof country === 'string' && country.length > 0)
        )
      ).sort((a, b) => a.localeCompare(b))
    ]

    countries.forEach((country) => {
      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'country-filter-btn'
      if (country === 'All') {
        button.classList.add('active')
      }
      button.textContent = country
      button.addEventListener('click', () => {
        const nextCountry = this.selectedCountry === country ? 'All' : country
        this.selectedCountry = nextCountry
        this.applyDataFilters()
        this.focusCountry(nextCountry)

        buttonWrap
          .querySelectorAll('.country-filter-btn')
          .forEach((btn) => btn.classList.remove('active'))

        const activeButton = Array.from(buttonWrap.querySelectorAll('.country-filter-btn')).find(
          (btn) => btn.textContent === nextCountry
        )
        activeButton?.classList.add('active')
      })
      buttonWrap.appendChild(button)
    })

    countryGroup.appendChild(buttonWrap)
    container.appendChild(countryGroup)
  }

  setupLayerControls() {
    const checkboxes = document.querySelectorAll(
      '.layer-controls input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>

    this.decorateControlCounts(checkboxes)

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement
        const layerId = target.getAttribute('data-layer')

        if (layerId) {
          this.layerVisibility[layerId] = target.checked

          if (layerId === 'saudi-ew-pipeline') {
            this.applySaudiPipelineVisibility()
          } else {
            const visibility = target.checked ? 'visible' : 'none'
            this.map.setLayoutProperty(layerId, 'visibility', visibility)
          }

          this.syncLabelsWithVisibleCategories()

          if (target.checked && layerId !== 'labels') {
            this.focusLayer(layerId)
          }
        }
      })
    })
  }

  decorateControlCounts(checkboxes: NodeListOf<HTMLInputElement>) {
    checkboxes.forEach((checkbox) => {
      const layerId = checkbox.getAttribute('data-layer')
      if (!layerId) {
        return
      }

      const label = checkbox.parentElement
      if (!label) {
        return
      }

      const count = this.getLayerFeatureCount(layerId)
      if (count === null) {
        return
      }

      const countSpan = document.createElement('span')
      countSpan.className = 'layer-count'
      countSpan.textContent = ` (${count})`
      label.appendChild(countSpan)
    })
  }

  getLayerFeatureCount(layerId: string): number | null {
    if (layerId === 'saudi-ew-pipeline') {
      return saudiEastWestPipelineFeatures.length
    }

    if (featuresByCategory[layerId]) {
      return featuresByCategory[layerId].length
    }

    return null
  }

  focusLayer(layerId: string) {
    if (layerId === 'saudi-ew-pipeline') {
      this.fitToMixedGeometryFeatures(saudiEastWestPipelineFeatures)
      return
    }

    const layerFeatures = featuresByCategory[layerId]
    if (!layerFeatures || layerFeatures.length === 0) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds(
      layerFeatures[0].geometry.coordinates,
      layerFeatures[0].geometry.coordinates
    )

    for (let i = 1; i < layerFeatures.length; i += 1) {
      bounds.extend(layerFeatures[i].geometry.coordinates)
    }

    this.map.fitBounds(bounds, {
      padding: 70,
      maxZoom: 6.5,
      duration: 650
    })
  }

  fitToMixedGeometryFeatures(features: SaudiPipelineFeature[]) {
    if (!features.length) {
      return
    }

    let seedCoordinate: [number, number] | null = null
    for (const feature of features) {
      if (feature.geometry.type === 'Point') {
        seedCoordinate = feature.geometry.coordinates
        break
      }
      if (feature.geometry.type === 'LineString' && feature.geometry.coordinates.length > 0) {
        seedCoordinate = feature.geometry.coordinates[0]
        break
      }
    }

    if (!seedCoordinate) {
      return
    }

    const bounds = new mapboxgl.LngLatBounds(seedCoordinate, seedCoordinate)
    for (const feature of features) {
      if (feature.geometry.type === 'Point') {
        bounds.extend(feature.geometry.coordinates)
      } else {
        feature.geometry.coordinates.forEach((coordinate) => bounds.extend(coordinate))
      }
    }

    this.map.fitBounds(bounds, {
      padding: 70,
      maxZoom: 6.5,
      duration: 650
    })
  }

  setupLayerInteractions() {
    // Define interactive layers
    const interactiveLayers = [
      'upstream',
      'pipelines',
      'saudi-ew-pipeline-route',
      'saudi-ew-pipeline-nodes',
      'storage',
      'refineries',
      'terminals',
      'damage',
      'labels'
    ]

    interactiveLayers.forEach((layer) => {
      // Show cursor on hover
      this.map.on('mouseenter', layer, () => {
        this.map.getCanvas().style.cursor = 'pointer'
      })

      this.map.on('mouseleave', layer, () => {
        this.map.getCanvas().style.cursor = ''
      })

      // Show popup on click
      this.map.on('click', layer, (e: mapboxgl.MapLayerMouseEvent) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0]
          const props = feature.properties as Record<string, any>

          let popupHtml = `<div class="popup-content"><h4>${props.name}</h4>`
          popupHtml += `<p><strong>Type:</strong> ${props.type}</p>`

          if (props.capacity) {
            popupHtml += `<p><strong>Capacity:</strong> ${props.capacity}</p>`
          }

          if (props.line) {
            popupHtml += `<p><strong>Line:</strong> ${props.line}</p>`
          }

          if (props.status) {
            popupHtml += `<p><strong>Status:</strong> ${String(props.status).toUpperCase()}</p>`
          }

          if (props.damage_status) {
            popupHtml += `<p><strong>Damage Status:</strong> ${props.damage_status.toUpperCase()}</p>`
          }

          if (props.country) {
            popupHtml += `<p><strong>Country:</strong> ${props.country}</p>`
          }

          if (props.event_date) {
            popupHtml += `<p><strong>Event Date:</strong> ${props.event_date}</p>`
          }

          if (props.confidence) {
            popupHtml += `<p><strong>Confidence:</strong> ${String(props.confidence).toUpperCase()}</p>`
          }

          if (props.notes) {
            popupHtml += `<p><strong>Notes:</strong> ${props.notes}</p>`
          } else if (props.comment) {
            popupHtml += `<p><strong>Notes:</strong> ${props.comment}</p>`
          }

          popupHtml += '</div>'

          new mapboxgl.Popup()
            .setLngLat((e.lngLat as unknown) as mapboxgl.LngLatLike)
            .setHTML(popupHtml)
            .addTo(this.map)
        }
      })
    })
  }
}

function parseProjectView(): ProjectView | null {
  const params = new URLSearchParams(window.location.search)
  const project = params.get('project')
  if (!project) {
    return null
  }

  return (PROJECT_VIEWS as readonly string[]).includes(project) ? (project as ProjectView) : null
}

function setApplicationMode(mode: 'home' | 'map') {
  const homePage = document.getElementById('home-page')
  const mapApp = document.getElementById('map-app')
  if (!homePage || !mapApp) {
    return
  }

  if (mode === 'home') {
    homePage.classList.remove('home-hidden')
    mapApp.classList.add('map-app-hidden')
    document.documentElement.classList.remove('map-mode')
    document.body.classList.remove('map-mode')
    document.body.classList.add('home-mode')
    document.title = 'Geospatial Mapping Projects'
    return
  }

  homePage.classList.add('home-hidden')
  mapApp.classList.remove('map-app-hidden')
  document.documentElement.classList.add('map-mode')
  document.body.classList.add('map-mode')
  document.body.classList.remove('home-mode')
  document.title = 'Infrastructure Map Project'
}

function setupBackHomeButton() {
  const backButton = document.getElementById('back-home') as HTMLButtonElement | null
  if (!backButton) {
    return
  }

  backButton.addEventListener('click', () => {
    window.location.assign(window.location.pathname)
  })
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupBackHomeButton()

  const projectView = parseProjectView()
  if (!projectView) {
    setApplicationMode('home')
    return
  }

  setApplicationMode('map')

  if (!hasValidMapboxToken) {
    const mapElement = document.getElementById('map')
    if (mapElement) {
      mapElement.innerHTML =
        '<div style="height:100%;display:flex;align-items:center;justify-content:center;padding:24px;color:#f5f5f5;background:#1e1e1e;font-family:Segoe UI,Arial,sans-serif;text-align:center;">Mapbox token is missing.<br/>Create .env.local with VITE_MAPBOX_TOKEN=your_token and restart npm run dev.</div>'
    }
    return
  }

  new InfrastructureMap(projectView)
})
