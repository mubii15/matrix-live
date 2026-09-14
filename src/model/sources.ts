/**
 * @file Constants and routines related to the source types that the user
 * can use on the map.
 */

import config from 'config';
import APIKeys from '~/APIKeys';

/**
 * Multi-level enum containing constants for the
 * source types that the user can use on the map.
 *
 * NOTE: Not sure whether this is the right representation for this structure,
 *       but it seems to work for now until we come up with something better.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Source {
  export enum BING {
    AERIAL_WITH_LABELS = 'bingMaps.aerialWithLabels',
    ROAD = 'bingMaps.road',
  }

  export enum CARTODB {
    DARK = 'cartodb.dark',
    LIGHT = 'cartodb.light',
  }

  export enum ESRI {
    WORLD_IMAGERY = 'esri.world_imagery',
  }

  export enum GOOGLE {
    DEFAULT = 'googleMaps.default',
    SATELLITE = 'googleMaps.satellite',
    ROADS = 'googleMaps.roads',
  }

  export enum MAPBOX {
    SATELLITE = 'mapbox.satellite',
    STATIC = 'mapbox.static',
    VECTOR = 'mapbox.vector',
  }

  export enum MAPTILER {
    BASIC = 'maptiler.basic',
    HYBRID = 'maptiler.hybrid',
    SATELLITE = 'maptiler.satellite',
    STREETS = 'maptiler.streets',
  }

  export const NEXTZEN = 'nextzen';
  export const OSM = 'osm';

  export enum STADIA {
    ALIDADE_SMOOTH_DARK = 'stadia.alidade_smooth_dark',
  }

  export enum STAMEN {
    TERRAIN = 'stamen.terrain',
    TONER = 'stamen.toner',
    WATERCOLOR = 'stamen.watercolor',
  }

  export type Source =
    | BING
    | CARTODB
    | ESRI
    | GOOGLE
    | MAPBOX
    | MAPTILER
    | typeof NEXTZEN
    | typeof OSM
    | STADIA
    | STAMEN;
}

/**
 * Constant containing all the sources in the order preferred on the UI.
 */
export const Sources: Source.Source[] = [
  Source.CARTODB.DARK,
  Source.STADIA.ALIDADE_SMOOTH_DARK,
  Source.CARTODB.LIGHT,
  Source.OSM,
  Source.STAMEN.TERRAIN,
  Source.ESRI.WORLD_IMAGERY,
];

// We add Mapbox, Maptiler, Bing Maps and Google Maps map sources only if we
// have at least a default API key for them. This might change in the future.
if (APIKeys.MAPBOX) {
  Sources.push(Source.MAPBOX.STATIC, Source.MAPBOX.SATELLITE);
  // MAPBOX.VECTOR does not look great with OpenLayers -- we would need the
  // Mapbox GL JS library :(
}

if (APIKeys.MAPTILER) {
  Sources.push(
    Source.MAPTILER.BASIC,
    Source.MAPTILER.SATELLITE,
    Source.MAPTILER.HYBRID
  );
}

// Nextzen tiles do not look nice because we
// don't have a styling function for them.

// Google and Bing Maps cannot be used in commercial apps without
// licensing, so these branches are currently disabled by default,
// unless explicitly enabled from the configuration.

if (config.map.tileProviders.bingMaps && APIKeys.BING) {
  Sources.push(Source.BING.AERIAL_WITH_LABELS, Source.BING.ROAD);
}

if (config.map.tileProviders.googleMaps && APIKeys.GOOGLE) {
  Sources.push(
    Source.GOOGLE.DEFAULT,
    Source.GOOGLE.SATELLITE,
    Source.GOOGLE.ROADS
  );
}

const attributions = {
  cartodb: [
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    '© <a href="https://carto.com/attributions">CARTO</a>',
  ],
  esri: [
    'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer">Esri</a> — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
  ],
  mapbox: [
    '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
    '© <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap contributors</a>',
  ],
  maptiler: [
    '© <a href="https://www.maptiler.com/copyright/">Maptiler</a>',
    '© <a href="https://www.openstreetmap.org/copyright">' +
      'OpenStreetMap contributors</a>',
  ],
  nextzen:
    "Map data &copy; OpenStreetMap contributors, Who's On First, " +
    'Natural Earth, and openstreetmapdata.com',
  stamen: [
    'Map tiles by <a href="https://stamen.com/" target="_blank">Stamen ' +
      'Design</a>, under <a href="https://creativecommons.org/licenses/by/3.0/" ' +
      'target="_blank">CC BY 3.0</a>.',
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ],
};

/**
 * Object mapping source constants to their visual properties (labels,
 * icons etc) on the user interface.
 *
 * @type {Object}
 */
const visualRepresentationsForSources: Record<
  Source.Source,
  { label: string; attributions?: string | string[] }
> = {
  [Source.BING.AERIAL_WITH_LABELS]: {
    label: 'Bing Maps (aerial with labels)',
  },
  [Source.BING.ROAD]: { label: 'Bing Maps (road)' },
  [Source.CARTODB.DARK]: {
    label: 'CartoDB Dark Matter',
    attributions: attributions.cartodb,
  },
  [Source.CARTODB.LIGHT]: {
    label: 'CartoDB Voyager',
    attributions: attributions.cartodb,
  },
  [Source.ESRI.WORLD_IMAGERY]: {
    label: 'Satellite (Esri World Imagery)',
    attributions: attributions.esri,
  },
  [Source.GOOGLE.DEFAULT]: { label: 'Google Maps' },
  [Source.GOOGLE.SATELLITE]: { label: 'Google Maps (satellite)' },
  [Source.GOOGLE.ROADS]: { label: 'Google Maps (roads)' },
  [Source.MAPBOX.STATIC]: {
    label: 'Mapbox',
    attributions: attributions.mapbox,
  },
  [Source.MAPBOX.SATELLITE]: {
    label: 'Mapbox satellite',
    attributions: attributions.mapbox,
  },
  [Source.MAPBOX.VECTOR]: {
    label: 'Mapbox vector',
    attributions: attributions.mapbox,
  },
  [Source.MAPTILER.BASIC]: {
    label: 'Maptiler',
    attributions: attributions.maptiler,
  },
  [Source.MAPTILER.HYBRID]: {
    label: 'Maptiler hybrid',
    attributions: attributions.maptiler,
  },
  [Source.MAPTILER.SATELLITE]: {
    label: 'Maptiler satellite',
    attributions: attributions.maptiler,
  },
  [Source.MAPTILER.STREETS]: {
    label: 'Maptiler streets',
    attributions: attributions.maptiler,
  },
  [Source.NEXTZEN]: { label: 'Nextzen', attributions: attributions.nextzen },
  [Source.OSM]: { label: 'OpenStreetMap' },
  [Source.STADIA.ALIDADE_SMOOTH_DARK]: {
    label: 'Alidade Smooth Dark',
    attributions: attributions.stamen,
  },
  [Source.STAMEN.TERRAIN]: {
    label: 'Stamen terrain',
    attributions: attributions.stamen,
  },
  [Source.STAMEN.TONER]: {
    label: 'Stamen toner',
    attributions: attributions.stamen,
  },
  [Source.STAMEN.WATERCOLOR]: {
    label: 'Stamen watercolor',
    attributions: attributions.stamen,
  },
};

/**
 * Returns a human-readable label describing the given map source on the
 * user interface.
 *
 * @param source - The map source; must be one of the constants
 *                 from the {@link Source} enum
 * @return {string} a human-readable description of the map source
 */
export function labelForSource(source: Source.Source): string {
  const visualRep = visualRepresentationsForSources[source];
  return visualRep ? visualRep.label : 'unknown';
}

/**
 * Returns an array of strings that should be used as attributions with the
 * map source.
 *
 * @param source - The map source; must be one of the constants
 *                 from the {@link Source} enum
 * @returns An array of attributions for the source
 */
export function attributionsForSource(source: Source.Source): string[] {
  const visualRep = visualRepresentationsForSources[source];
  const result = visualRep?.attributions;

  if (Array.isArray(result)) {
    return result;
  }

  if (result) {
    return [result];
  }

  return [];
}

/**
 * Checks whether the given source is a satellite imagery source.
 */
export function isSatelliteSource(source?: string | null): boolean {
  return (
    source === Source.ESRI.WORLD_IMAGERY ||
    source === Source.MAPBOX.SATELLITE ||
    source === Source.GOOGLE.SATELLITE ||
    source === Source.MAPTILER.SATELLITE ||
    source === Source.BING.AERIAL_WITH_LABELS
  );
}

/**
 * Returns the best available satellite source based on configured API keys,
 * falling back to Esri World Imagery (no API key required).
 */
export function getPreferredSatelliteSource(
  apiKeys?: Record<string, string | undefined>
): Source.Source {
  const keys = apiKeys ?? APIKeys;
  if (keys?.MAPBOX) {
    return Source.MAPBOX.SATELLITE;
  }
  if (keys?.GOOGLE) {
    return Source.GOOGLE.SATELLITE;
  }
  if (keys?.MAPTILER) {
    return Source.MAPTILER.SATELLITE;
  }
  if (keys?.BING) {
    return Source.BING.AERIAL_WITH_LABELS;
  }
  return Source.ESRI.WORLD_IMAGERY;
}

