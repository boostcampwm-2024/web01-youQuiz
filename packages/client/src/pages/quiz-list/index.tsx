import { CustomButton } from '@/shared/ui/buttons';
import Modal from '@/shared/ui/modal';
import { useEffect, useState } from 'react';
import QuizTitleModal from './ui/QuizTitleModal';
import { useGetClasses } from '@/shared/hooks/classes';
import { QuizData } from '@/pages/quiz-create';
import { getQuiz } from '@/shared/api/quizzes';
import ClassItem from './ui/ClassItem';

type QuizList = QuizData[];

export default function QuizList() {
  const { data: classList } = useGetClasses();
  const [quizList, setQuizList] = useState<QuizList[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!classList) return;

    // Promise.all로 비동기 작업을 병렬 처리
    const fetchAllQuizzes = async () => {
      const results = await Promise.all(
        classList.map(async (quiz) => {
          const quizData = await getQuiz(quiz.id);
          return quizData;
        }),
      );

      setQuizList(results);
    };

    fetchAllQuizzes();
  }, [classList]);

  return (
    <div className="flex flex-col gap-10 w-full mt-6 mx-6">
      {classList ? (
        classList.map((quiz, index) => (
          <ClassItem
            key={`${quiz.title}+ ${index}`}
            quiz={quiz}
            index={index}
            quizList={quizList}
          />
        ))
      ) : (
        <div>왜 안되는데</div>
      )}
      <div className="self-end">
        <CustomButton
          type="outline"
          label="퀴즈 만들기"
          color="primary"
          size="md"
          onClick={() => setOpenModal(true)}
        />
      </div>
      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <QuizTitleModal onClose={() => setOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
}
