import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'msuRed',
  colors: {
    msuRed: [
      '#fef2f4',
      '#fde8eb',
      '#fcd0d7',
      '#f9a8b8',
      '#f47591',
      '#ee4d6f',
      '#e92d56',
      '#840029', // MSU Primary Red
      '#6d0021',
      '#5f001d',
    ],
    msuYellow: [
      '#fffbeb',
      '#fef3c7',
      '#fde68a',
      '#fcd34d',
      '#fbbf24',
      '#FCB116', // MSU Primary Yellow
      '#f59e0b',
      '#d97706',
      '#b45309',
      '#92400e',
    ],
    msuGray: [
      '#f9f9f9',
      '#f0f0f0',
      '#e0e0e0',
      '#c8c8c8',
      '#a0a0a0',
      '#6E6565', // MSU Primary Gray
      '#5C5959', // MSU Secondary Gray
      '#4a4a4a',
      '#2d2d2d',
      '#1a1a1a',
    ],
  },
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  shadows: {
    md: '0 4px 6px -1px rgba(132, 0, 41, 0.1), 0 2px 4px -1px rgba(132, 0, 41, 0.06)',
    lg: '0 10px 15px -3px rgba(132, 0, 41, 0.1), 0 4px 6px -2px rgba(132, 0, 41, 0.05)',
    xl: '0 20px 25px -5px rgba(132, 0, 41, 0.1), 0 10px 10px -5px rgba(132, 0, 41, 0.04)',
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
    Stepper: {
      styles: {
        stepIcon: {
          borderWidth: 2,
        },
        separator: {
          height: 2,
        },
      },
    },
  },
});
