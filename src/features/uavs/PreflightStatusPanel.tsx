import Error from '@mui/icons-material/Error';
import Refresh from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React, { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useAsyncRetry, useUnmount } from 'react-use';

import {
  BackgroundHint,
  LargeProgressIndicator,
  StatusLight,
} from '@skybrush/mui-components';

import { errorCodeToSemantics } from '~/flockwave/errors';
import UAVErrorCode, { describeUAVErrorCode } from '~/flockwave/UAVErrorCode';
import useMessageHub from '~/hooks/useMessageHub';
import {
  describeOverallPreflightCheckResult,
  describePreflightCheckResult,
  getSemanticsForPreflightCheckResult,
  PreflightCheckResult,
} from '~/model/enums';
import { type RootState } from '~/store/reducers';

import { getUAVById } from './selectors';

type PreflightCheckItem = {
  id: string;
  label: string;
  message?: string;
  result: PreflightCheckResult;
};

type ErrorListProps = {
  errorCodes?: UAVErrorCode[] | null;
};

const ErrorList = ({ errorCodes }: ErrorListProps) => {
  const { t } = useTranslation();
  const relevantErrorCodes = (errorCodes || []).filter(
    (code) =>
      code !== UAVErrorCode.PREARM_CHECK_IN_PROGRESS &&
      code !== UAVErrorCode.PREARM_CHECK_FAILURE
  );
  if (relevantErrorCodes.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1.5 }}>
      {relevantErrorCodes.map((code) => (
        <Box
          key={code}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: '10px 14px',
            borderRadius: '10px',
            backgroundColor: 'rgba(244, 67, 54, 0.08)',
            border: '1px solid rgba(244, 67, 54, 0.25)',
          }}
        >
          <StatusLight status={errorCodeToSemantics(code)} />
          <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#fff' }}>
            {describeUAVErrorCode(code, t)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

type PreflightStatusResultsProps = {
  items?: PreflightCheckItem[];
  message?: string;
  result?: PreflightCheckResult;
};

const PreflightStatusResults = ({
  items,
  message,
  result,
}: PreflightStatusResultsProps) => {
  const { t } = useTranslation();
  const effectiveResult = result ?? PreflightCheckResult.UNKNOWN;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
      {/* Primary summary card */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: '14px 16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.25)',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        }}
      >
        <StatusLight
          status={getSemanticsForPreflightCheckResult(effectiveResult)}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.1px',
            }}
          >
            {describeOverallPreflightCheckResult(effectiveResult, t)}
          </Typography>
          {message && (
            <Typography
              sx={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 0.2,
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Details checklist if available */}
      {items && items.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            sx={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.4)',
              px: 0.5,
              mb: 0.8,
            }}
          >
            Details
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.4,
                  p: '10px 14px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <StatusLight
                  status={getSemanticsForPreflightCheckResult(
                    item.result ?? PreflightCheckResult.UNKNOWN
                  )}
                />
                <Typography
                  sx={{
                    fontSize: '12.5px',
                    fontWeight: 500,
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  {message ||
                    (item.result === PreflightCheckResult.PASS
                      ? item.label
                      : `${item.label} — ${describePreflightCheckResult(
                          item.result,
                          t
                        )}`)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

type PreflightStatusPanelLowerSegmentProps = {
  uavId?: string;
};

const PreflightStatusPanelLowerSegment = memo(
  ({ uavId }: PreflightStatusPanelLowerSegmentProps) => {
    const messageHub = useMessageHub();
    const state = useAsyncRetry<any>(
      async () => (uavId ? messageHub.query.getPreflightStatus(uavId) : null),
      [messageHub, uavId]
    );
    const scheduledRefresh = useRef<ReturnType<typeof setTimeout>>();

    // Refresh the status every second
    useEffect(() => {
      const isResultReady =
        uavId && !state.loading && !state.error && Boolean(state.value);
      if (isResultReady && !scheduledRefresh.current) {
        scheduledRefresh.current = setTimeout(() => {
          scheduledRefresh.current = undefined;
          state.retry();
        }, 1000);
      }
    }, [state, uavId]);

    // Cancel scheduled refreshes when unmounting
    useUnmount(() => {
      if (scheduledRefresh.current) {
        clearTimeout(scheduledRefresh.current);
      }
    });

    if (state.error && !state.loading) {
      return (
        <BackgroundHint
          icon={<Error sx={{ fontSize: 36, color: '#f44336' }} />}
          text='Error while loading preflight status report'
          button={
            <Button
              startIcon={<Refresh />}
              onClick={state.retry}
              sx={{
                mt: 1,
                color: '#d8f576',
                borderColor: 'rgba(216, 245, 118, 0.4)',
                '&:hover': {
                  borderColor: '#d8f576',
                  backgroundColor: 'rgba(216, 245, 118, 0.1)',
                },
              }}
              variant='outlined'
            >
              Try again
            </Button>
          }
        />
      );
    }

    if (state.value) {
      return (
        <PreflightStatusResults
          items={state.value.items}
          message={state.value.message}
          result={state.value.result}
        />
      );
    }

    if (state.loading) {
      return (
        <LargeProgressIndicator
          fullHeight
          label='Retrieving status report...'
        />
      );
    }

    return (
      <BackgroundHint
        text='Preflight status report not loaded yet'
        button={
          <Button
            startIcon={<Refresh />}
            onClick={state.retry}
            sx={{
              mt: 1,
              color: '#d8f576',
              borderColor: 'rgba(216, 245, 118, 0.4)',
              '&:hover': {
                borderColor: '#d8f576',
                backgroundColor: 'rgba(216, 245, 118, 0.1)',
              },
            }}
            variant='outlined'
          >
            Try again
          </Button>
        }
      />
    );
  }
);

PreflightStatusPanelLowerSegment.displayName =
  'PreflightStatusPanelLowerSegment';

type PreflightStatusPanelProps = {
  errorCodes?: UAVErrorCode[] | null;
  uavId?: string;
};

const PreflightStatusPanel = ({
  errorCodes,
  uavId,
}: PreflightStatusPanelProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <ErrorList errorCodes={errorCodes} />
    <PreflightStatusPanelLowerSegment uavId={uavId} />
  </Box>
);

const ConnectedPreflightStatusPanel = connect(
  // mapStateToProps
  (state: RootState, ownProps: { uavId?: string }) => ({
    errorCodes: ownProps.uavId
      ? (getUAVById(state, ownProps.uavId)?.errors ?? null)
      : null,
  })
)(PreflightStatusPanel);

export default ConnectedPreflightStatusPanel;
