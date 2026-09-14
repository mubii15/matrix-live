import Box from '@mui/material/Box';
import clamp from 'lodash-es/clamp';
import React from 'react';
import { connect } from 'react-redux';

import { DraggableDialog } from '@skybrush/mui-components';

import ResizableBox from '~/components/ResizableBox';
import { clearPendingUAVId } from '~/features/hotkeys/actions';
import { isPendingUAVIdOverlayVisible } from '~/features/hotkeys/selectors';
import { type AppDispatch, type RootState } from '~/store/reducers';

import {
  UAV_DETAILS_DIALOG_BODY_HEIGHT as BODY_HEIGHT,
  UAV_DETAILS_DIALOG_BODY_MIN_WIDTH as BODY_MIN_WIDTH,
  UAV_DETAILS_DIALOG_HEIGHT as HEIGHT,
  UAV_DETAILS_DIALOG_SIDEBAR_WIDTH as SIDEBAR_WIDTH,
} from './constants';
import {
  closeUAVDetailsDialog,
  getUAVDetailsDialogPosition,
  getUAVDetailsDialogWidth,
  isUAVDetailsDialogOpen,
  setUAVDetailsDialogPosition,
  setUAVDetailsDialogWidth,
} from './details';
import UAVDetailsDialogBody from './UAVDetailsDialogBody';
import UAVDetailsDialogSidebar from './UAVDetailsDialogSidebar';
import UAVDetailsDialogTabs from './UAVDetailsDialogTabs';

type Position = {
  x: number;
  y: number;
};

type UAVDetailsDialogProps = {
  initialPosition: Position;
  initialWidth: number;
  onClose: () => void;
  onDragStop: (event: any, data: Position) => void;
  onResizeStop: (
    event: any,
    data: { size: { width: number; height: number } }
  ) => void;
  open: boolean;
};

/**
 * Presentation component for the dialog that allows the user to inspect the
 * details of a specific UAV.
 */
const UAVDetailsDialog = ({
  initialPosition,
  initialWidth,
  onClose,
  onDragStop,
  onResizeStop,
  open,
}: UAVDetailsDialogProps) => {
  const horizontalBound = (window.innerWidth - initialWidth) / 2;
  const verticalBound = (window.innerHeight - HEIGHT) / 2;

  const defaultPosition = {
    x: clamp(initialPosition.x, -horizontalBound, horizontalBound),
    y: clamp(initialPosition.y, -verticalBound, verticalBound),
  };

  const draggableProps: any = {
    bounds: 'parent',
    defaultPosition,
    onStop: onDragStop,
  };

  return (
    <DraggableDialog
      DraggableProps={draggableProps}
      open={open}
      maxWidth={false}
      PaperProps={{
        sx: {
          backgroundColor: '#16171b !important',
          backgroundImage: 'none !important',
          borderRadius: '16px !important',
          border: '1px solid rgba(255, 255, 255, 0.08) !important',
          boxShadow:
            '0 24px 64px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.04) !important',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          '& > .MuiBox-root': {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            height: '100%',
            overflow: 'hidden',
          },
          '& > .MuiBox-root > div:first-of-type': {
            backgroundColor: '#121316 !important',
            borderRight: '1px solid rgba(255, 255, 255, 0.06) !important',
            display: 'flex',
            flexDirection: 'column',
          },
          '& > .MuiBox-root > .MuiBox-root': {
            backgroundColor: '#18191d',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
          '& .react-resizable-handle-e': {
            right: 0,
            width: '12px',
            cursor: 'ew-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s ease',
            zIndex: 10,
            '&:hover': {
              backgroundColor: 'rgba(216, 245, 118, 0.08)',
            },
            '&::after': {
              content: '""',
              width: '4px',
              height: '28px',
              borderRadius: '2px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transition: 'background-color 0.2s ease, height 0.2s ease',
            },
            '&:hover::after': {
              backgroundColor: '#d8f576',
              height: '38px',
            },
          },
        },
      }}
      sidebarComponents={<UAVDetailsDialogSidebar />}
      toolbarComponent={(dragHandleId) => (
        <UAVDetailsDialogTabs dragHandle={dragHandleId} />
      )}
      onClose={onClose}
    >
      <ResizableBox
        axis='x'
        resizeHandles={['e']}
        initialSize={{
          width: initialWidth - SIDEBAR_WIDTH,
          height: BODY_HEIGHT,
        }}
        minConstraints={[BODY_MIN_WIDTH, BODY_HEIGHT]}
        boxProps={{ maxWidth: '100%' }}
        onResizeStop={onResizeStop}
      >
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
            p: 1.5,
            boxSizing: 'border-box',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
            },
          }}
        >
          <UAVDetailsDialogBody />
        </Box>
      </ResizableBox>
    </DraggableDialog>
  );
};

const ConnectedUAVDetailsDialog = connect(
  // mapStateToProps
  (state: RootState) => ({
    initialPosition: getUAVDetailsDialogPosition(state),
    initialWidth: getUAVDetailsDialogWidth(state),
    open: isUAVDetailsDialogOpen(state),
  }),

  // mapDispatchToProps
  {
    onClose: () => (dispatch: AppDispatch, getState: () => RootState) => {
      if (isPendingUAVIdOverlayVisible(getState())) {
        dispatch(clearPendingUAVId());
      } else {
        dispatch(closeUAVDetailsDialog());
      }
    },
    onDragStop:
      (_event: any, { x, y }: Position) =>
      (dispatch: AppDispatch) => {
        dispatch(setUAVDetailsDialogPosition({ x, y }));
      },
    onResizeStop:
      (_event: any, { size }: { size: { width: number; height: number } }) =>
      (dispatch: AppDispatch) => {
        dispatch(setUAVDetailsDialogWidth(size.width + SIDEBAR_WIDTH));
      },
  }
)(UAVDetailsDialog);

export default ConnectedUAVDetailsDialog;
