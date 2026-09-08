import { createClass, createQuizzes, deleteClass, SeededQuiz } from './api';

export const E2E_TITLE_PREFIX = '[E2E]';

export const QUIZZES: SeededQuiz[] = [
  {
    content: 'E2E Q1: 1 + 1 = ?',
    quizType: 'MC',
    timeLimit: 30,
    point: 100,
    position: 0,
    choices: [
      { position: 0, content: '1', isCorrect: false },
      { position: 1, content: '2', isCorrect: true },
      { position: 2, content: '3', isCorrect: false },
      { position: 3, content: '4', isCorrect: false },
    ],
  },
  {
    content: 'E2E Q2: 지구는 둥글다',
    quizType: 'TF',
    timeLimit: 20,
    point: 100,
    position: 1,
    choices: [
      { position: 0, content: '참', isCorrect: true },
      { position: 1, content: '거짓', isCorrect: false },
    ],
  },
  {
    content: 'E2E Q3: 프로그래밍 언어가 아닌 것은?',
    quizType: 'MC',
    timeLimit: 30,
    point: 100,
    position: 2,
    choices: [
      { position: 0, content: 'TypeScript', isCorrect: false },
      { position: 1, content: 'Python', isCorrect: false },
      { position: 2, content: '마우스', isCorrect: true },
      { position: 3, content: 'Java', isCorrect: false },
    ],
  },
];

// E04(참가자 단절 중 문제 진행)는 호스트가 실제 UI 절차("다음 퀴즈" 버튼)로
// 자연스럽게 다음 문제로 넘어가는 것을 관찰해야 한다. 그 버튼은
// QuizMasterHeader에서 remainingTime(=timeLimit - 경과초) <= 0일 때만
// 활성화되므로, 테스트가 임의로 오래 기다리지 않도록 timeLimit을 짧게(5초)
// seed한다 — 결함을 감추기 위한 timeout 증가가 아니라 "실제로 제한시간이
// 끝나기를 기다리는" 유일한 정상 경로를 짧게 만든 것이다.
export const SHORT_TIMELIMIT_QUIZZES: SeededQuiz[] = [
  {
    content: 'E2E-R Q1: 1 + 1 = ?',
    quizType: 'MC',
    timeLimit: 5,
    point: 100,
    position: 0,
    choices: [
      { position: 0, content: '1', isCorrect: false },
      { position: 1, content: '2', isCorrect: true },
      { position: 2, content: '3', isCorrect: false },
      { position: 3, content: '4', isCorrect: false },
    ],
  },
  {
    content: 'E2E-R Q2: 지구는 둥글다',
    quizType: 'TF',
    timeLimit: 30,
    point: 100,
    position: 1,
    choices: [
      { position: 0, content: '참', isCorrect: true },
      { position: 1, content: '거짓', isCorrect: false },
    ],
  },
];

export async function seedQuizClass(
  quizzes: SeededQuiz[] = QUIZZES,
  onClassCreated?: (classId: number) => void,
): Promise<{ classId: number; title: string }> {
  const title = `${E2E_TITLE_PREFIX} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const classId = await createClass(title, 'Playwright 실제 브라우저 E2E 시드 데이터');
  // class는 이미 만들어졌으니, 이후 createQuizzes가 실패해도 호출자가
  // classId를 알고 정리할 수 있도록 즉시 알린다.
  onClassCreated?.(classId);
  await createQuizzes(classId, quizzes);
  return { classId, title };
}

export async function cleanupQuizClass(classId: number): Promise<void> {
  await deleteClass(classId);
}
