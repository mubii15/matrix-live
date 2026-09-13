import { blue, red, yellow } from '@mui/material/colors';
import createColor from 'color';
import mapValues from 'lodash-es/mapValues';

import { Colors as ColorsBase } from '@skybrush/app-theme-mui';
export { colorForStatus } from '@skybrush/app-theme-mui';

import { Severity } from '~/model/enums';
import type { NestedRecordField } from '~/utils/types';

type Color = string;

export const Colors = {
  ...ColorsBase,

  main: blue['500'],

  geofence: red['700'],
  grossShowConvexHull: '#fc0',
  netShowConvexHull: '#fc0fc0',
  flightArea: '#0c4',
  plannedTrajectory: '#6cdbba',
  missionItem: '#6cdbba',
  auxiliaryMissionItem: '#a8f5df',
  currentMissionItem: '#d8f576',
  doneMissionItem: '#489f86',
  selectedMissionItem: '#d8f576',

  positionHold: yellow.A400,
} as const;

const convertColorsToRGBTuples = (
  c: NestedRecordField<Color>
): NestedRecordField<readonly number[]> =>
  typeof c === 'object'
    ? mapValues(c, convertColorsToRGBTuples)
    : Object.freeze(createColor(c).rgb().array());

export const RGBColors = convertColorsToRGBTuples(Colors);

export const severityColorMap = new Map<Severity, Color>([
  [Severity.CRITICAL, Colors.seriousWarning],
  [Severity.DEBUG, Colors.off],
  [Severity.ERROR, Colors.error],
  [Severity.INFO, Colors.info],
  [Severity.WARNING, Colors.warning],
]);

export const colorForSeverity = (severity: Severity): Color =>
  severityColorMap.has(severity)
    ? severityColorMap.get(severity)! // NOTE: Bang justified by `has`
    : Colors.missing;

export default Colors;
