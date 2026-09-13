import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FieldNotesPanel from '~/views/field-notes';
import LogPanel from '~/views/log';

const BottomConsole = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'logs' | 'notes'>('logs');

  if (!isOpen) {
    return (
      <Box className='bottom-console-pill' onClick={() => setIsOpen(true)}>
        <FormatListBulletedIcon fontSize='small' />
        <Box component='span' style={{ fontSize: '13px', fontWeight: 'bold' }}>
          {t('view.logsAndNotes')}
        </Box>
        <KeyboardArrowDownIcon fontSize='small' style={{ transform: 'rotate(180deg)', marginLeft: '4px' }} />
      </Box>
    );
  }

  return (
    <Box className='bottom-console-container'>
      <Box className='bottom-console-header'>
        <Box className='bottom-console-tabs'>
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

        <IconButton
          className='bottom-console-close-btn'
          size='small'
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <Box className='bottom-console-content'>
        {activeTab === 'logs' ? <LogPanel /> : <FieldNotesPanel />}
      </Box>
    </Box>
  );
};

export default BottomConsole;
