import Error from '@mui/icons-material/Error';
import GetApp from '@mui/icons-material/GetApp';
import Refresh from '@mui/icons-material/Refresh';
import Save from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import isNil from 'lodash-es/isNil';
import prettyBytes from 'pretty-bytes';
import React, { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAsyncRetry } from 'react-use';

import { Status } from '@skybrush/app-theme-mui';
import {
  BackgroundHint,
  LargeProgressIndicator,
  StatusLight,
} from '@skybrush/mui-components';

import { listOf } from '~/components/helpers/lists';
import { showNotification } from '~/features/snackbar/actions';
import { MessageSemantics } from '~/features/snackbar/types';
import {
  getLogDownloadState,
  initiateLogDownload,
  LogDownloadStatus,
  retrieveDownloadedLog,
  setLogDownloadError,
  setLogDownloadProgress,
  storeDownloadedLog,
} from '~/features/uavs/log-download';
import useMessageHub from '~/hooks/useMessageHub';
import { describeFlightLogKind, type FlightLogKind } from '~/model/enums';
import { convertFlightLogToBlob } from '~/model/flight-logs';
import { type AppDispatch, type RootState } from '~/store/reducers';
import { writeBlobToFile } from '~/utils/filesystem';
import { formatUnixTimestamp } from '~/utils/formatting';

import ListItemProgressBar from './ListItemProgressBar';

const SEPARATOR = ' · ';

const saveLogToFile = (log: any) => {
  const { filename, blob } = convertFlightLogToBlob(log);
  writeBlobToFile(blob, filename);
};

type UAVLogListItemProps = {
  id: string;
  kind?: string;
  size?: number;
  timestamp?: number;
  uavId?: string;
};

const UAVLogListItem = ({
  id,
  kind,
  size,
  timestamp,
  uavId,
}: UAVLogListItemProps) => {
  const dispatch: AppDispatch = useDispatch();
  const messageHub = useMessageHub();
  const { t } = useTranslation();

  const downloadState = useSelector((state: RootState) =>
    uavId ? getLogDownloadState(uavId, id)(state) : undefined
  );
  const log = useSelector((state: RootState) =>
    uavId ? retrieveDownloadedLog(uavId, id)(state) : undefined
  );

  const download = useCallback(() => {
    if (!uavId) {
      return;
    }
    dispatch(initiateLogDownload(uavId, id));
    messageHub.query
      .getFlightLog(uavId, id, {
        onProgress({ progress }: { progress: any }) {
          dispatch(setLogDownloadProgress(uavId, id, progress));
        },
      })
      .then((downloadedLog: any) => {
        dispatch(storeDownloadedLog(uavId, id, downloadedLog));
        showNotification({
          message: `Log ${id} of UAV ${uavId} downloaded successfully.`,
          semantics: MessageSemantics.SUCCESS,
          buttons: [
            {
              label: 'Save',
              action: (() => saveLogToFile(downloadedLog)) as any,
            },
          ],
          timeout: 20000,
        });
      })
      .catch(({ message }: { message: string }) => {
        showNotification({
          message: `Couldn't download log ${id} of UAV ${uavId}: ${message}`,
          semantics: MessageSemantics.ERROR,
          buttons: [{ label: 'Retry', action: download as any }],
          timeout: 20000,
        });
        dispatch(setLogDownloadError(uavId, id, message));
      });
  }, [dispatch, id, messageHub, uavId]);

  const save = useCallback(() => {
    if (log) {
      saveLogToFile(log);
    }
  }, [log]);

  const primaryParts: string[] = [];
  const secondaryParts: string[] = [];

  if (!isNil(id)) {
    primaryParts.push(id);
  }

  primaryParts.push(
    isNil(timestamp) ? 'Date unknown' : formatUnixTimestamp(timestamp)
  );

  if (downloadState?.status === LogDownloadStatus.ERROR) {
    secondaryParts.push(downloadState?.error ?? 'Error');
  } else {
    if (kind) {
      secondaryParts.push(describeFlightLogKind(kind as FlightLogKind, t));
    }
    if (!isNil(size)) {
      secondaryParts.push(prettyBytes(size));
    }
  }

  const secondaryComponent =
    downloadState?.status === LogDownloadStatus.LOADING ? (
      <Box sx={{ py: 0.5 }}>
        <ListItemProgressBar progress={downloadState.progress} />
      </Box>
    ) : (
      <Typography
        sx={{
          fontSize: '11.5px',
          color: 'rgba(255, 255, 255, 0.5)',
          mt: 0.2,
        }}
      >
        {secondaryParts.join(SEPARATOR)}
      </Typography>
    );

  const isLoading = downloadState?.status === LogDownloadStatus.LOADING;
  const onClick = isLoading ? undefined : log ? save : download;

  let statusLightStatus: Status = Status.OFF;
  if (downloadState?.status === LogDownloadStatus.LOADING) {
    statusLightStatus = Status.NEXT;
  } else if (downloadState?.status === LogDownloadStatus.ERROR) {
    statusLightStatus = Status.ERROR;
  } else if (downloadState?.status === LogDownloadStatus.SUCCESS) {
    statusLightStatus = Status.SUCCESS;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'all 0.15s ease',
        overflow: 'hidden',
        mb: 0.8,
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderColor: 'rgba(255, 255, 255, 0.09)',
        },
      }}
    >
      <ListItemButton
        onClick={onClick}
        sx={{
          py: 0.9,
          px: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
        }}
      >
        <StatusLight status={statusLightStatus} />
        <ListItemText
          disableTypography
          primary={
            <Typography
              sx={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              {primaryParts.join(SEPARATOR)}
            </Typography>
          }
          secondary={secondaryComponent}
        />
      </ListItemButton>

      <Box sx={{ pr: 1.5 }}>
        <IconButton
          size='small'
          disabled={isLoading}
          onClick={onClick}
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            '&:hover': {
              color: '#d8f576',
              backgroundColor: 'rgba(216, 245, 118, 0.1)',
            },
          }}
        >
          {downloadState?.status === LogDownloadStatus.SUCCESS ? (
            <Save sx={{ fontSize: 18 }} />
          ) : (
            <GetApp sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

const UAVLogList = listOf(
  (item: any, props: any) => (
    <UAVLogListItem key={item.id} uavId={props.uavId} {...item} />
  ),
  {
    dataProvider: 'items',
    backgroundHint: 'No logs found',
  }
);

type UAVLogsPanelProps = {
  uavId?: string;
};

const UAVLogsPanel = memo(({ uavId }: UAVLogsPanelProps) => {
  const messageHub = useMessageHub();
  const state = useAsyncRetry(
    async () => (uavId ? messageHub.query.getFlightLogList(uavId) : []),
    [messageHub, uavId]
  );

  if (state.error && !state.loading) {
    return (
      <BackgroundHint
        icon={<Error sx={{ fontSize: 36, color: '#f44336' }} />}
        text='Error while loading log list'
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

  if (state.loading) {
    return <LargeProgressIndicator fullHeight label='Retrieving log list...' />;
  }

  if (!Array.isArray(state.value)) {
    return (
      <BackgroundHint
        text='Log list not loaded yet'
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <UAVLogList dense uavId={uavId} items={state.value} />
    </Box>
  );
});

UAVLogsPanel.displayName = 'UAVLogsPanel';

export default UAVLogsPanel;
