import type { Meta, StoryObj } from '@storybook/react';

import Toast from './Toast.tsx';

const meta = {
  title: 'Common/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  args: { toastId: 0, type: 'success', label: '성공 문구입니다.', time: 5 },
};

export const Warning: Story = {
  args: { toastId: 1, type: 'warning', label: '경고 문구입니다.', time: 5 },
};

export const Error: Story = {
  args: { toastId: 2, type: 'error', label: '에러 문구입니다.', time: 5 },
};

export const Info: Story = {
  args: { toastId: 3, type: 'info', label: '정보 문구입니다.', time: 5 },
};
