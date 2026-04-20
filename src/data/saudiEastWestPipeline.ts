export type SaudiPipelineFeature = {
  type: 'Feature'
  geometry:
    | {
        type: 'LineString'
        coordinates: [number, number][]
      }
    | {
        type: 'Point'
        coordinates: [number, number]
      }
  properties: {
    name: string
    type: 'pipeline_route' | 'origin_hub' | 'pump_station' | 'terminal'
    line: 'East-West Pipeline'
    country: 'Saudi Arabia'
    status?: 'operational' | 'degraded' | 'under_maintenance'
    notes?: string
    [key: string]: unknown
  }
}

export const saudiEastWestPipelineData: SaudiPipelineFeature[] = [
  {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [49.6763, 25.9347],
        [48.6100, 25.4500],
        [47.1500, 24.9600],
        [45.5400, 24.6800],
        [43.8700, 24.4000],
        [41.9800, 24.2500],
        [40.4600, 24.1300],
        [39.3200, 24.0400],
        [38.0641, 24.0898]
      ]
    },
    properties: {
      name: 'East-West Crude Trunkline',
      type: 'pipeline_route',
      line: 'East-West Pipeline',
      country: 'Saudi Arabia',
      status: 'operational',
      notes: 'Demonstration alignment from Abqaiq area to Yanbu export corridor.'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [49.6763, 25.9347] },
    properties: {
      name: 'Abqaiq Origin Hub',
      type: 'origin_hub',
      line: 'East-West Pipeline',
      country: 'Saudi Arabia',
      status: 'operational'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [47.1500, 24.9600] },
    properties: {
      name: 'Pump Station 3',
      type: 'pump_station',
      line: 'East-West Pipeline',
      country: 'Saudi Arabia',
      status: 'operational'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [43.8700, 24.4000] },
    properties: {
      name: 'Pump Station 7',
      type: 'pump_station',
      line: 'East-West Pipeline',
      country: 'Saudi Arabia',
      status: 'operational'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [40.4600, 24.1300] },
    properties: {
      name: 'Pump Station 10',
      type: 'pump_station',
      line: 'East-West Pipeline',
      country: 'Saudi Arabia',
      status: 'under_maintenance'
    }
  },
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [38.0641, 24.0898] },
    properties: {
      name: 'Yanbu Terminal Link',
      type: 'terminal',
      line: 'East-West Pipeline',
      country: 'Saudi Arabia',
      status: 'operational'
    }
  }
]
