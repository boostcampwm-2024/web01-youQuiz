import LeftArrow from '@/assets/icons/left-arrow.svg?react';

export default function BackButton() {
  return (
    <button
      className="w-10 h-10 border rounded-full border-none bg-weak flex items-center justify-center"
      onClick={() => history.back()}
    >
      <LeftArrow className="w-6 h-6" />
    </button>
  );
}
