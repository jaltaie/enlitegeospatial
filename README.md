# Iran Infrastructure Damage Map

A Mapbox GL JS-based interactive map for visualizing oil & gas infrastructure damage assessment from the Iran conflict. This application allows layered visualization of upstream, midstream, and downstream infrastructure with damage assessment tracking.

## Project Structure

```
.
├── src/
│   ├── main.ts           # Main application and map setup
│   └── style.css         # Styling for map and controls
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
└── README.md             # This file
```

## Infrastructure Layers

The map is organized into the following infrastructure categories:

### **Upstream**
- Oil & gas production fields
- Drilling platforms
- Well facilities
- Color: **Blue** (#4a90e2)

### **Midstream**
#### Pipelines
- Oil & gas transmission pipelines
- Color: **Orange** (#f5a623)

#### Storage Facilities
- Crude oil storage
- Natural gas storage
- Strategic reserves
- Color: **Yellow** (#f8e71c)

### **Downstream**
#### Refineries
- Oil refineries
- Processing facilities
- Color: **Red** (#e74c3c)

#### Export Terminals
- Tanker loading terminals
- Port facilities
- Shipping hubs
- Color: **Purple** (#9b59b6)

### **Damage Assessment**
- Confirmed damage sites
- Suspected damage locations
- Color coding by severity:
  - **Red** (#ff0000) - Severe damage
  - **Light Red** (#ff6b6b) - Confirmed damage
  - **Orange** (#ffa500) - Suspected damage
  - **Yellow** (#ffff00) - Minimal damage

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Mapbox API token (get one free at https://account.mapbox.com/)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set your Mapbox token in `src/main.ts`:
```typescript
mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE'
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Features

- **Interactive Layer Toggle**: Enable/disable infrastructure categories in real-time
- **Hover Effects**: Visual feedback on hover with cursor change
- **Click Popups**: View detailed information about each infrastructure point
- **Dark Theme**: Professional dark UI suitable for damage assessment analysis
- **Responsive Controls**: Layer controls positioned for easy access
- **Color-Coded Categories**: Quick visual identification of infrastructure types

## Data Structure

The application uses GeoJSON format for infrastructure data. Each feature includes:

```typescript
{
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [lng, lat]
  },
  properties: {
    name: string,
    type: string,
    category: 'upstream' | 'pipelines' | 'storage' | 'refineries' | 'terminals' | 'damage',
    damage_status?: 'confirmed' | 'suspected' | 'minimal' | 'severe',
    capacity?: string,
    // Additional custom properties
  }
}
```

## Adding Your Own Data

To add infrastructure data:

1. Create a GeoJSON FeatureCollection with your data points
2. Import it in `src/main.ts`
3. Replace the `sampleData` variable with your data source
4. Optionally, connect to an API endpoint for dynamic data loading

## Customization

### Colors and Styling
Edit the color values in `src/main.ts` within the `createLayer` methods:

```typescript
paint: {
  'circle-color': '#your-color-hex'
}
```

### Map Style
Change the Mapbox style in the map initialization:

```typescript
style: 'mapbox://styles/mapbox/light-v11' // or another style
```

Available styles:
- `mapbox://styles/mapbox/streets-v12`
- `mapbox://styles/mapbox/outdoors-v12`
- `mapbox://styles/mapbox/light-v11`
- `mapbox://styles/mapbox/dark-v11`
- `mapbox://styles/mapbox/satellite-v9`

### Center and Zoom
Adjust initial view in `src/main.ts`:

```typescript
center: [52.5, 32.0],  // [lng, lat]
zoom: 5                 // 0-24
```

## Library Choice: Why Mapbox GL JS?

- **Superior Layer Management**: Easily handle multiple categories with toggle controls
- **Performance**: Optimized for large feature sets
- **Styling Power**: Data-driven styling with expressions
- **3D Capabilities**: Future-proof for elevation and perspective views
- **Community**: Excellent documentation and examples
- **Free Tier**: Generous free tier perfect for this project

## Alternatives Considered

- **Leaflet.js**: Simpler but less powerful styling
- **ArcGIS**: More professional GIS tool but steeper learning curve
- **Deck.gl**: Better for massive datasets with 3D

## Resources

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [GeoJSON Specification](https://geojson.org/)
- [Vite Documentation](https://vitejs.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT

## Support

For issues or questions about Mapbox GL JS functionality, visit the [Mapbox documentation](https://docs.mapbox.com/).
