import CloseIcon from '@mui/icons-material/Close';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { connect } from 'react-redux';

import { getUAVIdList } from '~/features/uavs/selectors';
import type { RootState } from '~/store/reducers';
import UAVList from '~/views/uavs/UAVList';

type BottomUAVsWindowProps = {
  uavCount: number;
};

const BottomUAVsWindow = ({ uavCount }: BottomUAVsWindowProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Box
        onClick={() => setIsOpen(true)}
        sx={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1100,
          backgroundColor: '#1a1b1e',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.45)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          px: 2.2,
          py: 1,
          cursor: 'pointer',
          pointerEvents: 'auto',
          userSelect: 'none',
          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
          '&:hover': {
            backgroundColor: 'rgba(30, 32, 38, 0.98)',
            transform: 'translateX(-50%) translateY(-3px) scale(1.03)',
            color: '#d8f576',
            borderColor: 'rgba(216, 245, 118, 0.4)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px rgba(216, 245, 118, 0.2)',
            '& .uav-pill-icon': {
              transform: 'scale(1.15) rotate(-8deg)',
              color: '#d8f576',
            },
            '& .uav-pill-arrow': {
              transform: 'translateY(-2px)',
              color: '#d8f576',
            },
          },
          '&:active': {
            transform: 'translateX(-50%) scale(0.96)',
            transitionDuration: '0.1s',
          },
        }}
      >
        {/* Live pulsing status dot */}
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#d8f576',
            boxShadow: '0 0 8px #d8f576',
            animation: 'uavLivePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes uavLivePulse': {
              '0%, 100%': { opacity: 1, transform: 'scale(1)' },
              '50%': { opacity: 0.35, transform: 'scale(0.85)' },
            },
          }}
        />
        <FlightTakeoffIcon
          className='uav-pill-icon'
          sx={{
            fontSize: 18,
            color: 'rgba(255, 255, 255, 0.85)',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s',
          }}
        />
        <Typography sx={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.2px' }}>
          UAVs ({uavCount})
        </Typography>
        <KeyboardArrowUpIcon
          className='uav-pill-arrow'
          sx={{
            fontSize: 18,
            ml: 0.2,
            color: 'rgba(255, 255, 255, 0.6)',
            transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'clamp(760px, 80vw, 1280px)',
        height: '320px',
        maxHeight: 'calc(100vh - 120px)',
        zIndex: 1100,
        backgroundColor: '#1a1b1e !important',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.04)',
        color: '#fff !important',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        pointerEvents: 'auto',
        '& .MuiPaper-root': {
          backgroundColor: 'transparent',
          color: '#fff',
        },
        '& .MuiToolbar-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          color: '#fff',
        },
        '& .MuiTableCell-root': {
          color: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        },
        '& .MuiTypography-root': {
          color: 'inherit',
        },
        '& .MuiSvgIcon-root': {
          color: 'inherit',
        },
        animation: 'slideUpAndExpand 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        '@keyframes slideUpAndExpand': {
          '0%': {
            opacity: 0,
            transform: 'translateX(-50%) translateY(24px) scale(0.97)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateX(-50%) translateY(0) scale(1)',
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoffIcon sx={{ fontSize: 18, color: '#d8f576' }} />
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
            UAVs
          </Typography>
          <Chip
            label={uavCount}
            size='small'
            sx={{
              height: 20,
              fontSize: '11px',
              fontWeight: 700,
              backgroundColor: 'rgba(216, 245, 118, 0.12)',
              color: '#d8f576',
              border: '1px solid rgba(216, 245, 118, 0.25)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(216, 245, 118, 0.2)',
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size='small'
            onClick={() => setIsOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                color: '#d8f576',
                backgroundColor: 'rgba(216, 245, 118, 0.12)',
                transform: 'translateY(1px) scale(1.1)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
          >
            <KeyboardArrowDownIcon fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => setIsOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                transform: 'rotate(90deg) scale(1.1)',
              },
              '&:active': {
                transform: 'rotate(90deg) scale(0.9)',
              },
            }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': { width: 6 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 3,
            '&:hover': {
              backgroundColor: 'rgba(216, 245, 118, 0.4)',
            },
          },
        }}
      >
        <UAVList />
      </Box>
    </Box>
  );
};

export default connect((state: RootState) => ({
  uavCount: getUAVIdList(state).length,
}))(BottomUAVsWindow);
