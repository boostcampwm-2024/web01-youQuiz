import { QuizData } from '@youquiz/shared/interfaces/utils/quizdata.interface';
import {
  MasterStatisticsResponse,
  ParticipantStatisticsResponse,
  TimerTickResponse,
} from '@youquiz/shared/interfaces/response';

export const INITIAL_QUIZ_DATA: QuizData = {
  id: 0,
  content: '',
  choices: [],
  quizType: 'MC',
  timeLimit: 0,
  point: 0,
  position: 0,
};

export const INITIAL_TICK: TimerTickResponse = {
  curretTime: 0,
  elaspedTime: 0,
  remainingTime: 0,
};

export const INITIAL_MASTER_STATISTICS: MasterStatisticsResponse = {
  averageTime: 0,
  choiceStatus: { 0: 0, 1: 0, 2: 0, 3: 0 },
  participantLength: 0,
  participantRate: 0,
  solveRate: 0,
  submitHistory: [],
  totalSubmit: 0,
};

export const INITIAL_PARTICIPANT_STATISTICS: ParticipantStatisticsResponse = {
  averageTime: 0,
  participantRate: 0,
  solveRate: 0,
  totalSubmit: 0,
};

export const INITIAL_EMOJI = {
  easy: 0,
  hard: 0,
};
