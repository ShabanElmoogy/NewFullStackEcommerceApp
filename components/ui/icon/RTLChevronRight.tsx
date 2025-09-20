import React from 'react';
import { useRTL } from '@/hooks/useRTL';
import { ChevronRightIcon, ChevronLeftIcon } from './index';
import { Icon } from './index';

interface RTLChevronRightProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xs' | number;
  className?: string;
  style?: any;
  color?: string;
  [key: string]: any;
}

/**
 * RTL-aware ChevronRight component
 * Automatically switches between ChevronRight and ChevronLeft based on language direction
 * - In LTR: Shows ChevronRight (pointing right)
 * - In RTL: Shows ChevronLeft (pointing left, which is the "forward" direction in RTL)
 */
export const RTLChevronRight: React.FC<RTLChevronRightProps> = ({
  size = 'md',
  className,
  style,
  color,
  ...props
}) => {
  const { isRTL } = useRTL();

  // In RTL, the "forward" direction is left, so we use ChevronLeft
  // In LTR, the "forward" direction is right, so we use ChevronRight
  const IconComponent = isRTL ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <Icon
      as={IconComponent}
      size={size}
      className={className}
      style={style ? { color, ...style } : { color }}
      {...props}
    />
  );
};

export default RTLChevronRight;