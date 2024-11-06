import { Meta, StoryObj } from '@storybook/react';
import ToggleButton from './ToggleButton';

const meta = {
  title: 'common/ToggleButton',
  parameters: {
    layout: 'centered',
  },
  component: ToggleButton,
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckToggleButtonWithActive: Story = {
  args: {
    type: 'check',
    isClickable: true,
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const QuestionToggleButtonWithActive: Story = {
  args: {
    type: 'question',
    isClickable: true,
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const CheckBoxToggleButtonWithActive: Story = {
  args: {
    type: 'checkBox',
    isClickable: true,
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const CheckToggleButtonWithInactive: Story = {
  args: {
    type: 'check',
    isClickable: true,
    isActive: false,
    onClick: () => console.log('click'),
  },
};

export const QuestionToggleButtonWithInactive: Story = {
  args: {
    type: 'question',
    isClickable: true,
    isActive: false,
    onClick: () => console.log('click'),
  },
};

export const CheckBoxToggleButtonWithInactive: Story = {
  args: {
    type: 'checkBox',
    isClickable: true,
    isActive: false,
    onClick: () => console.log('click'),
  },
};
