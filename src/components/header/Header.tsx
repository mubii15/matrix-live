import type React from 'react';
import { useState } from 'react';
import config from 'config';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { connect } from 'react-redux';
import Shapeshifter from 'react-shapeshifter';

import UAVStatusSummary from '~/components/uavs/UAVStatusSummary';
import PerspectiveBar from '~/features/perspectives/PerspectiveBar';
import RTKStatusHeaderButton from '~/features/rtk/RTKStatusHeaderButton';
import SelectionGroupsHeaderButton from '~/features/selection/SelectionGroupsHeaderButton';
import { BROADCAST_MODE_TIMEOUT_LENGTH } from '~/features/settings/constants';
import { toggleSidebar } from '~/features/sidebar/actions';
import { isSidebarOpen } from '~/features/sidebar/selectors';
import AltitudeSummaryHeaderButton from '~/features/uavs/AltitudeSummaryHeaderButton';
import BatteryStatusHeaderButton from '~/features/uavs/BatteryStatusHeaderButton';
import DistanceSummaryHeaderButton from '~/features/uavs/DistanceSummaryHeaderButton';
import VelocitySummaryHeaderButton from '~/features/uavs/VelocitySummaryHeaderButton';
import WeatherHeaderButton from '~/features/weather/WeatherHeaderButton';
import { shouldSidebarBeShown } from '~/features/workbench/selectors';
import type { RootState } from '~/store/reducers';
import { hasFeature } from '~/utils/configuration';

import AlertButton from './AlertButton';
import AppSettingsButton from './AppSettingsButton';
import AuthenticationButton from './AuthenticationButton';
import BroadcastButton from './BroadcastButton';
import ConnectionStatusButton from './ConnectionStatusButton';
import FullScreenButton from './FullScreenButton';
import HelpButton from './HelpButton';
import SafetyButton from './SafetyButton';
import ServerConnectionSettingsButton from './ServerConnectionSettingsButton';
import SessionExpiryBox from './SessionExpiryBox';
import ToolboxButton from './ToolboxButton';
import MapThemeToggleButton from './MapThemeToggleButton';
import LightControlButton from './LightControlButton';
import Toggle3DViewButton from './Toggle3DViewButton';

const componentRegistry: Record<string, React.ComponentType> = {
  'alert-button': AlertButton,
  'altitude-summary-header-button': AltitudeSummaryHeaderButton,
  'app-settings-button': AppSettingsButton,
  'authentication-button': AuthenticationButton,
  'battery-status-header-button': BatteryStatusHeaderButton,
  'broadcast-button': () => (
    <BroadcastButton timeoutLength={BROADCAST_MODE_TIMEOUT_LENGTH} />
  ),
  'connection-status-button': ConnectionStatusButton,
  'distance-summary-header-button': DistanceSummaryHeaderButton,
  'full-screen-button': FullScreenButton,
  'groups-button': SelectionGroupsHeaderButton,
  'help-button': () => (config.urls.help ? <HelpButton /> : null),
  'rtk-status-header-button': () =>
    hasFeature('toolboxMenu') && <RTKStatusHeaderButton />,
  'safety-button': SafetyButton,
  'server-connection-settings-button': () => (
    <ServerConnectionSettingsButton
      hideTooltip={Boolean(config.optimizeUIForTouch.default)}
    />
  ),
  'session-expiry-box': SessionExpiryBox,
  'light-control-button': LightControlButton,
  'toolbox-button': () => hasFeature('toolboxMenu') && <ToolboxButton />,
  'uav-status-summary': UAVStatusSummary,
  'velocity-summary-header-button': VelocitySummaryHeaderButton,
  'weather-header-button': WeatherHeaderButton,
  'map-theme-toggle-button': MapThemeToggleButton,
  'toggle-3d-view-button': Toggle3DViewButton,
};

type Props = {
  isSidebarOpen: boolean;
  showSidebar?: boolean;
  toggleSidebar: () => void;
};

/**
 * Presentation component for the header at the top edge of the main
 * window.
 */
const Header = ({ isSidebarOpen, showSidebar, toggleSidebar }: Props) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <div
        className='header-top-bar-backdrop'
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '72px',
          zIndex: 1000,
          pointerEvents: 'none',
          background:
            'linear-gradient(180deg, rgba(16, 18, 24, 0.82) 0%, rgba(16, 18, 24, 0.45) 65%, rgba(16, 18, 24, 0) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 60%, rgba(0, 0, 0, 0) 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 60%, rgba(0, 0, 0, 0) 100%)',
        }}
      />
      <div
        id='header'
        style={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1100,
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <div className='header-pill-container'>
          {showSidebar && (
            <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
              <Shapeshifter
                color='#999'
                style={{ cursor: 'pointer' }}
                shape={isSidebarOpen ? 'close' : 'menu'}
                onClick={toggleSidebar}
              />
            </div>
          )}
          <PerspectiveBar />
          {config.headerComponents.length > 0 &&
            config.headerComponents[0].map((component) => {
              const Component = componentRegistry[component];
              return <Component key={component} />;
            })}
        </div>

        {isExpanded &&
          config.headerComponents.slice(1).map((group, idx) => (
            <div key={`pill-${idx}`} className='header-pill-container'>
              {group.map((component) => {
                const Component = componentRegistry[component];
                return <Component key={component} />;
              })}
            </div>
          ))}

        <div
          className='header-pill-expander'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span style={{ color: '#1a1b1e', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isExpanded ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </span>
        </div>
      </div>
    </>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    sessionExpiresAt: state.session.expiresAt,
    isSidebarOpen: isSidebarOpen(state),
    showSidebar: shouldSidebarBeShown(state),
  }),
  // mapDispatchToProps
  { toggleSidebar }
)(Header);
