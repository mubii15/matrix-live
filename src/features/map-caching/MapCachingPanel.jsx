import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import DialogHeaderListItem, {
  ICON_PRESETS,
} from '~/components/DialogHeaderListItem';
import {
  getServerHttpUrl,
  isConnected,
  supportsMapCaching,
} from '~/features/servers/selectors';
import { showNotification } from '~/features/snackbar/actions';

import { isMapCachingEnabled } from './selectors';
import { setMapCachingEnabled } from './slice';

const MapCachingPanel = ({
  onClose,
  isConnected,
  isMapCachingEnabled,
  isMapCachingSupported,
  serverHttpUrl,
  setMapCachingEnabled,
  dispatchClearCacheSuccess,
  t,
}) => {
  const handleClearCache = async () => {
    try {
      if (isMapCachingSupported && serverHttpUrl) {
        fetch(`${serverHttpUrl}/map-cache`, { method: 'DELETE' }).catch(() => {});
      }
      if (typeof caches !== 'undefined') {
        await caches.delete('matrix-live-map-tiles');
      }
      dispatchClearCacheSuccess(
        t('mapCachingPanel.cacheCleared', 'Offline map cache cleared successfully.')
      );
    } catch (err) {
      console.error('Failed to clear map cache:', err);
    }
  };

  return (
    <>
      <DialogHeaderListItem>
        {isMapCachingSupported
          ? ICON_PRESETS.success
          : isConnected
          ? ICON_PRESETS.warning
          : ICON_PRESETS.info}
        <ListItemText
          primary={
            isMapCachingSupported
              ? t('mapCachingPanel.serverSupport')
              : isConnected
              ? t('mapCachingPanel.serverNotSupport')
              : t('mapCachingPanel.connectToServer')
          }
          secondary={
            isMapCachingSupported
              ? undefined
              : 'Local client-side tile cache is active as fallback'
          }
        />
      </DialogHeaderListItem>
      <ListItemButton
        disableRipple
        onClick={() => setMapCachingEnabled(!isMapCachingEnabled)}
      >
        <ListItemIcon style={{ margin: '0 17px 0 2px' }}>
          <Switch checked={isMapCachingEnabled} />
        </ListItemIcon>
        <ListItemText primary={t('mapCachingPanel.useCachedMapTiles')} />
      </ListItemButton>
      <DialogActions>
        <Button onClick={handleClearCache}>
          {t('mapCachingPanel.clearChache')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={onClose}>{t('general.action.close')}</Button>
      </DialogActions>
    </>
  );
};

MapCachingPanel.propTypes = {
  isConnected: PropTypes.bool,
  isMapCachingEnabled: PropTypes.bool,
  isMapCachingSupported: PropTypes.bool,
  serverHttpUrl: PropTypes.string,
  setMapCachingEnabled: PropTypes.func,
  dispatchClearCacheSuccess: PropTypes.func,
  onClose: PropTypes.func,
  t: PropTypes.func,
};

export default connect(
  // mapStateToProps
  (state) => ({
    isConnected: isConnected(state),
    isMapCachingEnabled: isMapCachingEnabled(state),
    isMapCachingSupported: supportsMapCaching(state),
    serverHttpUrl: getServerHttpUrl(state),
  }),
  // mapDispatchToProps
  {
    setMapCachingEnabled,
    dispatchClearCacheSuccess: showNotification,
  }
)(withTranslation()(MapCachingPanel));

