import ArticleOutlined from '@mui/icons-material/ArticleOutlined';
import Close from '@mui/icons-material/Close';
import DragIndicator from '@mui/icons-material/DragIndicator';
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Tooltip } from '@skybrush/mui-components';

import { type RootState } from '~/store/reducers';

import {
  closeUAVDetailsDialog,
  getSelectedTabInUAVDetailsDialog,
  setSelectedTabInUAVDetailsDialog,
} from './details';
import { UAVDetailsDialogTab } from './types';

type UAVDetailsDialogTabsProps = {
  dragHandle?: string;
  onClose: () => void;
  onTabChange: (
    event: React.SyntheticEvent,
    value: UAVDetailsDialogTab
  ) => void;
  value?: UAVDetailsDialogTab;
};

const UAVDetailsDialogTabs = ({
  dragHandle,
  onClose,
  onTabChange,
  value = UAVDetailsDialogTab.PREFLIGHT,
}: UAVDetailsDialogTabsProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#16171b',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        height: 48,
        minHeight: 48,
        userSelect: 'none',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Tabs */}
      <Tabs
        value={value}
        onChange={onTabChange}
        sx={{
          minHeight: 48,
          height: 48,
          '& .MuiTabs-indicator': {
            backgroundColor: '#d8f576',
            height: '2.5px',
            borderRadius: '2px 2px 0 0',
            boxShadow: '0 0 10px rgba(216, 245, 118, 0.5)',
          },
          '& .MuiTab-root': {
            minHeight: 48,
            height: 48,
            px: 2,
            py: 0,
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)',
            gap: 0.8,
            flexDirection: 'row',
            transition: 'color 0.2s ease, background-color 0.2s ease',
            '&.Mui-selected': {
              color: '#d8f576',
            },
            '&:hover': {
              color: 'rgba(255, 255, 255, 0.9)',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
            },
            '& .MuiSvgIcon-root': {
              fontSize: '17px',
              mb: '0 !important',
            },
          },
        }}
      >
        <Tab
          icon={<FactCheckOutlined />}
          label={t('uavDetailsDialog.tabs.preflight', 'Preflight')}
          value={UAVDetailsDialogTab.PREFLIGHT}
        />
        <Tab
          icon={<TuneOutlined />}
          label={t('uavDetailsDialog.tabs.tests', 'Tests')}
          value={UAVDetailsDialogTab.TESTS}
        />
        <Tab
          icon={<ForumOutlined />}
          label={t('uavDetailsDialog.tabs.messages', 'Messages')}
          value={UAVDetailsDialogTab.MESSAGES}
        />
        <Tab
          icon={<ArticleOutlined />}
          label={t('uavDetailsDialog.tabs.logs', 'Logs')}
          value={UAVDetailsDialogTab.LOGS}
        />
      </Tabs>

      {/* Drag handle space */}
      <Box
        id={dragHandle}
        sx={{
          flex: 1,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'move',
          px: 1,
          '&:hover .drag-dots': {
            opacity: 0.6,
          },
        }}
      >
        <Box
          className='drag-dots'
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(255, 255, 255, 0.2)',
            transition: 'opacity 0.2s',
          }}
        >
          <DragIndicator sx={{ fontSize: 16 }} />
        </Box>
      </Box>

      {/* Close button */}
      <Box sx={{ pr: 1 }}>
        <Tooltip content={t('uavDetailsDialog.close', 'Close')}>
          <IconButton
            size='small'
            onClick={onClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.45)',
              p: 0.7,
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              '&:hover': {
                color: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.12)',
              },
            }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

const ConnectedUAVDetailsDialogTabs = connect(
  (state: RootState) => ({
    value: getSelectedTabInUAVDetailsDialog(state),
  }),
  {
    onClose: closeUAVDetailsDialog,
    onTabChange: (
      _event: React.SyntheticEvent,
      value: UAVDetailsDialogTab
    ) => setSelectedTabInUAVDetailsDialog(value),
  }
)(UAVDetailsDialogTabs);

export default ConnectedUAVDetailsDialogTabs;
