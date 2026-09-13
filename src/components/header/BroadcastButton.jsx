import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import GenericHeaderButton from '~/components/header/GenericHeaderButton';
import SidebarBadge from '~/components/header/SidebarBadge';

import Colors from '~/components/colors';
import { isBroadcast } from '~/features/session/selectors';
import { setBroadcast } from '~/features/session/slice';
import Campaign from '~/icons/Campaign';

const isValidTimeoutLength = (value) => typeof value === 'number' && value > 0;

const BroadcastButton = ({ isBroadcast, setBroadcast, t, timeoutLength }) => {
  const timeout = useRef(undefined);

  useEffect(() => {
    if (isBroadcast && isValidTimeoutLength(timeoutLength)) {
      timeout.current = setTimeout(() => {
        setBroadcast(false);
      }, timeoutLength * 1000);
    } else if (!isBroadcast && timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }
  }, [isBroadcast, setBroadcast, timeoutLength]);

  const duration =
    isValidTimeoutLength(timeoutLength) && Number.isFinite(timeoutLength)
      ? `${timeoutLength}s`
      : '100000s';

  return (
    <GenericHeaderButton
      tooltip={
        isBroadcast
          ? t('broadcastButton.disable')
          : t('broadcastButton.enable', { time: timeoutLength })
      }
      onClick={() => setBroadcast(!isBroadcast)}
      style={{ overflow: 'hidden' }}
    >
      {isBroadcast && (
        <div
          className='broadcast-cooldown-underlay'
          style={{ animationDuration: duration }}
        />
      )}
      <SidebarBadge color={Colors.warning} visible={isBroadcast} />
      <div style={{ position: 'relative' }}>
        <Campaign />
      </div>
    </GenericHeaderButton>
  );
};

BroadcastButton.propTypes = {
  isBroadcast: PropTypes.bool,
  setBroadcast: PropTypes.func,
  t: PropTypes.func,
  timeoutLength: PropTypes.number,
};

export default connect(
  // mapStateToProps
  (state) => ({
    isBroadcast: isBroadcast(state),
  }),
  // mapDispatchToProps
  {
    setBroadcast,
  }
)(withTranslation()(BroadcastButton));
