import type { SwitchProps } from '@mantine/core';
import { Skeleton, Switch } from '@mantine/core';

export const SkeletonSwitch = ({ loading, ...props }: { loading: boolean } & SwitchProps) => {
  return (
    <Skeleton height={20} width={40} radius="lg" visible={loading}>
      <Switch {...props} />
    </Skeleton>
  );
};
