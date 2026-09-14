import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import React from 'react';
import { connect } from 'react-redux';

import DroneAvatar from '~/components/uavs/DroneAvatar';
import UAVOperationsButtonGroup from '~/components/uavs/UAVOperationsButtonGroup';
import { UAVSelectorWrapper } from '~/components/uavs/UAVSelector';
import { type RootState } from '~/store/reducers';

import { UAV_DETAILS_DIALOG_SIDEBAR_WIDTH as WIDTH } from './constants';
import {
  getSelectedUAVIdInUAVDetailsDialog,
  setSelectedUAVIdInUAVDetailsDialog,
} from './details';
import StatusSummaryMiniTable from './StatusSummaryMiniTable';

type UAVDetailsDialogSidebarProps = {
  setUAVId: (id: string) => void;
  uavId?: string;
};

/**
 * Sidebar of the UAV details dialog.
 */
const UAVDetailsDialogSidebar = ({
  setUAVId,
  uavId,
}: UAVDetailsDialogSidebarProps) => {
  return (
    <Box
      sx={{
        width: WIDTH,
        minWidth: WIDTH,
        maxWidth: WIDTH,
        height: '100%',
        boxSizing: 'border-box',
        p: '14px 10px',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.2,
        backgroundColor: '#121316',
        overflowY: 'auto',
        overflowX: 'hidden',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
        },
      }}
    >
      {/* UAV Avatar Selector Card */}
      <UAVSelectorWrapper sortedByError onSelect={setUAVId}>
        {(handleClick: (event: React.MouseEvent<HTMLElement>) => void) => (
          <Box
            onClick={handleClick}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              p: '12px 8px 8px 8px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(216, 245, 118, 0.35)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
                '& .selector-arrow': {
                  color: '#d8f576',
                  transform: 'translateY(1px)',
                },
              },
            }}
          >
            <DroneAvatar id={uavId} />
            <Box
              className='selector-arrow'
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.3)',
                mt: 0.5,
                transition: 'all 0.2s ease',
              }}
            >
              <KeyboardArrowDown sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        )}
      </UAVSelectorWrapper>

      {/* Operation Actions Cluster */}
      <Box
        sx={{
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          p: '8px 4px',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0.3,
          '& .MuiIconButton-root': {
            p: '5px',
            color: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.18s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              transform: 'scale(1.1)',
            },
          },
          '& .MuiButton-root': {
            width: '100%',
            my: '4px',
            py: '3px',
            borderRadius: '8px',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'rgba(255, 255, 255, 0.85)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'rgba(216, 245, 118, 0.12)',
              borderColor: 'rgba(216, 245, 118, 0.4)',
              color: '#d8f576',
            },
          },
        }}
      >
        <UAVOperationsButtonGroup
          broadcast={false}
          hideSeparators
          selectedUAVIds={uavId ? [uavId] : []}
          size='small'
        />
      </Box>

      {/* Telemetry HUD Readout */}
      <StatusSummaryMiniTable uavId={uavId} />
    </Box>
  );
};

const ConnectedUAVDetailsDialogSidebar = connect(
  // mapStateToProps
  (state: RootState) => ({
    uavId: getSelectedUAVIdInUAVDetailsDialog(state),
  }),
  // mapDispatchToProps
  {
    setUAVId: setSelectedUAVIdInUAVDetailsDialog,
  }
)(UAVDetailsDialogSidebar);

export default ConnectedUAVDetailsDialogSidebar;
