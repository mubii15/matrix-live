import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GenericHeaderButton from './GenericHeaderButton';
import SidebarBadge from './SidebarBadge';

import Colors from '~/components/colors';
import { getActiveUAVIdsBeingAveraged } from '~/features/measurement/selectors';
import type { RootState } from '~/store/reducers';

import ToolboxMenu from './ToolboxMenu';

type Props = {
  numberOfAveragingInProgress: number;
};

const ToolboxButtonPresentation = ({ numberOfAveragingInProgress }: Props) => {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();

  const handleClick = (event: React.SyntheticEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const needsBadge = numberOfAveragingInProgress > 0;

  return (
    <>
      <GenericHeaderButton
        aria-controls='toolbox-menu'
        aria-haspopup='true'
        tooltip={t('toolbox.tooltip')}
        onClick={handleClick}
      >
        <SidebarBadge color={Colors.warning} visible={needsBadge} />
        <SettingsIcon />
      </GenericHeaderButton>
      <ToolboxMenu
        id='toolbox-menu'
        anchorEl={anchorElement}
        open={Boolean(anchorElement)}
        requestClose={handleClose}
        onClose={handleClose}
      />
    </>
  );
};

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    numberOfAveragingInProgress: getActiveUAVIdsBeingAveraged(state).length,
  }),
  // mapDispatchToProps
  null
)(ToolboxButtonPresentation);
