import { ActionIcon, ActionIconProps } from '@mantine/core';
import { IconSettings, IconProps } from '@tabler/icons-react';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { openContext } from '~/providers/CustomModalsProvider';

export function ManageHomepageButton({
  iconProps,
  ...actionIconProps
}: ActionIconProps & { iconProps?: IconProps }) {
  const user = useCurrentUser();
  if (!user) return null;

  return (
    <ActionIcon
      size="md"
      variant="subtle"
      color="dark"
      {...actionIconProps}
      onClick={() => openContext('manageHomeBlocks', {})}
    >
      <IconSettings {...iconProps} />
    </ActionIcon>
  );
}
