import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import clsx from 'clsx';
import createColor from 'color';
import type React from 'react';
import { useMemo } from 'react';

import { makeStyles } from '@skybrush/app-theme-mui';

const useStyles = makeStyles((theme) => ({
  icon: {
    fontSize: '48px',
  },
  root: {
    ...(theme.typography.button as any),
    borderRadius: theme.spacing(0.5),
    boxShadow: theme.shadows[2],
    boxSizing: 'border-box',
    flexDirection: 'column',
    textDecoration: 'none',
    transition: theme.transitions.create(['background-color', 'box-shadow'], {
      duration: theme.transitions.duration.short,
    }),
  },
}));

type ColoredButtonProps = ButtonBaseProps & {
  children: React.ReactNode;
  color: string;
  className?: string;
  dense?: boolean;
  icon?: React.ReactNode;
};

const ColoredButton = ({
  children,
  className,
  color,
  dense = false,
  icon,
  ...rest
}: ColoredButtonProps) => {
  const parsedColor = useMemo(() => createColor(color), [color]);
  const classes = useStyles();

  return (
    <ButtonBase
      focusRipple
      className={clsx(classes.root, className)}
      sx={(theme) => ({
        backgroundColor: 'transparent',
        color: color,
        border: `1px solid ${parsedColor.alpha(0.5).string()}`,
        borderRadius: '8px',
        padding: theme.spacing(1, dense ? 1 : 3),
        '&:hover': {
          backgroundColor: parsedColor.alpha(0.1).string(),
          border: `1px solid ${color}`,
        },
      })}
      {...rest}
    >
      {icon && <div className={classes.icon}>{icon}</div>}
      <div>{children}</div>
    </ButtonBase>
  );
};

export default ColoredButton;
