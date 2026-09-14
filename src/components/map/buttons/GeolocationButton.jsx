import MyLocationIcon from '@mui/icons-material/MyLocation';
import IconButton from '@mui/material/IconButton';
import { easeOut } from 'ol/easing';
import PropTypes from 'prop-types';
import React from 'react';
import { Translation } from 'react-i18next';
import { connect } from 'react-redux';

import { TooltipWithContainerFromContext as Tooltip } from '~/containerContext';
import { showError } from '~/features/snackbar/actions';
import { mapReferenceRequestSignal } from '~/signals';
import { mapViewCoordinateFromLonLat } from '~/utils/geography';

class GeolocationButtonPresentation extends React.Component {
  static propTypes = {
    duration: PropTypes.number,
    dispatchShowError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    duration: 500,
  };

  componentDidMount() {
    mapReferenceRequestSignal.dispatch(this._onMapReferenceReceived);
  }

  _onMapReferenceReceived = (map) => {
    this.map = map;
  };

  _handleClick = () => {
    if (!this.map) {
      return;
    }

    if ('geolocation' in window.navigator) {
      window.navigator.geolocation.getCurrentPosition(
        this._onGeolocationReceived,
        this._onGeolocationError,
        { timeout: 4000 }
      );
    } else {
      this._fallbackToIPGeolocation();
    }
  };

  _fallbackToIPGeolocation = async () => {
    try {
      let coords;
      try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (response.ok) {
          const data = await response.json();
          if (data && data.latitude && data.longitude) {
            coords = {
              latitude: parseFloat(data.latitude),
              longitude: parseFloat(data.longitude),
            };
          }
        }
      } catch {
        // Try next fallback
      }

      if (!coords) {
        const response = await fetch('https://ipwho.is/');
        if (response.ok) {
          const data = await response.json();
          if (
            data &&
            data.success !== false &&
            data.latitude &&
            data.longitude
          ) {
            coords = {
              latitude: parseFloat(data.latitude),
              longitude: parseFloat(data.longitude),
            };
          }
        }
      }

      if (coords) {
        this._onGeolocationReceived({ coords });
      } else {
        this.props.dispatchShowError(
          'Location is not available on this device.'
        );
      }
    } catch {
      this.props.dispatchShowError('Location is not available on this device.');
    }
  };

  _onGeolocationReceived = (position) => {
    if (!this.map) {
      return;
    }

    const view = this.map.getView();
    const center = mapViewCoordinateFromLonLat([
      position.coords.longitude,
      position.coords.latitude,
    ]);
    view.animate({
      center,
      duration: this.props.duration,
      easing: easeOut,
    });
  };

  _onGeolocationError = () => {
    // Attempt IP-based location silently when system geolocation is denied or unavailable in Electron
    this._fallbackToIPGeolocation();
  };

  render() {
    return (
      <Translation>
        {(t) => (
          <Tooltip content={t('mapControls.myLocation', 'Go to my location')}>
            <IconButton onClick={this._handleClick} size="large">
              <MyLocationIcon />
            </IconButton>
          </Tooltip>
        )}
      </Translation>
    );
  }
}

const GeolocationButton = connect(null, {
  dispatchShowError: showError,
})(GeolocationButtonPresentation);

export default GeolocationButton;
