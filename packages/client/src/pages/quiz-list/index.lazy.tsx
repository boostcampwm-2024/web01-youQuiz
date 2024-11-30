import { CustomButton } from '@/shared/ui/buttons';
import Modal from '@/shared/ui/modal';
import { useState } from 'react';
import QuizTitleModal from './ui/QuizTitleModal';
import { useGetClasses } from '@/shared/hooks/classes';
import ClassItem from './ui/ClassItem';

export default function QuizListLazyPage() {
  const { data: classList } = useGetClasses();
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] px-8 flex flex-col gap-6 mt-6 mx-auto">
      {classList.data.map((item, index) => {
        return <ClassItem key={item.id} quizList={item} index={index} />;
      })}
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
