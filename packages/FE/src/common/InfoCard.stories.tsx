import { Meta, StoryObj } from '@storybook/react';
import InfoCard from './InfoCard';
import QuestionIcon from '../assets/icons/question.svg?react';
import CheckboxIcon from '../assets/icons/check-box.svg?react';

const quizInfoList = [
  {
    title: 'Quiz 1',
    onClick: () => console.log('Quiz 1 clicked'),
  },
  {
    title: 'Quiz 2',
    onClick: () => console.log('Quiz 2 clicked'),
  },
  {
    title: 'Quiz 3',
    onClick: () => console.log('Quiz 3 clicked'),
  },
  {
    title: 'Quiz 4',
    onClick: () => console.log('Quiz 4 clicked'),
  },
  {
    title: 'Quiz 5',
    onClick: () => console.log('Quiz 5 clicked'),
  },
];

const meta = {
  title: '정보 카드',
  parameters: {
    layout: 'centered',
  },
  component: InfoCard,
  tags: ['autodocs'],
} satisfies Meta<typeof InfoCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const QuizInfoCard: Story = {
  args: {
    Icon: QuestionIcon,
    title: '퀴즈이름',
    infoList: quizInfoList,
    isExpandable: true,
  },
};

export const QuestionAndAnswerInfoCard: Story = {
  args: {
    Icon: CheckboxIcon,
    title: 'Q&A',
    infoList: quizInfoList,
    isExpandable: false,
  },
};
