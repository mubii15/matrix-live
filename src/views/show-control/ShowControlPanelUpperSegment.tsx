import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { connect } from 'react-redux';

import MultiPagePanel, { Page } from '~/components/MultiPagePanel';
import {
  getShowEnvironmentType,
  isShowAuthorizedToStartLocally,
} from '~/features/show/selectors';
import type { RootState } from '~/store/reducers';

import EnvironmentButton from './EnvironmentButton';
import GeofenceButton from './GeofenceButton';
import LargeControlButtonGroup from './LargeControlButtonGroup';
import LoadShowFromFileButton from './LoadShowFromFileButton';
import ManualPreflightChecksButton from './ManualPreflightChecksButton';
import OnboardPreflightChecksButton from './OnboardPreflightChecksButton';
import ShowConfiguratorButton from './ShowConfiguratorButton';
import ShowUploadDialogButton from './ShowUploadDialogButton';
import StartTimeButton from './StartTimeButton';
import TakeoffAreaButton from './TakeoffAreaButton';

type Props = {
  environmentType: 'indoor' | 'outdoor';
  isAuthorized: boolean;
};

/**
 * Panel that shows the widgets that are needed to load and configure a drone
 * show.
 */
const ShowControlPanelUpperSegment = ({
  environmentType,
  isAuthorized,
}: Props) => (
  <MultiPagePanel flex={1} selectedPage={isAuthorized ? 'execution' : 'setup'}>
    <Page scrollable id='setup'>
      <List
        dense
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
          '& .MuiDivider-root': {
            display: 'none',
          },
        }}
      >
        <LoadShowFromFileButton />

        <Divider />

        <EnvironmentButton />
        {environmentType === 'outdoor' && <ShowConfiguratorButton />}
        <TakeoffAreaButton />
        {environmentType === 'outdoor' && <GeofenceButton />}
        <ShowUploadDialogButton />

        <Divider />

        <OnboardPreflightChecksButton />
        <ManualPreflightChecksButton />

        <Divider />

        <StartTimeButton />
      </List>
    </Page>
    <Page scrollable id='execution' display='flex' flexDirection='column'>
      <LargeControlButtonGroup />
    </Page>
  </MultiPagePanel>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    environmentType: getShowEnvironmentType(state),
    isAuthorized: isShowAuthorizedToStartLocally(state),
  })
)(ShowControlPanelUpperSegment);
