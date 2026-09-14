import { createSelector } from '@reduxjs/toolkit';
import noop from 'lodash-es/noop';
import { type ChangeEvent } from 'react';
import { connect } from 'react-redux';

import { isMapCachingEnabled } from '~/features/map-caching/selectors';
import { selectMapSource } from '~/features/map/layers';
import {
  getServerHttpUrl,
  supportsMapCaching,
} from '~/features/servers/selectors';
import { getAPIKeys } from '~/features/settings/selectors';
import { type Source } from '~/model/sources';
import type { RootState } from '~/store/reducers';

import {
  type BaseLayerProps,
  type BaseLayerSettingsProps,
  type LoadImageTileFunction,
  BaseLayer as BaseLayerPresentation,
  BaseLayerSettings as BaseLayerSettingsPresentation,
  LayerSource as LayerSourcePresentation,
} from './presentation';

// === Settings for this particular layer type ===

export const BaseLayerSettings = connect(
  // mapStateToProps
  null,
  // mapDispatchToProps
  (
    dispatch,
    ownProps: Omit<BaseLayerSettingsProps, 'onLayerSourceChanged'>
  ) => ({
    onLayerSourceChanged(_event: ChangeEvent, value: Source.Source) {
      dispatch(selectMapSource({ layerId: ownProps.layerId, source: value }));
    },
  })
)(BaseLayerSettingsPresentation);

// === The actual layer to be rendered ===

/**
 * Default tile loader function that loads a tile from the given URL and assigns
 * it to the given image tile.
 */
const loadTile: LoadImageTileFunction = (imageTile, url) => {
  const img = imageTile.getImage();
  if (img instanceof HTMLImageElement || img instanceof HTMLVideoElement) {
    img.src = url;
  }
};

/**
 * Function that takes the URL of the server, and returns another function that
 * loads tiles into an OpenLayers layer in a way that passes through the
 * server caches.
 */
const getCachedTileLoader = (serverUrl: string): LoadImageTileFunction => {
  return (imageTile, url) => {
    const cachedUrl = `${serverUrl}/map-cache/_?url=` + encodeURIComponent(url);
    loadTile(imageTile, cachedUrl);
  };
};

/**
 * Normalizes tile URLs with rotating subdomains (e.g. Carto, Stadia) to a single key
 * so cache lookups succeed offline regardless of subdomain rotation.
 */
const normalizeUrlForCache = (url: string): string =>
  url.replace(/https:\/\/[a-d]\.basemaps\.cartocdn\.com/, 'https://basemaps.cartocdn.com');

/**
 * Client-side tile loader function that loads tiles using the browser's Cache API.
 * Uses a Stale-While-Revalidate strategy to serve from offline cache instantly, 
 * while keeping it updated in the background when online.
 */
const loadTileWithCache: LoadImageTileFunction = (imageTile, url) => {
  const img = imageTile.getImage();
  if (!(img instanceof HTMLImageElement || img instanceof HTMLVideoElement)) {
    return;
  }

  img.crossOrigin = 'anonymous';

  const cacheKey = normalizeUrlForCache(url);

  void (async () => {
    try {
      const cache = await caches.open('matrix-live-map-tiles');
      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        const blob = await cachedResponse.blob();
        const objectUrl = URL.createObjectURL(blob);
        img.src = objectUrl;
        setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);

        // Revalidate and update cache in the background when online
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          fetch(url)
            .then(async (res) => {
              if (res.ok) {
                await cache.put(cacheKey, res.clone());
              }
            })
            .catch(noop);
        }
      } else {
        const res = await fetch(url);
        if (res.ok) {
          await cache.put(cacheKey, res.clone());
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          img.src = objectUrl;
          setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
        } else {
          img.src = url;
        }
      }
    } catch {
      // Fallback if offline and tile not in cache, or if fetch fails
      img.src = url;
    }
  })();
};

/**
 * Selector that returns a function that takes an image tile and a URL and loads
 * the tile at the given URL to the given image tile, piping it through either
 * the server's map cache or the local client-side offline cache.
 */
const getMapTileLoaderFunction = createSelector(
  isMapCachingEnabled,
  supportsMapCaching,
  getServerHttpUrl,
  (cachingEnabled, cachingSupported, serverHttpUrl) => {
    if (!cachingEnabled) {
      return loadTile;
    }
    if (cachingSupported && serverHttpUrl) {
      return getCachedTileLoader(serverHttpUrl);
    }
    return loadTileWithCache;
  }
);

const LayerSource = connect(
  // mapStateToProps
  (state: RootState) => ({
    apiKeys: getAPIKeys(state),
    tileLoadFunction: getMapTileLoaderFunction(state),
  }),
  // mapDispatchToProps
  {}
)(LayerSourcePresentation);

export const BaseLayer = ({
  layer,
  zIndex,
}: Omit<BaseLayerProps, 'LayerSource'>) => (
  <BaseLayerPresentation
    layer={layer}
    zIndex={zIndex}
    LayerSource={LayerSource}
  />
);
