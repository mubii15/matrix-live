import clsx from 'clsx';
import config from 'config';
import PropTypes from 'prop-types';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { WorkbenchView } from 'react-flexible-workbench';
import { connect, Provider as StoreProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';

import CloseIcon from '@mui/icons-material/Close';
import { StyledEngineProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';

import CornerRibbon from './components/CornerRibbon';
import dialogs from './components/dialogs';
import Header from './components/header';
import RightSidebar from './components/RightSidebar';
import ServerConnectionManager from './components/ServerConnectionManager';
import CollectiveRTHDialog from './features/collective-rth/CollectiveRTHDialog';
import DetachedPanelManager from './features/detachable-panels/DetachedPanelManager';
import DockDetailsDialog from './features/docks/DockDetailsDialog';
import FirmwareUpdateSetupDialog from './features/firmware-update/FirmwareUpdateSetupDialog';
import AppHotkeys from './features/hotkeys/AppHotkeys';
import HotkeyDialog from './features/hotkeys/HotkeyDialog';
import PendingUAVIdOverlay from './features/hotkeys/PendingUAVIdOverlay';
import LicenseInfoDialog from './features/license-info/LicenseInfoDialog';
import MapCachingDialog from './features/map-caching/MapCachingDialog';
import CoordinateAveragingDialog from './features/measurement/CoordinateAveragingDialog';
import MissionPlannerDialog from './features/mission/MissionPlannerDialog';
import MissionProgressObserver from './features/mission/MissionProgressObserver';
import ParameterUploadSetupDialog from './features/parameters/ParameterUploadSetupDialog';
import PromptDialog from './features/prompt/PromptDialog';
import RTKCoordinateRestorationDialog from './features/rtk/RTKCoordinateRestorationDialog';
import RTKSetupDialog from './features/rtk/RTKSetupDialog';
import SafetyDialog from './features/safety/SafetyDialog';
import SavedLocationEditorDialog from './features/saved-locations/SavedLocationEditorDialog';
import ShowConfiguratorDialog from './features/show-configurator/ShowConfiguratorDialog';
import Sidebar from './features/sidebar/Sidebar';
import Notifications from './features/snackbar/Notifications';
import UAVDetailsDialog from './features/uavs/UAVDetailsDialog';
import UploadDialog from './features/upload/UploadDialog';
import VersionCheckDialog from './features/version-check/VersionCheckDialog';
import {
  isWorkbenchLayoutFixed,
  shouldSidebarBeShown,
} from './features/workbench/selectors';
import ShowFileWatcher from './views/show-control/ShowFileWatcher';
import ShowControlPanel from './views/show-control/ShowControlPanel';
import LCDClockPanel from './views/lcd-clock/LCDClockPanel';
import LightControlPanel from './views/light-control';
import BottomConsole from './components/BottomConsole';
import BottomUAVsWindow from './components/BottomUAVsWindow';
import { isLightControlPanelOpen } from './features/light-control/selectors';
import { setLightControlPanelOpen } from './features/light-control/slice';

import { ErrorHandler } from './error-handling';
import flock, { Flock } from './flock';
import LanguageWatcher from './i18n/LanguageWatcher';
import perspectives from './perspectives';
import rootSaga from './sagas';
import store, {
  clearStoreAfterConfirmation,
  persistor,
  sagaMiddleware,
  waitUntilStateRestored,
} from './store';
import ThemeProvider, { DarkModeExtraCSSProvider } from './theme';
import registerUploadJobTypes from './upload-jobs';
import { hasTimeLimitedSession } from './utils/configuration';
import workbench from './workbench';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light-border.css';

require('../assets/css/proggy-vector.css');
require('../assets/css/kbd.css');
require('../assets/css/screen.less');
require('../assets/css/tooltips.less');

const rootStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
};

const rootInnerStyle = {
  display: 'flex',
  alignItems: 'stretch',
  flexGrow: 1,
  contain: 'size',
};

/**
 * Helper function that restores the state of the workbench when it was loaded
 * back from the local storage during startup.
 */
const restoreWorkbench = (whenDone) => async () => {
  const state = store.getState();

  if (state && state.workbench && state.workbench.state) {
    workbench.restoreState(state.workbench.state);
  }

  if (whenDone) {
    whenDone();
  }
};

// Spin up the root saga after the state has been restored.
waitUntilStateRestored().then(() => {
  const disposer = registerUploadJobTypes();
  const sagaTask = sagaMiddleware.run(rootSaga);
  if (module.hot) {
    module.hot.dispose(() => {
      disposer();
      sagaTask.cancel();
    });
  }
});

const WorkbenchContainerPresentation = ({ isFixed, showSidebar }) => (
  <div className={clsx(isFixed && 'workbench-fixed')} style={rootInnerStyle}>
    {/* Temporarily hidden: {showSidebar ? <Sidebar workbench={workbench} /> : null} */}
    <WorkbenchView workbench={workbench} />
  </div>
);

WorkbenchContainerPresentation.propTypes = {
  isFixed: PropTypes.bool,
  showSidebar: PropTypes.bool,
};

const WorkbenchContainer = connect(
  // mapStateToProps
  (state) => ({
    isFixed: isWorkbenchLayoutFixed(state),
    showSidebar: shouldSidebarBeShown(state),
  }),
  // mapDispatchToProps
  null
)(WorkbenchContainerPresentation);



const FloatingLightControlPresentation = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 80,
      right: 392,
      zIndex: 1100,
      width: 340,
      pointerEvents: 'auto',
      backgroundColor: '#1a1b1e',
      borderRadius: '16px',
      padding: '12px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>Light Control</span>
        <IconButton
          onClick={onClose}
          size='small'
          sx={{
            color: 'rgba(255, 255, 255, 0.5)',
            p: 0,
            '&:hover': {
              color: '#fff',
            },
          }}
        >
          <CloseIcon fontSize='small' />
        </IconButton>
      </div>
      <LightControlPanel />
    </div>
  );
};

const ConnectedFloatingLightControl = connect(
  (state) => ({
    isOpen: isLightControlPanelOpen(state),
  }),
  {
    onClose: () => setLightControlPanelOpen(false),
  }
)(FloatingLightControlPresentation);

const App = ({ onFirstRender }) => (
  <PersistGate
    persistor={persistor}
    onBeforeLift={restoreWorkbench(onFirstRender)}
  >
    <ThemeProvider>
      <>
          <CssBaseline />
          <DarkModeExtraCSSProvider />
          <AppHotkeys />
          <div style={rootStyle}>
            <Header perspectives={perspectives} workbench={workbench} />
            <div style={{
              position: 'absolute',
              top: 80,
              right: 16,
              bottom: 16,
              zIndex: 100,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'stretch',
              pointerEvents: 'none',
            }}>
              <RightSidebar />
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                width: 360,
                pointerEvents: 'none',
              }}>
                <div style={{
                  backgroundColor: '#1a1b1e',
                  borderRadius: '16px',
                  padding: '8px 12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  pointerEvents: 'auto',
                }}>
                  <LCDClockPanel />
                </div>
                <div style={{
                  backgroundColor: '#1a1b1e',
                  borderRadius: 16,
                  padding: '8px 12px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                  pointerEvents: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  flex: 1,
                  overflow: 'hidden',
                }}>
                  <ShowControlPanel />
                </div>
              </div>
            </div>
        <ConnectedFloatingLightControl />
        <BottomConsole />
        <BottomUAVsWindow />
        <WorkbenchContainer />
        {config?.ribbon?.label && <CornerRibbon {...config.ribbon} />}
        <PendingUAVIdOverlay />
      </div>

      <DetachedPanelManager />

      <ServerConnectionManager />

      <LanguageWatcher />
      <MissionProgressObserver />
      <ShowFileWatcher />

      <dialogs.AppSettingsDialog />
      <dialogs.AuthenticationDialog />
      <dialogs.DeauthenticationDialog />
      <dialogs.FeatureEditorDialog />
      <dialogs.FlyToTargetDialog />
      <dialogs.GlobalErrorDialog />
      <dialogs.LayerSettingsDialog />
      <dialogs.ServerSettingsDialog />
      {hasTimeLimitedSession && <dialogs.SessionExpiryDialog />}
      <dialogs.TimeSyncDialog />

      <CollectiveRTHDialog />
      <CoordinateAveragingDialog />
      <DockDetailsDialog />
      <FirmwareUpdateSetupDialog />
      <HotkeyDialog />
      <LicenseInfoDialog />
      <MapCachingDialog />
      <MissionPlannerDialog />
      <ParameterUploadSetupDialog />
      <PromptDialog />
      <RTKCoordinateRestorationDialog />
      <RTKSetupDialog />
      <SafetyDialog />
      <SavedLocationEditorDialog />
      <ShowConfiguratorDialog />
      <UAVDetailsDialog />
      <UploadDialog />
      <VersionCheckDialog />

      <Notifications />
    </>
    </ThemeProvider>
  </PersistGate>
);

App.propTypes = {
  onFirstRender: PropTypes.func,
};

/**
 * Placeholder component to render when a panel is being dragged from the
 * sidebar to the workbench.
 */
const DragProxy = () => <div className='drag-proxy' />;

/**
 * The context provider for the main application component and the
 * individual application panels.
 *
 * react-flexible-workbench likes class components at the top so that's why
 * we are returning a class.
 */
const enhancer = (Component) =>
  class extends React.Component {
    static displayName = 'WorkbenchRoot';
    static propTypes = {
      glDragging: PropTypes.bool,
    };

    render() {
      if (this.props.glDragging) {
        return (
          <ErrorBoundary
            FallbackComponent={ErrorHandler}
            onReset={clearStoreAfterConfirmation}
          >
            <DragProxy />
          </ErrorBoundary>
        );
      }

      return (
        <ErrorBoundary
          FallbackComponent={ErrorHandler}
          onReset={clearStoreAfterConfirmation}
        >
          <StoreProvider store={store}>
            <StyledEngineProvider
              injectFirst
              // We need to revert to the legacy style injection method to
              // stay compatible with our `ExternalWindow` implementation.
              speedy={false}
            >
              <ThemeProvider>
                <Flock.Provider value={flock}>
                  <Component {...this.props} />
                </Flock.Provider>
              </ThemeProvider>
            </StyledEngineProvider>
          </StoreProvider>
        </ErrorBoundary>
      );
    }
  };

workbench.hoc = enhancer;
export default enhancer(App);
