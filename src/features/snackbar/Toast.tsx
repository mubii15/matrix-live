import { type AlertColor } from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import Countdown from '~/components/Countdown';
import { useCountdown } from '~/hooks/useCountdown';

import { MessageSemantics, type Notification } from './types';

const PixelSmileyIcon = () => (
  <svg width='24' height='24' viewBox='0 0 16 16' fill='#2E7D32' style={{ flexShrink: 0 }}>
    <rect x='3' y='4' width='2' height='2' />
    <rect x='11' y='4' width='2' height='2' />
    <rect x='3' y='9' width='2' height='2' />
    <rect x='11' y='9' width='2' height='2' />
    <rect x='5' y='11' width='6' height='2' />
  </svg>
);

const PixelNeutralIcon = () => (
  <svg width='24' height='24' viewBox='0 0 16 16' fill='#1976D2' style={{ flexShrink: 0 }}>
    <rect x='3' y='4' width='2' height='2' />
    <rect x='11' y='4' width='2' height='2' />
    <rect x='4' y='10' width='8' height='2' />
  </svg>
);

const PixelSadIcon = ({ fill }: { fill: string }) => (
  <svg width='24' height='24' viewBox='0 0 16 16' fill={fill} style={{ flexShrink: 0 }}>
    <rect x='3' y='4' width='2' height='2' />
    <rect x='11' y='4' width='2' height='2' />
    <rect x='5' y='9' width='6' height='2' />
    <rect x='3' y='11' width='2' height='2' />
    <rect x='11' y='11' width='2' height='2' />
  </svg>
);

const CheckBadge = () => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill='#2E7D32' style={{ flexShrink: 0 }}>
    <circle cx='8' cy='8' r='8' />
    <path d='M5 8l2 2 4-4' stroke='#fff' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' fill='none' />
  </svg>
);

const MinusBadge = ({ fill }: { fill: string }) => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill={fill} style={{ flexShrink: 0 }}>
    <circle cx='8' cy='8' r='8' />
    <line x1='4' y1='8' x2='12' y2='8' stroke='#fff' strokeWidth='2.5' strokeLinecap='round' fill='none' />
  </svg>
);

const DownBadge = () => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill='#1976D2' style={{ flexShrink: 0 }}>
    <circle cx='8' cy='8' r='8' />
    <path d='M5 7l3 3 3-3' stroke='#fff' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round' fill='none' />
  </svg>
);

const semanticsToSeverity: Record<MessageSemantics, AlertColor> = {
  [MessageSemantics.DEFAULT]: 'info',
  [MessageSemantics.INFO]: 'info',
  [MessageSemantics.SUCCESS]: 'success',
  [MessageSemantics.WARNING]: 'warning',
  [MessageSemantics.ERROR]: 'error',
};

type ToastContentProps = {
  notification: Notification;
};

const ToastContent = ({ notification }: ToastContentProps) => {
  const dispatch = useDispatch();
  const { message, buttons, countdown, timeout } = notification;

  let result: ReactNode = message;

  if (countdown && timeout !== undefined && Number.isFinite(timeout)) {
    result = (
      <>
        {result}&nbsp;({<Countdown seconds={timeout / 1000} />})
      </>
    );
  }

  if (Array.isArray(buttons) && buttons.length > 0) {
    const buttonComponents = buttons.map(
      ({ action, label, ...rest }, index) => (
        <Button
          key={index}
          className='custom-toast-action-btn'
          size='small'
          variant='outlined'
          onClick={() => dispatch(action as never)}
          {...rest}
        >
          {label}
        </Button>
      )
    );

    result = (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {result}
        {buttonComponents}
      </Box>
    );
  }

  return result;
};

type ToastProps = ToastContentProps & {
  toastId: string;
};

const Toast = ({ toastId, notification }: ToastProps) => {
  const { t } = useTranslation();
  const { pause, progress, resume } = useCountdown(notification.timeout);
  const effectiveProgress =
    notification.timeout === undefined ? progress : 100 - progress;
  const severity =
    semanticsToSeverity[notification.semantics ?? MessageSemantics.DEFAULT];

  return (
    <Box
      className={`custom-toast-container ${severity}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {severity === 'success' && <PixelSmileyIcon />}
      {severity === 'info' && <PixelNeutralIcon />}
      {severity === 'warning' && <PixelSadIcon fill='#ED6C02' />}
      {severity === 'error' && <PixelSadIcon fill='#D32F2F' />}

      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ fontWeight: 800, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {severity === 'success' && t('Toast.doingGreat', 'Doing Great!')}
              {severity === 'info' && t('Toast.doingOk', 'Doing OK')}
              {(severity === 'warning' || severity === 'error') && t('Toast.payAttention', 'Pay Attention!')}
            </span>
            {severity === 'success' && <CheckBadge />}
            {severity === 'info' && <DownBadge />}
            {severity === 'warning' && <MinusBadge fill='#ED6C02' />}
            {severity === 'error' && <MinusBadge fill='#D32F2F' />}
          </Box>
          <button className='custom-toast-close-btn' onClick={() => toast.dismiss(toastId)}>
            <CloseIcon sx={{ fontSize: 14 }} />
          </button>
        </Box>

        <Box sx={{ fontSize: '12px', lineHeight: '1.4', fontWeight: 500, opacity: 0.9 }}>
          <ToastContent notification={notification} />
        </Box>
      </Box>

      <Box
        className={`custom-toast-progress-bar ${severity}`}
        style={{ width: `${effectiveProgress}%` }}
      />
    </Box>
  );
};

export default Toast;
