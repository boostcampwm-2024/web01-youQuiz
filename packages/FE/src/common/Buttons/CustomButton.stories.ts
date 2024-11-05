import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import CustomButton from './CustomButton';
import PlusIcon from '../../assets/icons/plus.svg?react';

const meta = {
  title: 'Common/CustomButton',
  component: CustomButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // argTypes: {},
  args: { onClick: fn() },
} satisfies Meta<typeof CustomButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimaryFull: Story = {
  args: {
    type: 'full',
    Icon: PlusIcon,
    color: 'primary',
    size: 'md',
    label: 'Button',
  },
};

export const SecondaryFull: Story = {
  args: {
    type: 'full',
    Icon: PlusIcon,
    color: 'secondary',
    size: 'md',
    label: 'Button',
  },
};

export const LightFull: Story = {
  args: {
    type: 'full',
    color: 'light',
    Icon: PlusIcon,
    size: 'md',
    label: 'Button',
  },
};

export const PrimaryOutline: Story = {
  args: {
    type: 'outline',
    color: 'primary',
    Icon: PlusIcon,
    size: 'md',
    label: 'Button',
  },
};

export const LightFullSmall: Story = {
  args: {
    type: 'full',
    color: 'light',
    size: 'sm',
    label: 'Button',
  },
};
