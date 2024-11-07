import { Meta, StoryObj } from '@storybook/react';
import IconTextButton from './IconTextButton';
import ChartIcon from '@/shared/assets/icons/chart.svg?react';
import GraphIcon from '@/shared/assets/icons/graph.svg?react';
import SettingIcon from '@/shared/assets/icons/setting.svg?react';

const meta = {
  title: 'common/IconTextButton',
  parameters: {
    layout: 'centered',
  },
  component: IconTextButton,
  tags: ['autodocs'],
} satisfies Meta<typeof IconTextButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InteractionWithActive: Story = {
  args: {
    Icon: ChartIcon,
    text: '인터렉션',
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const StatisticWithActive: Story = {
  args: {
    Icon: GraphIcon,
    text: '통계',
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const SettingWithActive: Story = {
  args: {
    Icon: SettingIcon,
    text: '설정',
    isActive: true,
    onClick: () => console.log('click'),
  },
};

export const InteractionWithInactive: Story = {
  args: {
    Icon: ChartIcon,
    text: '인터렉션',
    isActive: false,
    onClick: () => console.log('click'),
  },
};

export const StatisticWithInactive: Story = {
  args: {
    Icon: GraphIcon,
    text: '통계',
    isActive: false,
    onClick: () => console.log('click'),
  },
};

export const SettingWithInactive: Story = {
  args: {
    Icon: SettingIcon,
    text: '설정',
    isActive: false,
    onClick: () => console.log('click'),
  },
};
