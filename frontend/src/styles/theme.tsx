import { createTheme, Input, MantineColorsTuple, MantineThemeOverride } from '@mantine/core';
import { colors } from '@/styles/colors';

export const theme: MantineThemeOverride = createTheme({
  fontFamily: 'Main Font, sans-serif',
  defaultRadius: 'md',
  primaryColor: 'primary',
  primaryShade: 5,
  colors: {
    primary: Object.values(colors.primary) as unknown as MantineColorsTuple,
    secondary: Object.values(colors.secondary) as unknown as MantineColorsTuple,
    error: Object.values(colors.error) as unknown as MantineColorsTuple,
  },
  components: {
    InputWrapper: Input.Wrapper.extend({
      defaultProps: {
        classNames: {
          label: 'font-semibold text-sm',
        },
      },
    }),
    Input: Input.extend({
      classNames: {
        input: 'disabled:bg-[#f2f2f2] disabled:text-[#333]',
      },
    }),
    // Tabs: Tabs.extend({
    //   classNames: {
    //     list: "before:border-none",
    //     tab: "font-medium border-y-2 border-r-2 border-primary-primary border-collapse rounded-none first:border-2 first:rounded-l-md last:rounded-r-md data-[active=true]:bg-primary-primary data-[active=true]:text-white hover:border-primary-primary",
    //   },
    // }),
  },
});
