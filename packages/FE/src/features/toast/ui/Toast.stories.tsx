import type { Meta, StoryObj } from '@storybook/react';

import Toast from './Toast.tsx';
import ToastContainer from './ToastContainer.tsx';
import { toastController } from '../model/toastController.ts';
import CustomButton from '../../../shared/ui/buttons/CustomButton.tsx';

const meta = {
  title: 'Common/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div>
        <ToastContainer position="top-right" />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

const toast = toastController();

export const Success: Story = {
  render: () => (
    <CustomButton
      type="full"
      label="성공 토스트"
      onClick={() => {
        toast.success('성공 문구입니다.');
      }}
    />
  ),
  args: {
    toastId: 0,
    type: 'success',
    label: '성공 문구입니다.',
    time: 5,
  },
};

export const Warning: Story = {
  render: () => (
    <CustomButton
      type="full"
      label="경고 토스트"
      onClick={() => {
        toast.warning('경고 문구입니다.');
      }}
    />
  ),
  args: {
    toastId: 1,
    type: 'warning',
    label: '경고 문구입니다.',
    time: 5,
  },
};

export const Error: Story = {
  render: () => (
    <CustomButton
      type="full"
      label="에러 토스트"
      onClick={() => {
        toast.error('에러 문구입니다.');
      }}
    />
  ),
  args: {
    toastId: 2,
    type: 'error',
    label: '에러 문구입니다.',
    time: 5,
  },
};

export const Info: Story = {
  render: () => (
    <CustomButton
      type="full"
      label="정보 토스트"
      onClick={() => {
        toast.info('정보 문구입니다.');
      }}
    />
  ),
  args: {
    toastId: 3,
    type: 'info',
    label: '정보 문구입니다.',
    time: 5,
  },
};
