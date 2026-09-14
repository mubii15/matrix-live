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
import { showNotification } from '~/features/snackbar/actions';

import { isMapCachingEnabled } from './selectors';
import { setMapCachingEnabled } from './slice';

const MapCachingPanel = ({
  onClose,
  isMapCachingEnabled,
  setMapCachingEnabled,
  dispatchClearCacheSuccess,
  t,
}) => {
  const handleClearCache = async () => {
    try {
      await caches.delete('matrix-live-map-tiles');
      dispatchClearCacheSuccess('Offline map cache cleared successfully.');
    } catch (err) {
      console.error('Failed to clear map cache:', err);
    }
  };

  return (
    <>
      <DialogHeaderListItem>
        {ICON_PRESETS.success}
        <ListItemText
          primary="Client-side offline map caching is ready"
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
  isMapCachingEnabled: PropTypes.bool,
  setMapCachingEnabled: PropTypes.func,
  dispatchClearCacheSuccess: PropTypes.func,
  onClose: PropTypes.func,
  t: PropTypes.func,
};

export default connect(
  // mapStateToProps
  (state) => ({
    isMapCachingEnabled: isMapCachingEnabled(state),
  }),
  // mapDispatchToProps
  {
    setMapCachingEnabled,
    dispatchClearCacheSuccess: showNotification,
  }
)(withTranslation()(MapCachingPanel));
