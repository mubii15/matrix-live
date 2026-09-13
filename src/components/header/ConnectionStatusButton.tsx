import SettingsEthernet from '@mui/icons-material/SettingsEthernet';
import { connect } from 'react-redux';

import GenericHeaderButton, { type GenericHeaderButtonProps } from '~/components/header/GenericHeaderButton';
import { LazyTooltip } from '@skybrush/mui-components';

import ConnectionStatusMiniList from '~/components/ConnectionStatusMiniList';
import ConnectionStatusBadge from '~/components/badges/ConnectionStatusBadge';
import ChannelIndicator from '~/components/header/ChannelIndicator';
import { isConnected } from '~/features/servers/selectors';
import type { RootState } from '~/store/reducers';

type Props = Omit<GenericHeaderButtonProps, 'tooltip'>;

const ConnectionStatusButtonPresentation = (props: Props) => (
  <LazyTooltip
    interactive
    content={<ConnectionStatusMiniList />}
    disabled={props.disabled}
  >
    <GenericHeaderButton {...props}>
      <ConnectionStatusBadge />
      <SettingsEthernet />
      <ChannelIndicator />
    </GenericHeaderButton>
  </LazyTooltip>
);

export default connect(
  // mapStateToProps
  (state: RootState) => ({
    disabled: !isConnected(state),
  }),
  // mapDispatchToProps
  {}
)(ConnectionStatusButtonPresentation);
