import type { RootState } from '~/store/reducers';

/**
 * Returns whether the light control panel is currently activated.
 */
export function isLightControlActive(state: RootState): boolean {
  return state.lightControl.active;
}

/**
 * Returns the currently selected color in the light control panel, in hex
 * notation.
 */
export function getCurrentColorInLightControlPanel(state: RootState): string {
  return state.lightControl.color;
}

/**
 * Returns whether the light control panel UI window is open.
 */
export function isLightControlPanelOpen(state: RootState): boolean {
  return state.lightControl.panelOpen;
}
