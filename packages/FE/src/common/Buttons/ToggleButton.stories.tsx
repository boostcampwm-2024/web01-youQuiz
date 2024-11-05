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
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const QuestionToggleButtonWithActive: Story = {
  args: {
    type: 'question',
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const CheckBoxToggleButtonWithActive: Story = {
  args: {
    type: 'checkBox',
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const CheckToggleButtonWithInactive: Story = {
  args: {
    type: 'check',
    isActive: false,
    onClick: () => console.log('click'),
  },
};

export const QuestionToggleButtonWithInactive: Story = {
  args: {
    type: 'question',
    isActive: false,
    onClick: () => console.log('click'),
  },
};

export const CheckBoxToggleButtonWithInactive: Story = {
  args: {
    type: 'checkBox',
    isActive: false,
    onClick: () => console.log('click'),
  },
};
