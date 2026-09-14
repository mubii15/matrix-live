import type { Theme } from '@mui/material/styles';
import { keyframes } from '@mui/styled-engine';
import clsx from 'clsx';

import { Colors, Status, makeStyles } from '@skybrush/app-theme-mui';

import { BatteryFormatter } from '~/components/battery';
import BatteryIndicator from '~/components/BatteryIndicator';

import SecondaryStatusLight from './SecondaryStatusLight';

const pulseDots = keyframes({
  '0%': {
    opacity: 0.35,
    transform: 'scale(0.94)',
  },
  '50%': {
    opacity: 1,
    transform: 'scale(1.06)',
  },
  '100%': {
    opacity: 0.35,
    transform: 'scale(0.94)',
  },
});

const useStyles = makeStyles((theme: Theme) => ({
  avatarWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    userSelect: 'none',

    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },

    '&::after': {
      background: Colors.error,
      boxShadow:
        '1px 1px 4px rgba(0, 0, 0, 0.6), 1px 1px 2px rgba(255, 255, 255, 0.3) inset',
      content: '""',
      height: 3,
      left: '50%',
      position: 'absolute',
      top: 36,
      transform: 'rotate(-45deg)',
      transition: 'left 300ms, width 300ms',
      width: '0%',
      zIndex: 5,
      pointerEvents: 'none',
    },

    '&.crossed::after': {
      left: 10,
      width: 52,
    },
  },

  circularContainer: {
    position: 'relative',
    width: 72,
    height: 72,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotsPulsing: {
    transformOrigin: '36px 36px',
    animation: `${pulseDots} 1.8s infinite ease-in-out`,
  },

  dotsStatic: {
    opacity: 0.9,
  },

  statusPill: {
    position: 'absolute',
    bottom: 2,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: 10,
    padding: '1px 7px',
    fontSize: '8.5px',
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.8)',
    zIndex: 3,
    maxWidth: 68,
    textAlign: 'center',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  batteryStatus: {
    marginTop: 2,
  },

  gone: {
    opacity: 0.5,
    filter: 'grayscale(0.6)',
  },
}));

// Precomputed inner dot orbit (16 dots, r=25.5)
const INNER_DOTS = Array.from({ length: 16 }, (_, i) => {
  const angle = (i * 2 * Math.PI) / 16;
  return {
    cx: +(36 + 25.5 * Math.cos(angle)).toFixed(2),
    cy: +(36 + 25.5 * Math.sin(angle)).toFixed(2),
    r: 0.95,
  };
});

// Precomputed outer dot orbit (20 dots, r=30.5, staggered)
const OUTER_DOTS = Array.from({ length: 20 }, (_, i) => {
  const angle = (i * 2 * Math.PI) / 20 + Math.PI / 20;
  return {
    cx: +(36 + 30.5 * Math.cos(angle)).toFixed(2),
    cy: +(36 + 30.5 * Math.sin(angle)).toFixed(2),
    r: 1.2,
  };
});

const getStatusTheme = (status: string) => {
  switch (status) {
    case 'success':
    case 'info':
      return {
        color: '#00e676', // Matrix neon green
        contrastText: '#0a1014',
      };
    case 'warning':
      return {
        color: '#ffb300', // Amber
        contrastText: '#0a1014',
      };
    case 'rth':
      return {
        color: '#00e5ff', // Cyan
        contrastText: '#0a1014',
      };
    case 'error':
      return {
        color: '#ff3d00', // Red-Orange
        contrastText: '#ffffff',
      };
    case 'critical':
      return {
        color: '#ff1744', // Crimson Red
        contrastText: '#ffffff',
      };
    case 'next':
      return {
        color: '#7c4dff', // Purple
        contrastText: '#ffffff',
      };
    case 'off':
    case 'missing':
    default:
      return {
        color: '#546e7a', // Slate Grey
        contrastText: '#ffffff',
      };
  }
};

export type ComplexAvatarProps = Readonly<{
  AvatarProps?: Record<string, unknown>;
  batteryFormatter?: BatteryFormatter;
  batteryStatus?: {
    cellCount?: number;
    voltage?: number;
    percentage?: number;
    charging?: boolean;
  };
  hint?: string;
  crossed?: boolean;
  details?: string;
  editing?: boolean;
  gone?: boolean;
  id?: string;
  label?: string;
  progress?: number;
  secondaryStatus?:
    | 'off'
    | 'info'
    | 'success'
    | 'warning'
    | 'rth'
    | 'error'
    | 'critical';
  selected?: boolean;
  status?: string;
  text?: string;
  textSemantics?: string;
}>;

const ComplexAvatar = ({
  batteryFormatter,
  batteryStatus,
  hint,
  crossed,
  details,
  editing,
  gone,
  id,
  label,
  secondaryStatus,
  status = 'off',
  text,
}: ComplexAvatarProps) => {
  const classes = useStyles();

  let effectiveStatus = editing ? Status.NEXT : status;
  if (effectiveStatus === Status.INFO) {
    effectiveStatus = Status.SUCCESS;
  }

  const { color: statusColor, contrastText: pillTextColor } =
    getStatusTheme(effectiveStatus);

  const displayText = details || text || '';
  const isGroundState =
    !displayText ||
    displayText.toLowerCase() === 'ground' ||
    displayText.toLowerCase() === 'on ground' ||
    displayText.toLowerCase() === 'ready' ||
    displayText.toLowerCase() === 'off' ||
    effectiveStatus === 'off' ||
    gone;

  const isPulsing = !isGroundState;
  const effectiveHint = hint || (label === undefined || label === id ? '' : id);
  const droneNumber = label === undefined ? id : label;

  return (
    <>
      <div
        className={clsx(
          classes.avatarWrapper,
          crossed && 'crossed',
          gone && classes.gone
        )}
      >
        <div className={classes.circularContainer}>
          <svg
            width='72'
            height='72'
            viewBox='0 0 72 72'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            {/* Outer and Inner Orbiting Dots */}
            <g
              className={isPulsing ? classes.dotsPulsing : classes.dotsStatic}
              fill={statusColor}
            >
              {INNER_DOTS.map((dot, idx) => (
                <circle
                  key={`in-${idx}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  opacity='0.75'
                />
              ))}
              {OUTER_DOTS.map((dot, idx) => (
                <circle
                  key={`out-${idx}`}
                  cx={dot.cx}
                  cy={dot.cy}
                  r={dot.r}
                  opacity='0.9'
                />
              ))}
            </g>

            {/* Complete solid status ring (no progress gap) */}
            <circle
              cx='36'
              cy='36'
              r='20.5'
              fill='#0c1117'
              stroke={statusColor}
              strokeWidth='2.8'
              style={{
                filter: `drop-shadow(0 0 3px ${statusColor}60)`,
              }}
            />

            {/* Drone Number / Identifier in the center */}
            {effectiveHint ? (
              <>
                <text
                  x='36'
                  y='31'
                  textAnchor='middle'
                  dominantBaseline='central'
                  fill='#ffffff'
                  fontSize='13'
                  fontWeight='800'
                  fontFamily="'Fira Sans', monospace, sans-serif"
                >
                  {droneNumber}
                </text>
                <line
                  x1='27'
                  y1='36'
                  x2='45'
                  y2='36'
                  stroke={statusColor}
                  strokeWidth='0.8'
                  opacity='0.6'
                />
                <text
                  x='36'
                  y='41.5'
                  textAnchor='middle'
                  dominantBaseline='central'
                  fill='#94a3b8'
                  fontSize='7.5'
                  fontWeight='600'
                  fontFamily="'Fira Sans', monospace, sans-serif"
                >
                  {effectiveHint}
                </text>
              </>
            ) : (
              <text
                x='36'
                y='36'
                textAnchor='middle'
                dominantBaseline='central'
                fill='#ffffff'
                fontSize='15'
                fontWeight='800'
                fontFamily="'Fira Sans', monospace, sans-serif"
              >
                {droneNumber}
              </text>
            )}
          </svg>

          {/* Status badge ("GROUND", etc.) overlapping the bottom of the circle */}
          {displayText && (
            <div
              className={classes.statusPill}
              style={{
                backgroundColor: statusColor,
                color: pillTextColor,
              }}
            >
              {displayText}
            </div>
          )}

          {secondaryStatus && <SecondaryStatusLight status={secondaryStatus} />}
        </div>
      </div>

      {batteryStatus && (
        <BatteryIndicator
          className={classes.batteryStatus}
          formatter={batteryFormatter}
          {...batteryStatus}
        />
      )}
    </>
  );
};

export default ComplexAvatar;
