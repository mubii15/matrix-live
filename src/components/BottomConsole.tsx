import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import TerminalIcon from '@mui/icons-material/Terminal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  setLocalServerForceRunning,
  startLocalServerExecutableSearch,
} from '~/features/local-server/slice';
import {
  disconnectFromServer,
  updateServerSettings,
} from '~/features/servers/actions';
import { type RootState } from '~/store/reducers';

import FieldNotesPanel from '~/views/field-notes';
import LogPanel from '~/views/log';
import ServerTerminalPanel from '~/views/log/ServerTerminalPanel';

const BottomConsole = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isServerRunning = useSelector(
    (state: RootState) => Boolean(state.localServer.running)
  );
  const forceRunning = useSelector(
    (state: RootState) => Boolean(state.localServer.forceRunning)
  );
  const isServerActive = useSelector(
    (state: RootState) => Boolean(state.dialogs.serverSettings.active)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'server-terminal' | 'logs' | 'notes'
  >('server-terminal');

  const isRunning = isServerRunning || (forceRunning && isServerActive);

  const handleToggleServer = () => {
    if (isRunning || forceRunning || isServerActive) {
      dispatch(setLocalServerForceRunning(false));
      dispatch(disconnectFromServer());
    } else {
      dispatch(startLocalServerExecutableSearch());
      dispatch(setLocalServerForceRunning(true));
      dispatch(
        updateServerSettings({
          active: true,
          hostName: 'localhost',
        })
      );
    }
  };

  if (!isOpen) {
    return (
      <Box className='bottom-console-pill' onClick={() => setIsOpen(true)}>
        <TerminalIcon fontSize='small' />
        <Box component='span' style={{ fontSize: '13px', fontWeight: 'bold' }}>
          {t('view.server-console')}
        </Box>
        <Box
          className={`bottom-console-status-dot ${isRunning ? 'running' : ''}`}
        />
        {isRunning && (
          <Box component='span' className='bottom-console-status-badge'>
            {t('view.running')}
          </Box>
        )}
        <KeyboardArrowDownIcon
          fontSize='small'
          style={{ transform: 'rotate(180deg)', marginLeft: '4px' }}
        />
      </Box>
    );
  }

  return (
    <Box className='bottom-console-container'>
      <Box className='bottom-console-header'>
        <Box className='bottom-console-tabs'>
          <Box
            className={`bottom-console-tab-item ${activeTab === 'server-terminal' ? 'active' : ''}`}
            onClick={() => setActiveTab('server-terminal')}
          >
            <TerminalIcon fontSize='inherit' />
            {t('view.server-terminal')}
            <Box
              className={`bottom-console-status-dot ${isRunning ? 'running' : ''}`}
              sx={{ ml: 0.5 }}
            />
          </Box>
          <Box
            className={`bottom-console-tab-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <FormatListBulletedIcon fontSize='inherit' />
            {t('view.log-panel')}
          </Box>
          <Box
            className={`bottom-console-tab-item ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <AssignmentIcon fontSize='inherit' />
            {t('view.field-notes')}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {activeTab === 'server-terminal' && (
            <Button
              variant='contained'
              color={isRunning ? 'error' : 'primary'}
              startIcon={isRunning ? <StopIcon /> : <PlayArrowIcon />}
              onClick={handleToggleServer}
              size='small'
              disableElevation
              sx={{
                borderRadius: '8px',
                fontWeight: 'bold',
                height: '24px',
                fontSize: '10px',
              }}
            >
              {isRunning ? t('view.stop-server') : t('view.start-server')}
            </Button>
          )}
          <IconButton
            className='bottom-console-close-btn'
            size='small'
            onClick={() => setIsOpen(false)}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <Box className='bottom-console-content'>
        {activeTab === 'server-terminal' ? (
          <ServerTerminalPanel />
        ) : activeTab === 'logs' ? (
          <LogPanel />
        ) : (
          <FieldNotesPanel />
        )}
      </Box>
    </Box>
  );
};

export default BottomConsole;
