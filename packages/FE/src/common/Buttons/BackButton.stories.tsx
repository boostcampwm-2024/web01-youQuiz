import { Meta, StoryObj } from '@storybook/react';
import BackButton from './BackButton';

const meta = {
  title: '뒤로가기 버튼',
  parameters: {
    layout: 'centered',
  },
  component: BackButton,
  tags: ['autodocs'],
} satisfies Meta<typeof BackButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
