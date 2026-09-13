import { createSelector } from '@reduxjs/toolkit';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { connect } from 'react-redux';

import { LazyTooltip, StatusLight } from '@skybrush/mui-components';

import { Status } from '~/components/semantics';
import { selectAllUAVs } from '~/features/selection/slice';
import { showWarning } from '~/features/snackbar/actions';
import {
  getSingleUAVStatusLevel,
  getUAVIdList,
  getUAVIdToStateMapping,
} from '~/features/uavs/selectors';
import type { RootState } from '~/store/reducers';
import { createShallowSelector } from '~/utils/selectors';
import { Workbench } from '~/workbench';

import UAVStatusMiniList from './UAVStatusMiniList';

/* ************************************************************************ */

/**
 * Component-specific selector that summarizes the state of all UAVs in four
 * numbers: operational, initializing, warning and error. Certain UAV status
 * levels such as "rth" and "critical" are consolidated into "warning" and
 * "error", respectively.
 */
const getStatusSummaryInner = createSelector(
  getUAVIdToStateMapping,
  getUAVIdList,
  (byId, order) => {
    const result: [number, number, number, number, number, number] = [
      0, 0, 0, 0, 0, 0,
    ];

    for (const uavId of order) {
      const uav = byId[uavId];
      if (uav) {
        const level = getSingleUAVStatusLevel(uav);
        switch (level) {
          case Status.SUCCESS:
            result[0] += 1;
            break;

          case Status.INFO:
            result[1] += 1;
            break;

          case Status.WARNING:
            result[2] += 1;
            break;

          case Status.MISSING:
            result[3] += 1;
            break;

          case Status.CRITICAL:
          case Status.ERROR:
            result[4] += 1;
            break;

          case Status.OFF:
            /* excluded from counts */
            break;

          default:
            /* unknown status, excluded from counts */
            break;
        }
      }
    }

    result[5] = result[0] + result[1] + result[2] + result[3] + result[4];

    return result;
  }
);

/**
 * Wrapper of `getStatusSummaryInner()` to prevent a re-rendering when the
 * status summary result did not change.
 */
const getStatusSummary = createShallowSelector(
  getStatusSummaryInner,
  (result) => result
);

/* ************************************************************************ */

const SumIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.5'
    strokeLinecap='round'
    strokeLinejoin='round'
    style={{ flexShrink: 0 }}
  >
    <path d='M18 4H6l7 8-7 8h12' />
  </svg>
);

type UAVStatusSummaryProps = {
  counts: number[];
  selectAllUAVs: () => void;
};

const statusOrder: Array<Status | null> = [
  Status.SUCCESS,
  Status.INFO,
  Status.WARNING,
  Status.MISSING,
  Status.ERROR,
  null,
];

const UAVStatusSummary = ({
  counts,
  selectAllUAVs,
}: UAVStatusSummaryProps) => {
  const workbench = useContext(Workbench);

  return (
    <LazyTooltip interactive content={<UAVStatusMiniList />}>
      <div
        className='uav-status-summary-root'
        onClick={() => {
          if (!workbench.bringToFront('uavList')) {
            showWarning('UAVs panel is not added to the workbench yet');
          }
        }}
      >
        <div className='uav-status-summary-inner'>
          {statusOrder.map((statusCode, index) => {
            const content = (
              <React.Fragment>
                {statusCode !== null ? (
                  <StatusLight
                    inline
                    status={counts[index] > 0 ? statusCode : Status.OFF}
                  />
                ) : (
                  <SumIcon />
                )}
                <div
                  className={clsx(
                    'uav-status-summary-counter',
                    counts[index] <= 0 && 'uav-status-summary-off'
                  )}
                >
                  {counts[index]}
                </div>
              </React.Fragment>
            );

            return statusCode === null ? (
              <button
                key='total'
                className='uav-status-summary-btn'
                onClick={(e) => {
                  e.stopPropagation();
                  selectAllUAVs();
                }}
              >
                {content}
              </button>
            ) : (
              <div key={statusCode.toString()} className='uav-status-summary-light'>
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </LazyTooltip>
  );
};

const ConnectedUAVStatusSummary = connect(
  // mapStateToProps
  (state: RootState) => ({
    counts: getStatusSummary(state),
  }),
  // mapDispatchToProps
  (dispatch) => ({
    selectAllUAVs: () => dispatch(selectAllUAVs()),
  })
)(UAVStatusSummary);

export default ConnectedUAVStatusSummary;
