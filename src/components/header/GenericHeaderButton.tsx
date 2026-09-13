import clsx from 'clsx';
import type React from 'react';
import { forwardRef, type HTMLAttributes } from 'react';

export type GenericHeaderButtonProps = {
  children?: React.ReactNode;
  disabled?: boolean;
  label?: React.ReactNode;
  secondaryLabel?: React.ReactNode;
  tooltip?: string;
} & HTMLAttributes<HTMLButtonElement>;

export const GenericHeaderButton = forwardRef<HTMLButtonElement, GenericHeaderButtonProps>(
  ({ children, disabled, label, secondaryLabel, tooltip, className, ...rest }, ref) => {
    const hasLabel = label !== undefined || secondaryLabel !== undefined;
    
    return (
      <button
        ref={ref}
        title={tooltip}
        disabled={disabled}
        className={clsx(
          'generic-header-button',
          hasLabel && 'with-label',
          className
        )}
        {...rest}
      >
        {children}
        {label !== undefined && (
          <span className='generic-header-button-label'>{label}</span>
        )}
        {secondaryLabel !== undefined && (
          <span className='generic-header-button-secondary-label'>
            {secondaryLabel}
          </span>
        )}
      </button>
    );
  }
);

GenericHeaderButton.displayName = 'GenericHeaderButton';

export default GenericHeaderButton;
