import BoltIcon from '@mui/icons-material/Bolt';
import FlightIcon from '@mui/icons-material/Flight';
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Status, makeStyles } from '@skybrush/app-theme-mui';

import type { BatteryFormatter } from '~/components/battery';
import BatteryIndicator from '~/components/BatteryIndicator';
import { colorForStatus } from '~/components/colors';
import { getBatteryFormatter } from '~/features/settings/selectors';
import {
  abbreviateFlightMode,
  abbreviateGPSFixType,
  getSemanticsForGPSFixType,
  type GPSFixType,
} from '~/model/enums';
import { UAVAge, type UAVBattery } from '~/model/uav';
import type { RootState } from '~/store/reducers';
import { formatCoordinateArray, formatNumberSafely } from '~/utils/formatting';

import { createSingleUAVStatusSummarySelector, getUAVById } from './selectors';

const localCoordinateFormatter = formatCoordinateArray;

const useStyles = makeStyles({
  container: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow:
      '0 20px 40px -4px rgba(0, 0, 0, 0.7), 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    minWidth: 240,
    maxWidth: 270,
    userSelect: 'none',
    transition: 'background-color 0.25s ease',
  },
  mainCard: {
    backgroundColor: '#16171b',
    borderRadius: 18,
    margin: '2px 2px 0 2px',
    padding: '12px 14px 12px 14px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    position: 'relative',
    zIndex: 2,
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 0.2,
  },
  headingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: 'rgba(255, 255, 255, 0.55)',
  },
  batteryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    color: 'rgba(255, 255, 255, 0.75)',
    '& .MuiBox-root': {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3,
      fontSize: 11,
      fontWeight: 600,
      width: 'auto',
      padding: 0,
      textAlign: 'right',
    },
    '& svg': {
      fontSize: '14px !important',
    },
  },
  heroRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    backgroundColor: '#23252a',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#d8f576',
    flexShrink: 0,
    boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 4px 10px rgba(0, 0, 0, 0.4)',
    transition: 'opacity 0.2s ease',
  },
  avatarGone: {
    opacity: 0.4,
    filter: 'grayscale(1)',
  },
  identity: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1.2,
    letterSpacing: -0.2,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  statusRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
  },
  statusText: {
    fontSize: 11.5,
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  pillsRow: {
    display: 'flex',
    gap: 8,
  },
  pill: {
    flex: 1,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#24252a',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#f0f2f5',
    padding: '0 8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    '&:hover': {
      backgroundColor: '#2b2c33',
      borderColor: 'rgba(255, 255, 255, 0.16)',
    },
  },
  footerTab: {
    height: 34,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '0 12px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 0.2,
    position: 'relative',
    zIndex: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const CompassIcon = () => (
  <svg
    width='12'
    height='12'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='12' cy='12' r='10' />
    <polygon
      points='16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76'
      fill='currentColor'
      fillOpacity='0.7'
    />
  </svg>
);

const DroneAvatarIcon = () => (
  <svg
    width='22'
    height='22'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.8'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <circle cx='5' cy='5' r='2.2' />
    <circle cx='19' cy='5' r='2.2' />
    <circle cx='5' cy='19' r='2.2' />
    <circle cx='19' cy='19' r='2.2' />
    <line x1='6.8' y1='6.8' x2='10' y2='10' />
    <line x1='17.2' y1='6.8' x2='14' y2='10' />
    <line x1='6.8' y1='17.2' x2='10' y2='14' />
    <line x1='17.2' y1='17.2' x2='14' y2='14' />
    <rect
      x='9.5'
      y='9.5'
      width='5'
      height='5'
      rx='1.5'
      fill='currentColor'
      fillOpacity='0.3'
    />
  </svg>
);

const getCardAccentColor = (status?: Status) => {
  switch (status) {
    case Status.ERROR:
    case Status.CRITICAL:
      return '#ff5252';
    case Status.WARNING:
      return '#ffb74d';
    case Status.RTH:
      return '#ff7043';
    case Status.OFF:
    case Status.MISSING:
      return '#4a4d55';
    case Status.INFO:
    case Status.SUCCESS:
    default:
      return '#d8f576';
  }
};

export type DroneInfoTooltipContentProps = {
  age?: UAVAge;
  batteryFormatter?: BatteryFormatter;
  batteryStatus?: UAVBattery;
  details?: string;
  gpsFix?: {
    numSatellites?: number;
    type?: GPSFixType;
  };
  heading?: number;
  label?: string;
  localPosition?: number[];
  mode?: string;
  position?: {
    ahl?: number;
  };
  text?: string;
  textSemantics?: Status;
};

export const DroneInfoTooltipContent = ({
  age,
  batteryFormatter,
  batteryStatus,
  details,
  gpsFix,
  heading,
  label,
  localPosition,
  mode,
  position,
  text,
  textSemantics,
}: DroneInfoTooltipContentProps) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { type: gpsFixType, numSatellites } = gpsFix || {};
  const hasLocalPosition = Boolean(localPosition && Array.isArray(localPosition));

  const baseAccentColor = getCardAccentColor(textSemantics);
  const statusDotColor = textSemantics ? colorForStatus(textSemantics) : '#d8f576';
  const isDarkAccent =
    textSemantics === Status.OFF || textSemantics === Status.MISSING;
  const footerTextColor = isDarkAccent ? '#ffffff' : '#0d0e12';

  const gpsSemantics =
    gpsFixType !== undefined ? getSemanticsForGPSFixType(gpsFixType) : undefined;
  const gpsColor =
    gpsSemantics !== undefined ? colorForStatus(gpsSemantics) : 'inherit';

  const footerContent = hasLocalPosition ? (
    <>
      <BoltIcon sx={{ fontSize: 15 }} />
      <span>{localCoordinateFormatter(localPosition! /* documented justified non-null */)}</span>
    </>
  ) : (
    <>
      <BoltIcon sx={{ fontSize: 15 }} />
      <span>
        {formatNumberSafely(position?.ahl, 1, ' m', '—')}&nbsp;AHL
        &nbsp;•&nbsp;
        {formatNumberSafely(numSatellites, 0, '', '—')}&nbsp;sats
      </span>
    </>
  );

  return (
    <div
      className={clsx(classes.container, 'drone-card-container')}
      style={{ backgroundColor: baseAccentColor }}
    >
      <div className={classes.mainCard}>
        {/* Header Row: Heading on left, Battery on right */}
        <div className={classes.headerRow}>
          <div className={classes.headingItem}>
            <CompassIcon />
            <span>{formatNumberSafely(heading, 1, '°', '—')}</span>
          </div>
          <div className={classes.batteryItem}>
            <BatteryIndicator formatter={batteryFormatter} {...batteryStatus} />
          </div>
        </div>

        {/* Hero Row: Avatar + Title & Status */}
        <div className={classes.heroRow}>
          <div
            className={clsx(
              classes.avatar,
              age === UAVAge.GONE && classes.avatarGone
            )}
          >
            <DroneAvatarIcon />
          </div>
          <div className={classes.identity}>
            <div className={classes.title}>
              {t('uavs.uavTitle', {
                id: label || '--',
                defaultValue: `UAV ${label || '--'}`,
              })}
            </div>
            <div className={classes.statusRow}>
              <span
                className={classes.statusDot}
                style={{
                  backgroundColor: statusDotColor,
                  boxShadow: `0 0 8px ${statusDotColor}`,
                }}
              />
              <span className={classes.statusText}>
                {details || text || 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Pills Row */}
        <div className={classes.pillsRow}>
          <div className={classes.pill}>
            <FlightIcon sx={{ fontSize: 14, opacity: 0.8 }} />
            <span>{mode ? abbreviateFlightMode(mode) : '----'}</span>
          </div>
          <div className={classes.pill}>
            <SatelliteAltIcon sx={{ fontSize: 14, color: gpsColor }} />
            <span style={{ color: gpsColor }}>
              {gpsFixType !== undefined
                ? abbreviateGPSFixType(gpsFixType)
                : 'NO FIX'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Accent Footer Tab */}
      <div className={classes.footerTab} style={{ color: footerTextColor }}>
        {footerContent}
      </div>
    </div>
  );
};

type OwnProps = {
  id: string;
};

const ConnectedDroneInfoTooltipContent = connect(
  () => {
    const statusSummarySelector = createSingleUAVStatusSummarySelector();
    return (state: RootState, ownProps: OwnProps) => {
      const uavId = ownProps.id;
      const uav = getUAVById(state, uavId);
      return {
        batteryFormatter: getBatteryFormatter(state),
        gpsFix: uav?.gpsFix,
        heading: uav?.heading,
        label: uavId,
        localPosition: uav?.localPosition,
        missing: !uav,
        mode: uav?.mode,
        position: uav?.position,
        ...statusSummarySelector(state, ownProps.id),
      };
    };
  }
)(DroneInfoTooltipContent);

export default ConnectedDroneInfoTooltipContent;
