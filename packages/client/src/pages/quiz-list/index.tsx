import DownArrowIcon from '@/shared/assets/icons/down-arrow.svg?react';
import { CustomButton } from '@/shared/ui/buttons';
import Modal from '@/shared/ui/modal';
import { useEffect, useState } from 'react';
import QuizTitleModal from './ui/QuizTitleModal';
import { useNavigate } from 'react-router-dom';
import { getQuizSocket } from '@/shared/utils/socket';
import { setCookie } from '@/shared/utils/cookie';
import { waitForSocketEvent } from '@/shared/utils/waitForSocketEvent';
import { useGetClasses } from '@/shared/hooks/classes';
import { QuizData } from '@/pages/quiz-create';
import { getQuiz } from '@/shared/api/quizzes';

type QuizList = QuizData[];

export default function QuizList() {
  const { data: classList } = useGetClasses();
  const [selectedClassIndex, setSelectedClassIndex] = useState(-1);
  const [quizList, setQuizList] = useState<QuizList[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const handleSelectClass = (index: number) => {
    if (selectedClassIndex === index) {
      setSelectedClassIndex(-1);
      return;
    }
    setSelectedClassIndex(index);
  };

  const handleQuizStart = async (id: number) => {
    const socket = getQuizSocket();
    socket.emit('master entry', { classId: id });
    /**비동기 작업 */
    const sid = await waitForSocketEvent('session', socket);
    setCookie('sid', sid);

    const pinCode = await waitForSocketEvent('pincode', socket);
    setCookie('pinCode', pinCode);

    navigate(`/quiz/wait/${pinCode}`);
  };

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
          <div key={quiz.title}>
            <div
              className={`flex justify-between itemds-center min-w-content h-20 items-center bg-white ${selectedClassIndex === index ? 'border-secondary' : 'border-border'}  border rounded-base p-6 cursor-pointer`}
              onClick={() => handleSelectClass(index)}
            >
              <span>{quiz.title}</span>
              <div className="flex gap-12">
                <CustomButton
                  type="full"
                  label="퀴즈 시작하기"
                  color="secondary"
                  onClick={() => handleQuizStart(quiz.id)}
                />
                <button type="button" onClick={() => handleSelectClass(index)}>
                  <DownArrowIcon
                    stroke="#000000"
                    className={selectedClassIndex === index ? 'rotate-180' : 'rotate-0'}
                  />
                </button>
              </div>
            </div>
            {selectedClassIndex === index && (
              <div
                className={`flex flex-col gap-3 p-6 mt-4 border ${selectedClassIndex === index ? 'border-secondary' : 'border-border'} rounded-base bg-white`}
              >
                {quizList[index].map((quizData, index) => (
                  <span key={quizData.content}>
                    {index + 1}번 문제: {quizData.content}
                  </span>
                ))}
              </div>
            )}
          </div>
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
