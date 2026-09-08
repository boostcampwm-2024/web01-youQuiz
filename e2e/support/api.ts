const SERVER_URL = process.env.E2E_SERVER_URL || 'http://localhost:3000';

export interface SeededChoice {
  position: number;
  content: string;
  isCorrect: boolean;
}

export interface SeededQuiz {
  content: string;
  quizType: 'TF' | 'MC';
  timeLimit: number;
  point: number;
  position: number;
  choices: SeededChoice[];
}

export async function createClass(title: string, description: string): Promise<number> {
  const res = await fetch(`${SERVER_URL}/api/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!res.ok) {
    throw new Error(`createClass failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  return body.data.id as number;
}

export async function createQuizzes(classId: number, quizzes: SeededQuiz[]): Promise<void> {
  const res = await fetch(`${SERVER_URL}/api/classes/${classId}/quizzes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizzes }),
  });
  if (!res.ok) {
    throw new Error(`createQuizzes failed: ${res.status} ${await res.text()}`);
  }
}

export async function deleteClass(classId: number): Promise<void> {
  const res = await fetch(`${SERVER_URL}/api/classes/${classId}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`deleteClass failed: ${res.status} ${await res.text()}`);
  }
}

export async function getQuizzesByClassId(classId: number) {
  const res = await fetch(`${SERVER_URL}/api/classes/${classId}/quizzes`);
  if (!res.ok) {
    throw new Error(`getQuizzesByClassId failed: ${res.status} ${await res.text()}`);
  }
  const body = await res.json();
  return body.data;
}
