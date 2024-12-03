import { CustomButton } from '@/shared/ui/buttons';
import Modal from '@/shared/ui/modal';
import { useEffect, useState } from 'react';
import QuizTitleModal from './ui/QuizTitleModal';
import { useGetClasses } from '@/shared/hooks/classes';
import ClassItem from './ui/ClassItem';
import EmptyQuizList from './ui/EmptyClassList';

export default function QuizListLazyPage() {
  const { data: classList, refetch } = useGetClasses();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] px-8 flex flex-col gap-6 mt-6 mx-auto">
      {classList.data.map((item, index) => {
        return <ClassItem key={item.id} quizList={item} index={index} />;
      })}
      {classList.data.length === 0 && <EmptyQuizList />}
      <div className="self-end ">
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
