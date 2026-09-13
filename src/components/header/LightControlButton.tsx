import WbSunny from '@mui/icons-material/WbSunny';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GenericHeaderButton from '~/components/header/GenericHeaderButton';

import { setLightControlPanelOpen } from '~/features/light-control/slice';
import { isLightControlPanelOpen } from '~/features/light-control/selectors';
import type { RootState } from '~/store/reducers';

type Props = {
  panelOpen: boolean;
  setLightControlPanelOpen: (open: boolean) => void;
};

const LightControlButton = ({
  panelOpen,
  setLightControlPanelOpen,
}: Props) => {
  const { t } = useTranslation();

  const handleToggle = () => {
    setLightControlPanelOpen(!panelOpen);
  };

  return (
    <GenericHeaderButton
      tooltip={t('view.light-control')}
      onClick={handleToggle}
      style={{
        color: panelOpen ? '#d8f576' : undefined,
        backgroundColor: panelOpen ? 'rgba(216, 245, 118, 0.15)' : undefined,
      }}
    >
      <WbSunny />
    </GenericHeaderButton>
  );
};

const ConnectedLightControlButton = connect(
  (state: RootState) => ({
    panelOpen: isLightControlPanelOpen(state),
  }),
  {
    setLightControlPanelOpen,
  }
)(LightControlButton);

export default ConnectedLightControlButton;
