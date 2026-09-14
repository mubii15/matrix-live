import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';
import { connect } from 'react-redux';
import TimeAgo from 'react-timeago';

import { StatusText } from '@skybrush/mui-components';

import {
  abbreviateGPSFixType,
  type FlightMode,
  getFlightModeLabel,
  getSemanticsForFlightMode,
  getSemanticsForGPSFixType,
  getSemanticsForRSSI,
  isFlightMode,
} from '~/model/enums';
import { type RootState } from '~/store/reducers';
import {
  formatNumberSafely,
  formatRSSI,
  shortTimeAgoFormatter,
} from '~/utils/formatting';

import { getUAVById } from './selectors';

const naString = '—';
const naText = (
  <Typography
    component='span'
    sx={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '11px' }}
  >
    {naString}
  </Typography>
);

type StatusSummaryMiniTableProps = {
  gpsFix?: {
    type?: number;
    numSatellites?: number;
    horizontalAccuracy?: number;
    verticalAccuracy?: number;
  };
  heading?: number;
  lastUpdated?: number;
  localPosition?: [number, number, number] | number[];
  mode?: string;
  position?: {
    lat?: number;
    lon?: number;
    amsl?: number;
    ahl?: number;
    agl?: number;
  };
  rssi?: number[];
  uavId?: string;
};

type TelemetryRow = {
  id: string;
  label: string;
  value: React.ReactNode;
};

type ItemOrSeparator = TelemetryRow | { isSeparator: true; id: string };

const StatusSummaryMiniTable = ({
  gpsFix,
  heading,
  lastUpdated,
  localPosition,
  mode,
  position,
  rssi,
}: StatusSummaryMiniTableProps) => {
  const { lat, lon, amsl, ahl, agl } = position || {};
  const hasLocalPosition = localPosition && Array.isArray(localPosition);

  const flightModeStatus =
    mode && isFlightMode(mode) ? getSemanticsForFlightMode(mode) : undefined;

  const flightModeLabel =
    mode && isFlightMode(mode) ? (
      flightModeStatus ? (
        <StatusText status={flightModeStatus}>
          {getFlightModeLabel(mode)}
        </StatusText>
      ) : (
        <Typography
          component='span'
          sx={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.9)' }}
        >
          {getFlightModeLabel(mode)}
        </Typography>
      )
    ) : (
      naText
    );

  const gpsFixType = gpsFix?.type;
  const shouldShowGlobalPositionInfo = !hasLocalPosition || gpsFixType != null;

  const items: ItemOrSeparator[] = [
    { id: 'mode', label: 'Mode', value: flightModeLabel },
    { id: 'sep0', isSeparator: true },
  ];

  if (shouldShowGlobalPositionInfo) {
    const gpsFixLabel =
      gpsFixType != null ? (
        <>
          <StatusText status={getSemanticsForGPSFixType(gpsFixType)}>
            {abbreviateGPSFixType(gpsFixType)}
          </StatusText>
          {gpsFix?.numSatellites ? ` (${gpsFix?.numSatellites} sats)` : null}
        </>
      ) : (
        naText
      );

    let horizAccStr = naString;
    if (typeof gpsFix?.horizontalAccuracy === 'number') {
      horizAccStr =
        gpsFix.horizontalAccuracy > 50
          ? '50+'
          : formatNumberSafely(gpsFix.horizontalAccuracy, 2, '', naString);
    }

    let vertAccStr = naString;
    if (typeof gpsFix?.verticalAccuracy === 'number') {
      vertAccStr =
        gpsFix.verticalAccuracy > 50
          ? '50+'
          : formatNumberSafely(gpsFix.verticalAccuracy, 2, '', naString);
    }

    const gpsAcc = (
      <>
        {horizAccStr}
        {' / '}
        {vertAccStr}
        {' m'}
      </>
    );

    items.push(
      { id: 'gpsFix', label: 'GPS fix', value: gpsFixLabel },
      { id: 'gpsAcc', label: 'GPS acc', value: gpsAcc },
      { id: 'sep1', isSeparator: true },
      {
        id: 'lat',
        label: 'Lat',
        value:
          typeof lat === 'number'
            ? formatNumberSafely(lat, 7, '°', naString)
            : naString,
      },
      {
        id: 'lon',
        label: 'Lon',
        value:
          typeof lon === 'number'
            ? formatNumberSafely(lon, 7, '°', naString)
            : naString,
      },
      {
        id: 'amsl',
        label: 'AMSL',
        value:
          typeof amsl === 'number'
            ? formatNumberSafely(amsl, 2, ' m', naString)
            : naString,
      },
      {
        id: 'ahl',
        label: 'AHL',
        value:
          typeof ahl === 'number'
            ? formatNumberSafely(ahl, 2, ' m', naString)
            : naString,
      },
      {
        id: 'agl',
        label: 'AGL',
        value:
          typeof agl === 'number'
            ? formatNumberSafely(agl, 2, ' m', naString)
            : naString,
      },
      { id: 'sep2', isSeparator: true }
    );
  }

  if (hasLocalPosition) {
    items.push(
      {
        id: 'posX',
        label: 'X',
        value:
          typeof localPosition[0] === 'number'
            ? formatNumberSafely(localPosition[0], 2, ' m', naString)
            : naString,
      },
      {
        id: 'posY',
        label: 'Y',
        value:
          typeof localPosition[1] === 'number'
            ? formatNumberSafely(localPosition[1], 2, ' m', naString)
            : naString,
      },
      {
        id: 'posZ',
        label: 'Z',
        value:
          typeof localPosition[2] === 'number'
            ? formatNumberSafely(localPosition[2], 2, ' m', naString)
            : naString,
      }
    );
  }

  const rssiLabels: React.ReactNode[] = [];
  if (rssi && Array.isArray(rssi) && rssi.length > 0) {
    for (const [index, rssiValue] of Object.entries(rssi)) {
      rssiLabels.push(
        <StatusText key={index} status={getSemanticsForRSSI(rssiValue)}>
          {formatRSSI(rssiValue)}
        </StatusText>,
        ' / '
      );
    }
    rssiLabels.pop();
  } else {
    rssiLabels.push(naText);
  }

  items.push(
    {
      id: 'heading',
      label: 'Heading',
      value:
        typeof heading === 'number'
          ? formatNumberSafely(heading, 1, '°', naString)
          : naString,
    },
    { id: 'sep3', isSeparator: true },
    { id: 'rssi', label: 'RSSI', value: rssiLabels },
    { id: 'sep4', isSeparator: true },
    {
      id: 'lastSeen',
      label: 'Last seen',
      value: lastUpdated ? (
        <TimeAgo formatter={shortTimeAgoFormatter} date={lastUpdated} />
      ) : (
        naText
      ),
    }
  );

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '10px',
        p: '6px 4px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {items.map((item) => {
        if ('isSeparator' in item) {
          return (
            <Box
              key={item.id}
              sx={{
                height: '1px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                my: '4px',
              }}
            />
          );
        }

        return (
          <Box
            key={item.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: '2.5px',
              px: '6px',
              borderRadius: '4px',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                color: 'rgba(255, 255, 255, 0.45)',
                textTransform: 'uppercase',
              }}
            >
              {item.label}
            </Typography>
            <Typography
              component='div'
              sx={{
                fontSize: '11px',
                fontFamily:
                  '"JetBrains Mono", "Roboto Mono", Consolas, monospace',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.9)',
                textAlign: 'right',
                '& .MuiTypography-root': {
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                },
              }}
            >
              {item.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

const ConnectedStatusSummaryMiniTable = connect(
  (state: RootState, ownProps: { uavId?: string }) =>
    getUAVById(state, ownProps.uavId ?? '') ?? {}
)(StatusSummaryMiniTable);

export default ConnectedStatusSummaryMiniTable;
