/**
 * @file Slice of the state object that stores the status of the light control
 * panel in the appplication.
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type LightControlSliceState = {
  active: boolean;
  color: string;
  panelOpen: boolean;
};

const initialState: LightControlSliceState = {
  active: false,
  color: '#ffffff',
  panelOpen: false,
};

// TODO: Remove unnecessary type checks and conversions!
const { actions, reducer } = createSlice({
  name: 'light-control',
  initialState,
  reducers: {
    // Internal action; do not use directly unless you know what you are
    // doing because chances are that you need a side effect that informs
    // the server about the change.
    setColor(state, action: PayloadAction<string>) {
      if (typeof action.payload === 'string') {
        state.color = action.payload;
      }
    },

    // Internal action; do not use directly unless you know what you are
    // doing because chances are that you need a side effect that informs
    // the server about the change.
    setLightControlActive(state, action: PayloadAction<boolean>) {
      state.active = Boolean(action.payload);
    },

    setLightControlPanelOpen(state, action: PayloadAction<boolean>) {
      state.panelOpen = Boolean(action.payload);
    },
  },
});

export const {
  // Internal actions; do not use directly unless you know what you are
  // doing because chances are that you need a side effect that informs
  // the server about the change.
  setColor,
  setLightControlActive,
  setLightControlPanelOpen,
} = actions;

export default reducer;
