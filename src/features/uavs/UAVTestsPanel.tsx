import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Zoom from '@mui/material/Zoom';
import isNil from 'lodash-es/isNil';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAsyncFn } from 'react-use';

import { Status } from '@skybrush/app-theme-mui';
import { StatusLight } from '@skybrush/mui-components';

import Colors from '~/components/colors';
import { errorToString } from '~/error-handling';
import { useMessageHub } from '~/hooks';

import { COMPASS_CALIB_TIMEOUT } from './constants';
import ListItemProgressBar from './ListItemProgressBar';

type TestConfig = {
  component: string;
  label: string;
  needsConfirmation?: boolean;
  timeout?: number;
  type: 'calib' | 'test';
};

const tests: TestConfig[] = [
  {
    component: 'compass',
    label: 'Calibrate compass',
    type: 'calib',
    timeout: COMPASS_CALIB_TIMEOUT,
  },
  {
    component: 'accel',
    label: 'Calibrate accelerometer',
    type: 'calib',
    timeout: 90,
  },
  {
    component: 'baro',
    label: 'Calibrate ground pressure',
    type: 'calib',
    timeout: 10,
  },
  {
    component: 'gyro',
    label: 'Calibrate gyroscope',
    type: 'calib',
    timeout: 10,
  },
  {
    component: 'level',
    label: 'Calibrate level position',
    type: 'calib',
    timeout: 10,
  },
  {
    component: 'led',
    label: 'Execute LED test',
    type: 'test',
  },
  {
    component: 'pyro',
    label: 'Execute pyro test',
    needsConfirmation: true,
    type: 'test',
  },
  {
    component: 'motor',
    label: 'Execute motor test',
    needsConfirmation: true,
    type: 'test',
  },
];

type UAVTestButtonProps = {
  component: string;
  label: string;
  needsConfirmation?: boolean;
  timeout?: number;
  type: 'calib' | 'test';
  uavId?: string;
};

const UAVTestButton = ({
  component,
  label,
  needsConfirmation = false,
  timeout,
  type,
  uavId,
}: UAVTestButtonProps) => {
  const messageHub = useMessageHub();

  const [pendingConfirmation, setPendingConfirmation] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [progress, setProgress] = useState<any>(null);
  const [suspended, setSuspended] = useState(false);
  const resumeCallback = useRef<(() => void) | null>(null);
  const lastExecutedUavIdRef = useRef<string | undefined>(null as any);
  const uavIdRef = useRef(uavId);
  uavIdRef.current = uavId;

  const clearPendingConfirmation = useCallback(() => {
    if (pendingConfirmation) {
      clearTimeout(pendingConfirmation);
      setPendingConfirmation(null);
    }
  }, [pendingConfirmation]);

  useEffect(() => {
    clearPendingConfirmation();
    setProgress(null);
    setSuspended(false);
    resumeCallback.current = null;
  }, [clearPendingConfirmation, uavId]);

  const askForConfirmation = useCallback(() => {
    clearPendingConfirmation();
    setPendingConfirmation(setTimeout(clearPendingConfirmation, 3000));
  }, [clearPendingConfirmation]);

  const progressHandler = useCallback(
    (
      progressUAVId: string,
      {
        progress: prog,
        resume,
        suspended: susp,
      }: { progress?: any; resume?: any; suspended?: boolean }
    ) => {
      if (progressUAVId !== uavIdRef.current) {
        return;
      }
      setProgress(prog);
      setSuspended(Boolean(susp));
      resumeCallback.current = resume;
    },
    []
  );

  const [lastExecutionState, execute] = useAsyncFn(async () => {
    lastExecutedUavIdRef.current = uavId;
    if (!uavId) {
      return false;
    }
    await messageHub.sendCommandRequest(
      {
        uavId,
        command: type === 'test' ? 'test' : 'calib',
        args: [String(component)],
      },
      {
        onProgress: (prog: any) => progressHandler(uavId, prog),
        timeout,
      }
    );
    return true;
  }, [component, messageHub, progressHandler, timeout, type, uavId]);

  const executionState =
    lastExecutedUavIdRef.current === uavId
      ? lastExecutionState
      : { loading: false, error: undefined, value: undefined };

  const [, resume] = useAsyncFn(async () => {
    if (resumeCallback.current) {
      return resumeCallback.current();
    } else {
      throw new Error('No resume callback has been provided');
    }
  }, []);

  const giveConfirmation = useCallback(() => {
    clearPendingConfirmation();
    if (suspended) {
      resume();
    } else {
      execute();
    }
  }, [clearPendingConfirmation, execute, resume, suspended]);

  const confirmButton = (
    <Zoom in={Boolean(pendingConfirmation)}>
      <Button
        size='small'
        variant='contained'
        sx={{
          backgroundColor: Colors.seriousWarning,
          color: '#000',
          fontWeight: 700,
          fontSize: '11px',
          mr: 1,
          '&:hover': {
            backgroundColor: '#ff7961',
          },
        }}
        onClick={giveConfirmation}
      >
        Confirm
      </Button>
    </Zoom>
  );

  let statusLightStatus: Status = Status.OFF;
  if (suspended) {
    statusLightStatus = Status.WARNING;
  } else if (executionState.loading) {
    statusLightStatus = Status.NEXT;
  } else if (executionState.error) {
    statusLightStatus = Status.ERROR;
  } else if (isNil(executionState.value)) {
    statusLightStatus = Status.OFF;
  } else if (executionState.value) {
    statusLightStatus = Status.SUCCESS;
  } else {
    statusLightStatus = Status.ERROR;
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
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderColor: 'rgba(255, 255, 255, 0.09)',
        },
      }}
    >
      <ListItemButton
        onClick={needsConfirmation ? askForConfirmation : giveConfirmation}
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
          primary={
            suspended
              ? `${progress?.message || 'Operation suspended'}. Click to resume.`
              : progress && (!executionState.error || executionState.loading)
                ? `${progress?.message || label}`
                : label
          }
          primaryTypographyProps={{
            sx: {
              fontSize: '12.5px',
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          secondary={
            !executionState.loading && executionState.error ? (
              errorToString(executionState.error)
            ) : progress ? (
              <ListItemProgressBar progress={progress} />
            ) : suspended ? (
              <ListItemProgressBar />
            ) : null
          }
          secondaryTypographyProps={{
            component: 'div',
            sx: {
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.5)',
              mt: 0.3,
            },
          }}
        />
      </ListItemButton>

      {needsConfirmation && confirmButton}
    </Box>
  );
};

type UAVTestsPanelProps = {
  uavId?: string;
};

const UAVTestsPanel = ({ uavId }: UAVTestsPanelProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
      {tests.map(({ component, ...props }) => (
        <UAVTestButton
          key={component}
          component={component}
          uavId={uavId}
          {...props}
        />
      ))}
    </Box>
  );
};

export default UAVTestsPanel;
