import Box from '@mui/material/Box';
import List from '@mui/material/List';

import { hasFeature } from '~/utils/configuration';

import AuthorizationButton from './AuthorizationButton';
import EnvironmentEditorDialog from './EnvironmentEditorDialog';
import LoadShowFromCloudDialog from './LoadShowFromCloudDialog';
import ManualPreflightChecksDialog from './ManualPreflightChecksDialog';
import OnboardPreflightChecksDialog from './OnboardPreflightChecksDialog';
import ShowControlPanelUpperSegment from './ShowControlPanelUpperSegment';
import StartTimeDialog from './StartTimeDialog';
import TakeoffAreaSetupDialog from './TakeoffAreaSetupDialog';

/**
 * Panel that shows the widgets that are needed to load and configure a drone
 * show.
 */
const ShowControlPanel = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <ShowControlPanelUpperSegment />

    <Box className='bottom-bar'>
      <List
        dense
        disablePadding
        sx={{
          p: 1,
          bgcolor: 'transparent',
          '& .MuiListItem-root': {
            backgroundColor: 'transparent',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            mb: 1.5,
            overflow: 'hidden',
            minHeight: '72px',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiListItemButton-root': {
              height: '100%',
            },
          },
        }}
      >
        <AuthorizationButton />
      </List>
    </Box>

    {hasFeature('loadShowFromCloud') && <LoadShowFromCloudDialog />}
    <EnvironmentEditorDialog />
    <StartTimeDialog />
    <TakeoffAreaSetupDialog />
    <OnboardPreflightChecksDialog />
    <ManualPreflightChecksDialog />
  </Box>
);

export default ShowControlPanel;
