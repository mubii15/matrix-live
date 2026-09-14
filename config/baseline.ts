/**
 * @file Baseline values for the configuration options of the application.
 */

import { type Config } from 'config';

import { LayerType } from '~/model/layers';
import { type Latitude, type Longitude } from '~/utils/geography';

const matrixLiveIcon =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8ZGVmcz4KICAgIDxmaWx0ZXIgaWQ9Im1hdHJpeC1nbG93IiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIj4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMi41IiByZXN1bHQ9ImJsdXIiIC8+CiAgICAgIDxmZUNvbXBvc2l0ZSBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJibHVyIiBvcGVyYXRvcj0ib3ZlciIgLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcng9IjQ0IiBmaWxsPSIjMTExMTEzIi8+CiAgPGcgZmlsdGVyPSJ1cmwoI21hdHJpeC1nbG93KSI+CiAgICA8Y2lyY2xlIGN4PSI4MS40NiIgY3k9IjE2LjM1IiByPSIxLjM1IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI5Ny43MyIgY3k9IjIxLjQ1IiByPSIxLjQ0IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMTQuMDMiIGN5PSIyNi42MSIgcj0iMS40NCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNjguOCIgY3k9IjI3LjkzIiByPSIxLjQ0IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMzAuMzkiIGN5PSIzMS43NSIgcj0iMS40NiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iODUuMTciIGN5PSIzMy4wMiIgcj0iMS40NiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTQ2LjcxIiBjeT0iMzcuMDEiIHI9IjEuNDgiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEwMS40NCIgY3k9IjM4LjEyIiByPSIxLjQyIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI1Ni4yIiBjeT0iMzkuNDkiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjE2My4wOCIgY3k9IjQyLjI4IiByPSIxLjQyIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI3Mi41IiBjeT0iNDQuNjQiIHI9IjMuMDIiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjExNy43NiIgY3k9IjQzLjMxIiByPSIxLjQ2IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI4OC43OSIgY3k9IjQ5LjgiIHI9IjIuOTgiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEzNC4xMSIgY3k9IjQ4LjU3IiByPSIxLjM4IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI0My41MiIgY3k9IjUxLjAxIiByPSIxLjUiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEwNS4xOCIgY3k9IjU0Ljk5IiByPSIzLjAzIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTAuNTQiIGN5PSI1My43OCIgcj0iMS40NCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNTkuODMiIGN5PSI1Ni4xNiIgcj0iMyIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNzYuMTgiIGN5PSI2MS4zNSIgcj0iNS4xIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMjEuNTEiIGN5PSI2MC4xMiIgcj0iMy4wMyIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTY2LjgyIiBjeT0iNTguOTIiIHI9IjEuNDIiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjMwLjk0IiBjeT0iNjIuNTQiIHI9IjEuNCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iOTIuNTciIGN5PSI2Ni41MyIgcj0iNS4wOCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTM3Ljg4IiBjeT0iNjUuMzciIHI9IjMuMDQiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjQ3LjE4IiBjeT0iNjcuNzIiIHI9IjIuOTkiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEwOC45MSIgY3k9IjcxLjcxIiByPSI1LjA2IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI2My41NiIgY3k9IjcyLjkzIiByPSI1LjA4IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTQuMjciIGN5PSI3MC40OCIgcj0iMS40NiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTI1LjIyIiBjeT0iNzYuOTIiIHI9IjUuMSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTguMzIiIGN5PSI3NC4xMiIgcj0iMS40MiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNzkuOTYiIGN5PSI3OC4xMSIgcj0iNS4wMiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTcwLjUyIiBjeT0iNzUuNjMiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjM0LjYyIiBjeT0iNzkuMzEiIHI9IjEuNDgiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9Ijk2LjI2IiBjeT0iODMuMzUiIHI9IjUuMDkiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjE0MS42MiIgY3k9IjgyLjExIiByPSIzLjAyIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI1MC45MiIgY3k9Ijg0LjUyIiByPSIzLjAzIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMTIuNjEiIGN5PSI4OC40OCIgcj0iNS4wOSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTU3LjkyIiBjeT0iODcuMiIgcj0iMS40IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI2Ny4zNiIgY3k9Ijg5LjcxIiByPSIyLjk5IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMjguOTYiIGN5PSI5My42NiIgcj0iNS4xMSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMjEuOTkiIGN5PSI5MC43OSIgcj0iMS40NiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTc0LjMxIiBjeT0iOTIuNDEiIHI9IjEuNDQiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjgzLjY1IiBjeT0iOTQuODgiIHI9IjMuMDIiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjM4LjM3IiBjeT0iOTUuOTUiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjE0NS4yNSIgY3k9Ijk4Ljc0IiByPSIzLjAxIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMDAuMDMiIGN5PSIxMDAuMDEiIHI9IjMuMDEiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjU0LjcyIiBjeT0iMTAxLjI2IiByPSIxLjM1IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMTYuMyIgY3k9IjEwNS4yMSIgcj0iNS4xIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxNjEuNjYiIGN5PSIxMDMuOTIiIHI9IjEuNDIiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjcxLjAzIiBjeT0iMTA2LjQxIiByPSIxLjQ4IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMzIuNjgiIGN5PSIxMTAuMzMiIHI9IjUuMDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjI1LjY3IiBjeT0iMTA3LjU3IiByPSIxLjQ4IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxNzguMDQiIGN5PSIxMDkuMTEiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9Ijg3LjMzIiBjeT0iMTExLjU2IiByPSIxLjQ0IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI0Mi4xIiBjeT0iMTEyLjc1IiByPSIxLjQyIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxNDguOTkiIGN5PSIxMTUuNTQiIHI9IjIuOTkiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEwMy42NSIgY3k9IjExNi44MyIgcj0iMi45OCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNTguNDMiIGN5PSIxMTcuOTIiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEyMC4wNyIgY3k9IjEyMS44OSIgcj0iNS4wOSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTY1LjMiIGN5PSIxMjAuNTciIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9Ijc0Ljc0IiBjeT0iMTIzLjEyIiByPSIxLjQ2IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMzYuMzQiIGN5PSIxMjcuMTIiIHI9IjUuMDkiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjI5LjQ4IiBjeT0iMTI0LjM2IiByPSIxLjQ4IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxODEuNjgiIGN5PSIxMjUuNzYiIHI9IjEuNDIiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjkxLjEyIiBjeT0iMTI4LjMyIiByPSIxLjQ2IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI0NS43NSIgY3k9IjEyOS41MiIgcj0iMS40OCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTUyLjY5IiBjeT0iMTMyLjI1IiByPSIzLjAxIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMDcuNCIgY3k9IjEzMy40NSIgcj0iMi45OCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNjIuMTUiIGN5PSIxMzQuNTgiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEyMy43MSIgY3k9IjEzOC42OSIgcj0iNS4wNiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTY5LjAzIiBjeT0iMTM3LjM3IiByPSIxLjQyIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI3OC40OSIgY3k9IjEzOS44OSIgcj0iMS4zNSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMzMuMjIiIGN5PSIxNDEiIHI9IjEuNSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTQwLjA0IiBjeT0iMTQzLjgiIHI9IjMuMDEiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9Ijk0Ljc2IiBjeT0iMTQ0Ljk4IiByPSIxLjQ0IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI0OS41NCIgY3k9IjE0Ni4xOCIgcj0iMS40MiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTExLjE1IiBjeT0iMTUwLjIxIiByPSIzIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxNTYuMzgiIGN5PSIxNDguOTEiIHI9IjEuNDgiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjY1Ljg2IiBjeT0iMTUxLjQ2IiByPSIxLjQ2IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIxMjcuNDEiIGN5PSIxNTUuMzIiIHI9IjIuOTkiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjgyLjE2IiBjeT0iMTU2LjUzIiByPSIxLjQ2IiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSIzNi44OSIgY3k9IjE1Ny43MiIgcj0iMS4zNSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTQzLjc0IiBjeT0iMTYwLjQ1IiByPSIxLjUxIiBmaWxsPSIjZDVmNTQyIi8+CiAgICA8Y2lyY2xlIGN4PSI5OC41MiIgY3k9IjE2MS43NSIgcj0iMS40NiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNTMuMjciIGN5PSIxNjIuOTYiIHI9IjEuNDYiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjExNC43OSIgY3k9IjE2Ni44NSIgcj0iMS40NiIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iNjkuNTciIGN5PSIxNjguMDUiIHI9IjEuNDQiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjEzMS4xMyIgY3k9IjE3Mi4wMSIgcj0iMS40NCIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iODUuODYiIGN5PSIxNzMuMjciIHI9IjEuNSIgZmlsbD0iI2Q1ZjU0MiIvPgogICAgPGNpcmNsZSBjeD0iMTAyLjE5IiBjeT0iMTc4LjQiIHI9IjEuNDQiIGZpbGw9IiNkNWY1NDIiLz4KICAgIDxjaXJjbGUgY3g9IjExOC41MSIgY3k9IjE4My41OCIgcj0iMS40MiIgZmlsbD0iI2Q1ZjU0MiIvPgogIDwvZz4KPC9zdmc+Cg==';

const baseline: Config = {
  branding: {
    splashIcon: {
      srcSet: {
        default: matrixLiveIcon,
        twoX: matrixLiveIcon,
      },
      width: 96,
      height: 96,
    },
    splashTitle: 'matrix live',
  },

  ephemeral: false,

  examples: {
    shows: [],
  },

  features: {
    loadShowFromCloud: false,
    missionEditor: false,
    safetySettings: false,
  },

  headerComponents: [
    ['uav-status-summary'],
    ['groups-button'],
    [
      'battery-status-header-button',
      'distance-summary-header-button',
      'altitude-summary-header-button',
      'velocity-summary-header-button',
    ],
    ['rtk-status-header-button', 'weather-header-button'],
    ['connection-status-button'],
    [
      'server-connection-settings-button',
      'safety-button',
      'authentication-button',
    ],
    [
      'broadcast-button',
      'toolbox-button',
      'alert-button',
      'session-expiry-box',
      'map-theme-toggle-button',
      'satellite-view-button',
      'toggle-3d-view-button',
    ],
  ],

  language: {
    default: 'en',
    enabled: new Set(['de', 'en', 'fr', 'hu', 'it', 'ja', 'pl', 'zh-Hans']),
    fallback: 'en',
  },

  map: {
    drawingTools: [
      ['select', 'zoom'],
      [
        'add-marker',
        'draw-path',
        'draw-circle',
        'draw-rectangle',
        'draw-polygon',
        'cut-hole',
        'edit-feature',
      ],
    ],

    features: {
      onCreate() {
        /* do nothing */
      },
    },

    layers: [
      {
        id: 'base',
        type: LayerType.BASE,
        label: 'Base map',
        parameters: { source: 'esri.world_imagery' },
      },
      { id: 'graticule', type: LayerType.GRATICULE, label: 'Graticule' },
      { id: 'beacons', type: LayerType.BEACONS, label: 'Beacons' },
      { id: 'features', type: LayerType.FEATURES, label: 'Features' },
      { id: 'home', type: LayerType.MISSION_INFO, label: 'Mission info' },
      { id: 'uavs', type: LayerType.UAVS, label: 'UAVs' },
    ],

    locations: [
      {
        id: 'budapest',
        name: 'Budapest',
        center: { lon: 19, lat: 47.5 },
        rotation: 0,
        zoom: 11,
        notes: 'The capital of Hungary',
      },
      {
        id: 'elte',
        name: 'ELTE Garden',
        center: { lon: 19.0622 as Longitude, lat: 47.4733 as Latitude },
        rotation: 348,
        zoom: 17,
        notes: '',
      },
    ],

    origin: {
      position: [19.0622 as Longitude, 47.4733 as Latitude],
      angle: '0',
    },

    tileProviders: {
      bingMaps: false,
      googleMaps: false,
    },

    view: {
      position: [19 as Longitude, 47.5 as Latitude],
      angle: '0',
      zoom: 11,
    },
  },

  optimizeForSingleUAV: {
    default: false,
    force: false,
  },

  optimizeUIForTouch: {
    default: null,
    force: false,
  },

  perspectives: ['default'],

  ribbon: {
    label: null,
    position: 'bottomRight',
  },

  server: {
    connectAutomatically: true,
    preventAutodetection: false,
    preventManualSetup: false,
    hostName: 'localhost',
    port: null,
    isSecure: null,
    warnClockSkew: true,
  },

  session: {
    maxLengthInSeconds: null,
  },

  toastPlacement: 'top-center',

  urls: {
    help: 'https://doc.collmot.com/public/skybrush-live-doc/latest',
    exit: null,
  },
};

export default baseline;
