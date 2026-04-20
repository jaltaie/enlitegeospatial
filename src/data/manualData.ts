export type ManualFeature = {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    name: string
    type: string
    category: 'upstream' | 'pipelines' | 'storage' | 'refineries' | 'terminals' | 'damage'
    damage_status?: 'confirmed' | 'suspected' | 'minimal' | 'severe'
    capacity?: string
    country?: string
    event_date?: string
    confidence?: string
    notes?: string
    comment?: string
    [key: string]: unknown
  }
}

// Add your own records here.
// Example:
// {
//   type: 'Feature',
//   geometry: { type: 'Point', coordinates: [51.389, 35.6892] },
//   properties: {
//     name: 'Custom Site',
//     type: 'Damage Site',
//     category: 'damage',
//     damage_status: 'confirmed',
//     country: 'Iran',
//     event_date: '2026-04-19',
//     confidence: 'high',
//     notes: 'Direct hit on power substation; Unit 3 offline pending transformer replacement.'
//   }
// }


export const manualData: ManualFeature[] = [


  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.389, 35.6892] },
    properties: {
      name: 'Yanbu Placeholder',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Iran',
      event_date: '2026-04-19',
      confidence: 'high',
      notes: '700 kbpd damage'
    }


  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [51.389, 35.6892] },
    properties: {
      name: 'Custom Site',
      type: 'Damage Site',
      category: 'damage',
      damage_status: 'confirmed',
      country: 'Iran',
      event_date: '2026-04-19',
      confidence: 'high',
      notes: 'Example note: add detailed damage description here.'
    }
  }



]
