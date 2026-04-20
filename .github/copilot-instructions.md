## Infrastructure Damage Map Project - Setup Notes

This is a Mapbox GL JS-based interactive map for visualizing Iran oil & gas infrastructure damage.

### Key Points
- **Mapbox Token Required**: Users must get a free token from https://account.mapbox.com/ and add it to src/main.ts
- **Layer Structure**: Infrastructure is organized into 6 categories (upstream, pipelines, storage, refineries, terminals, damage)
- **GeoJSON Based**: Data is structured as GeoJSON features for flexibility and standards compliance
- **Dark Theme**: Professional dark UI suitable for analysis

### Architecture
- **Frontend**: Vite + TypeScript + Mapbox GL JS
- **Styling**: Native CSS with dark theme
- **Data Format**: GeoJSON FeatureCollection
- **Layer Organization**: 6 distinct layers with color coding and damage assessment

### Infrastructure Categories
1. **Upstream** (Blue): Production fields and platforms
2. **Midstream Pipelines** (Orange): Transmission infrastructure
3. **Midstream Storage** (Yellow): Storage facilities
4. **Downstream Refineries** (Red): Processing plants
5. **Downstream Terminals** (Purple): Export facilities
6. **Damage Sites** (Red variants): Confirmed/suspected/minimal/severe damage

### Sample Data
The project includes sample infrastructure points for demonstration. Replace with actual conflict damage data in `src/main.ts`.

### Next Steps for User
1. Install Node.js if not already installed
2. Run `npm install` to install dependencies
3. Get Mapbox token and add to `src/main.ts`
4. Run `npm run dev` to start development server
5. Replace sample data with actual Iran infrastructure damage data
