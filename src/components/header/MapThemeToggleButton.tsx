import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { connect } from 'react-redux';

import GenericHeaderButton from '~/components/header/GenericHeaderButton';
import { selectMapSource } from '~/features/map/layers';
import { Source } from '~/model/sources';
import { getLicensedLayerById } from '~/selectors/layers';
import type { RootState } from '~/store/reducers';

type MapThemeToggleButtonProps = {
  isDarkMode: boolean;
  onToggleMapTheme: () => void;
};

const MapThemeToggleButton = ({
  isDarkMode,
  onToggleMapTheme,
}: MapThemeToggleButtonProps) => (
  <GenericHeaderButton
    tooltip={isDarkMode ? 'Switch map to Light Mode' : 'Switch map to Dark Mode'}
    onClick={onToggleMapTheme}
  >
    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
  </GenericHeaderButton>
);

const baseLayerSelector = getLicensedLayerById('base');

export default connect(
  (state: RootState) => {
    const baseLayer = baseLayerSelector(state);
    const source = baseLayer?.parameters?.['source'] as string | undefined;
    const isDarkMode =
      source === undefined ||
      source === Source.CARTODB.DARK ||
      source === Source.STADIA.ALIDADE_SMOOTH_DARK;

    return { isDarkMode };
  },
  { selectMapSource },
  (stateProps, dispatchProps) => ({
    isDarkMode: stateProps.isDarkMode,
    onToggleMapTheme() {
      const newSource = stateProps.isDarkMode
        ? Source.CARTODB.LIGHT
        : Source.CARTODB.DARK;

      dispatchProps.selectMapSource({ layerId: 'base', source: newSource });
    },
  })
)(MapThemeToggleButton);
