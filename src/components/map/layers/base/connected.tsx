import { createSelector } from '@reduxjs/toolkit';
import { type ChangeEvent } from 'react';
import { connect } from 'react-redux';

import { isMapCachingEnabled } from '~/features/map-caching/selectors';
import { selectMapSource } from '~/features/map/layers';
  // Removed unused server-side selectors

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
 * Client-side tile loader function that loads tiles using the browser's Cache API.
 * Uses a Stale-While-Revalidate strategy to serve from offline cache instantly, 
 * while keeping it updated in the background when online.
 */
const loadTileWithCache: LoadImageTileFunction = async (imageTile, url) => {
  const img = imageTile.getImage();
  if (!(img instanceof HTMLImageElement || img instanceof HTMLVideoElement)) {
    return;
  }
  
  img.crossOrigin = 'anonymous';

  // Revoke object URL to prevent memory leaks once image is processed
  const cleanup = () => {
    if (img.src.startsWith('blob:')) {
      URL.revokeObjectURL(img.src);
    }
    img.onload = null;
    img.onerror = null;
  };
  
  img.onload = cleanup;
  img.onerror = cleanup;

  try {
    const cache = await caches.open('matrix-live-map-tiles');
    const cachedResponse = await cache.match(url);
    
    if (cachedResponse) {
      const blob = await cachedResponse.blob();
      img.src = URL.createObjectURL(blob);
      
      // Revalidate and update cache in the background
      fetch(url).then(async (res) => {
        if (res.ok) {
          await cache.put(url, res.clone());
        }
      }).catch(() => {}); // Ignore offline errors
    } else {
      const res = await fetch(url);
      if (res.ok) {
        await cache.put(url, res.clone());
        const blob = await res.blob();
        img.src = URL.createObjectURL(blob);
      } else {
        img.src = url; // Fallback
      }
    }
  } catch (err) {
    // Fallback if Cache API fails
    img.src = url;
  }
};

/**
 * Selector that returns a function that takes an image tile and a URL and loads
 * the tile at the given URL to the given image tile, optionally piping it
 * through the client-side offline map cache.
 */
const getMapTileLoaderFunction = createSelector(
  isMapCachingEnabled,
  (cachingEnabled) => (cachingEnabled ? loadTileWithCache : loadTile)
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
