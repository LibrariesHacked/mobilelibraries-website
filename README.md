# Mobile Libraries Website

A public single-page web application for exploring UK mobile library stops, timetables, routes, and real-time/estimated vehicle locations.

## Features

- **Unified Map & Stop Finder**: Side-by-side interactive MapLibre GL vector map and stop lookup tool.
- **GB Place & Postcode Search**: Powered by [`@geovation/gb-name-index`](https://github.com/Geovation/gb-name-index), UK postcode geocoding, and browser GPS geolocation.
- **Cascading Service Filters**: Filter stops and vehicles by local library authority, mobile library vehicle, and route.
- **Live Mobile Tracker**: Click any mobile library vehicle on the map, in the "On the road" bar, or inside a stop card to view its previous, current, and next stop progress and route schedules.
- **Expandable Stop Cards**: View address, frequency, stop time, access type, calendar (`.ics`), printable PDF flyer, and external timetable links inline.

## Style Guide & Theme

All colours, typography (`Nunito` and `Nunito Sans`), uniform `8px` corner rounding, borderless block buttons, external link indicators, and custom surface tokens are centralized in [`src/theme.js`](./src/theme.js) and documented in [`STYLE_GUIDE.md`](./STYLE_GUIDE.md).

## Development

### Prerequisites

- Node.js (v20+)

### Commands

```bash
# Install dependencies
npm install

# Start local Vite development server
npm start

# Build production bundle
npm run build

# Run JavaScript Standard Style linter
npx standard
```

## License

This project is licensed under the MIT License — see the [LICENSE.md](LICENSE.md) file for details.
