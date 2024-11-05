import LeftArrow from '../assets/icons/left-arrow.svg?react';

export default function BackButton() {
  return (
    <button
      className="w-14 h-14 border rounded-full border-none bg-weak flex items-center justify-center"
      onClick={() => history.back()}
    >
      <LeftArrow />
    </button>
  );
}
