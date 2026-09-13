import ConnectionIcon from '@mui/icons-material/Power';
import { connect } from 'react-redux';

import GenericHeaderButton, { type GenericHeaderButtonProps } from '~/components/header/GenericHeaderButton';
import { LazyTooltip } from '@skybrush/mui-components';

import ServerConnectionStatusMiniList from '~/components/ServerConnectionStatusMiniList';
import ServerConnectionStatusBadge from '~/components/badges/ServerConnectionStatusBadge';
import { showServerSettingsDialog } from '~/features/servers/actions';

type Props = {
  hideTooltip?: boolean;
} & Omit<GenericHeaderButtonProps, 'tooltip'>;

const ServerConnectionSettingsButton = ({ hideTooltip, ...rest }: Props) => {
  const body = (
    <GenericHeaderButton {...rest}>
      <ServerConnectionStatusBadge />
      <ConnectionIcon />
    </GenericHeaderButton>
  );

  return hideTooltip ? (
    body
  ) : (
    <LazyTooltip content={<ServerConnectionStatusMiniList />}>
      {body}
    </LazyTooltip>
  );
};

export default connect(
  // mapStateToProps
  null,
  // mapDispatchToProps
  {
    onClick: showServerSettingsDialog,
  }
)(ServerConnectionSettingsButton);
