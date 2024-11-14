import type { Meta, StoryObj } from '@storybook/react';

import SideNav from './SideNav';

const meta = {
  title: 'Common/SideNav',
  component: SideNav,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { className: 'Class Name' },
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
