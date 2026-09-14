import React from 'react';
import { connect } from 'react-redux';

import MessagesPanel from '~/components/chat/MessagesPanel';
import { type RootState } from '~/store/reducers';

import {
  getSelectedTabInUAVDetailsDialog,
  getSelectedUAVIdInUAVDetailsDialog,
} from './details';
import PreflightStatusPanel from './PreflightStatusPanel';
import { UAVDetailsDialogTab } from './types';
import UAVLogsPanel from './UAVLogsPanel';
import UAVTestsPanel from './UAVTestsPanel';

type UAVDetailsDialogBodyProps = {
  selectedTab?: string;
  uavId?: string;
};

const UAVDetailsDialogBody = ({
  selectedTab,
  uavId,
}: UAVDetailsDialogBodyProps) => {
  switch (selectedTab) {
    case UAVDetailsDialogTab.MESSAGES:
      return <MessagesPanel uavId={uavId} />;

    case UAVDetailsDialogTab.PREFLIGHT:
      return <PreflightStatusPanel uavId={uavId} />;

    case UAVDetailsDialogTab.TESTS:
      return <UAVTestsPanel uavId={uavId} />;

    case UAVDetailsDialogTab.LOGS:
      return <UAVLogsPanel uavId={uavId} />;

    default:
      return null;
  }
};

const ConnectedUAVDetailsDialogBody = connect((state: RootState) => ({
  selectedTab: getSelectedTabInUAVDetailsDialog(state),
  uavId: getSelectedUAVIdInUAVDetailsDialog(state),
}))(UAVDetailsDialogBody);

export default ConnectedUAVDetailsDialogBody;
