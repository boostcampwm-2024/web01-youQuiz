import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import ProgressBar from './ProgressBar';

const meta = {
  title: 'Common/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SuccessProgress: Story = {
  args: {
    time: 5,
    type: 'success',
    barShape: 'rounded',
    pauseOnHover: true,
    handleAnimationEnd: fn(),
  },
};

export const WarningProgress: Story = {
  args: {
    time: 5,
    type: 'warning',
    barShape: 'rounded',
    pauseOnHover: true,
    handleAnimationEnd: fn(),
  },
};

export const ErrorProgress: Story = {
  args: {
    time: 5,
    type: 'error',
    barShape: 'rounded',
    pauseOnHover: true,
    handleAnimationEnd: fn(),
  },
};

export const InfoProgress: Story = {
  args: {
    time: 5,
    type: 'info',
    barShape: 'rounded',
    pauseOnHover: true,
    handleAnimationEnd: fn(),
  },
};
