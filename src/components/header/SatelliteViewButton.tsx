import SatelliteAlt from '@mui/icons-material/SatelliteAlt';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GenericHeaderButton from '~/components/header/GenericHeaderButton';
import { selectMapSource } from '~/features/map/layers';
import {
  getPreferredSatelliteSource,
  isSatelliteSource,
  Source,
} from '~/model/sources';
import { getLicensedLayerById } from '~/selectors/layers';
import type { RootState } from '~/store/reducers';

type Props = {
  isSatellite: boolean;
  onToggleSatellite: () => void;
};

const SatelliteViewButton = ({ isSatellite, onToggleSatellite }: Props) => {
  const { t } = useTranslation();

  return (
    <GenericHeaderButton
      tooltip={
        isSatellite
          ? t('mapControls.switchToMap', 'Switch to street map')
          : t('mapControls.switchToSatellite', 'Switch to satellite view')
      }
      onClick={onToggleSatellite}
      style={{
        color: isSatellite ? '#d8f576' : undefined,
        backgroundColor: isSatellite ? 'rgba(216, 245, 118, 0.15)' : undefined,
      }}
    >
      <SatelliteAlt />
    </GenericHeaderButton>
  );
};

const baseLayerSelector = getLicensedLayerById('base');

const ConnectedSatelliteViewButton = connect(
  (state: RootState) => {
    const baseLayer = baseLayerSelector(state);
    const source = baseLayer?.parameters?.['source'] as string | undefined;
    const isSatellite = isSatelliteSource(source);

    return { isSatellite };
  },
  { selectMapSource },
  (stateProps, dispatchProps) => ({
    isSatellite: stateProps.isSatellite,
    onToggleSatellite() {
      const newSource = stateProps.isSatellite
        ? Source.CARTODB.DARK
        : getPreferredSatelliteSource();

      dispatchProps.selectMapSource({ layerId: 'base', source: newSource });
    },
  })
)(SatelliteViewButton);

export default ConnectedSatelliteViewButton;
