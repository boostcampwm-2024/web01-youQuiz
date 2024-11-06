import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import InputBox from './InputBox';

const meta = {
  title: 'Common/InputBox',
  component: InputBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onSubmit: fn() },
} satisfies Meta<typeof InputBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'box',
    placeholder: '문제를 입력해주세요',
    onSubmit: fn(),
  },
};

export const WithButton: Story = {
  args: {
    type: 'box',
    button: true,
    placeholder: '문제를 입력해주세요',
    onSubmit: fn(),
  },
};

export const Underline: Story = {
  args: {
    type: 'underline',
    placeholder: '문제를 입력해주세요',
    onSubmit: fn(),
  },
};

export const UnderlineWithButton: Story = {
  args: {
    type: 'underline',
    button: true,
    placeholder: '문제를 입력해주세요',
    onSubmit: fn(),
  },
};
