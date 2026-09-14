import Box from '@mui/material/Box';
import { connect } from 'react-redux';

import { type LogItem } from '~/features/log/types';
import { type RootState } from '~/store/reducers';

import LogMessageList from './LogMessageList';

type ServerTerminalPanelProps = {
  items: LogItem[];
};

const ServerTerminalPanel = ({ items = [] }: ServerTerminalPanelProps) => {
  // Filter for local server logs
  const serverItems = items.filter(
    (item) => item.auxiliaryId && item.auxiliaryId.startsWith('LOCAL_SERVER')
  );

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <LogMessageList items={serverItems} />
      </Box>
    </Box>
  );
};

const ConnectedServerTerminalPanel = connect((state: RootState) => ({
  items: state.log.items,
}))(ServerTerminalPanel);

export default ConnectedServerTerminalPanel;
