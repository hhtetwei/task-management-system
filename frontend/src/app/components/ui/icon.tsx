import { forwardRef, type ComponentProps } from "react";

import userActive from '@/assets/user-active.svg'
import userInactive from '@/assets/user-inactive.svg'

const icons = {
    userActive,
    userInactive,
};

export type IconName = keyof typeof icons;

type Props = {
  name: IconName;
} & ComponentProps<'svg'>;

// eslint-disable-next-line react/display-name
export const Icon = forwardRef<SVGSVGElement, Props>(({ name, ...props }, ref) => {
  const Component = icons[name];
  return <Component {...props} ref={ref} />;
});
