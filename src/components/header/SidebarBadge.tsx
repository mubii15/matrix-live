import type React from 'react';

export type SidebarBadgeProps = {
  anchor?: string;
  badgeContent?: React.ReactNode;
  children?: React.ReactNode;
  invisible?: boolean;
  offset?: number[];
  visible?: boolean;
  color?: string;
};

export const SidebarBadge: React.FC<SidebarBadgeProps> = ({
  badgeContent,
  children,
  invisible,
  visible,
  color,
}) => {
  const isHidden = invisible === true || visible === false;
  return (
    <div style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {!isHidden && badgeContent !== undefined && badgeContent !== 0 && (
        <span
          className='header-sidebar-badge'
          style={color ? { backgroundColor: color } : undefined}
        >
          {badgeContent}
        </span>
      )}
    </div>
  );
};

export default SidebarBadge;
