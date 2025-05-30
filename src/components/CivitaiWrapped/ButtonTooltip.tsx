import type { TooltipProps } from '@mantine/core';
import { Box, Tooltip } from '@mantine/core';
import { forwardRef } from 'react';

export const ButtonTooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, ...props }, ref) => {
    return (
      <Tooltip {...props}>
        <Box ref={ref}>{children}</Box>
      </Tooltip>
    );
  }
);
ButtonTooltip.displayName = 'ButtonTooltip';
