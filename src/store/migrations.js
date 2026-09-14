import { createNextState } from '@reduxjs/toolkit';
import { createMigrate } from 'redux-persist';

import { BatteryThresholdType } from '~/features/safety/model';
import {
  DEFAULT_BATTERY_CELL_COUNT,
  LIPO_CRITICAL_VOLTAGE_THRESHOLD,
  LIPO_FULL_CHARGE_VOLTAGE,
  LIPO_LOW_VOLTAGE_THRESHOLD,
} from '~/model/constants';

const migrations = {
  2: createNextState((state) => {
    state.settings.uavs = {
      ...state.settings.uavs,
      defaultBatteryCellCount: DEFAULT_BATTERY_CELL_COUNT,
      fullChargeVoltage: LIPO_FULL_CHARGE_VOLTAGE,
      lowVoltageThreshold: LIPO_LOW_VOLTAGE_THRESHOLD,
      criticalVoltageThreshold: LIPO_CRITICAL_VOLTAGE_THRESHOLD,
    };
  }),
  3: createNextState((state) => {
    if (typeof state.safety.settings.lowBatteryVoltage === 'number') {
      state.safety.settings.lowBatteryThreshold = {
        type: BatteryThresholdType.VOLTAGE,
        value: state.safety.settings.lowBatteryVoltage,
      };
    }
  }),
  4: createNextState((state) => {
    if (state.layers?.byId?.base?.parameters) {
      if (state.layers.byId.base.parameters.source === 'osm') {
        state.layers.byId.base.parameters.source = 'cartodb.dark';
      }
    }
  }),
  5: createNextState((state) => {
    if (state.map?.layers?.byId?.base?.parameters) {
      if (state.map.layers.byId.base.parameters.source === 'osm') {
        state.map.layers.byId.base.parameters.source = 'cartodb.dark';
      }
    }
  }),
  6: createNextState((state) => {
    if (state.map?.layers?.byId?.base?.parameters) {
      const src = state.map.layers.byId.base.parameters.source;
      if (src === 'osm' || src === 'cartodb.dark') {
        state.map.layers.byId.base.parameters.source = 'stadia.alidade_smooth_dark';
      }
    }
  }),
  7: createNextState((state) => {
    if (state.map?.layers?.byId?.base?.parameters) {
      const src = state.map.layers.byId.base.parameters.source;
      if (src === 'stadia.alidade_smooth_dark') {
        state.map.layers.byId.base.parameters.source = 'cartodb.dark';
      }
    }
  }),
  8: createNextState((state) => {
    if (state.map?.layers?.byId?.base?.parameters) {
      const src = state.map.layers.byId.base.parameters.source;
      if (src === 'cartodb.dark') {
        state.map.layers.byId.base.parameters.source = 'stadia.alidade_smooth_dark';
      }
    }
  }),
  9: createNextState((state) => {
    if (state.map?.layers?.byId?.base?.parameters) {
      state.map.layers.byId.base.parameters.source = 'esri.world_imagery';
    }
  }),
};

export default createMigrate(migrations);
