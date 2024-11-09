import { CustomButton } from '@/shared/ui/buttons';
import { generateRandomPositions } from '@/shared/utils/generateRandomPositions';
import { QRCodeSVG } from 'qrcode.react';
import { useLayoutEffect, useRef, useState } from 'react';

// TODO: 파일 분리
const GUEST_DISPLAY_SIZE = { width: 1020, height: 576 };
const SPACING = 10;
const BUTTON_SIZE = { width: 74, height: 44 };

// TODO: API 연동 후 삭제
const fakeLink = 'https://google.com';
const fakeGuests = ['도훈', '성현', '병찬', '채원', '세상에서가장긴닉네임입니다.', 'faker'];

const from = { x: SPACING, y: SPACING };
const to = { x: GUEST_DISPLAY_SIZE.width - SPACING, y: GUEST_DISPLAY_SIZE.height - SPACING };
const count = fakeGuests.length;

export default function QuizWait() {
  const buttonRefs = useRef<HTMLDivElement[]>([]);
  const [buttonSize, setButtonSize] = useState(BUTTON_SIZE);

  useLayoutEffect(() => {
    if (buttonRefs.current.length > 0) {
      const sizes = buttonRefs.current.map((ref) => ({
        width: ref?.offsetWidth || 0,
        height: ref?.offsetHeight || 0,
      }));
      const maxWidth = Math.max(...sizes.map((size) => size.width));
      const maxHeight = Math.max(...sizes.map((size) => size.height));
      setButtonSize({ width: maxWidth, height: maxHeight });
    }
  }, []);

  const randomPositions = generateRandomPositions({ from, to, count, buttonSize });

  const handleCopyLink = () => {
    try {
      // TODO: 토스트 성공 메시지 추가
      navigator.clipboard.writeText(fakeLink);
    } catch (error) {
      // TODO: 토스트 실패 메시지 추가
      console.error('Failed to copy link', error);
    }
  };

  return (
    <div className="flex gap-6 min-w-[980px] px-64 pt-16">
      <div className="flex flex-col gap-16 w-80 h-[676px] bg-white p-14">
        {/* TODO: Suspense를 통해 loading 시 fallback 컴포넌트  */}
        <QRCodeSVG value={fakeLink} />
        <CustomButton
          type="full"
          color="primary"
          label="COPY LINK!"
          size="md"
          onClick={handleCopyLink}
        />
      </div>
      <div className="flex flex-col gap-16 justify-center items-center">
        <p className="font-bold text-3xl">참가 대기 중 ...</p>
        <div className={`relative w-[1020px] h-[576px] bg-white`}>
          {randomPositions.map((position, index) => (
            <div
              key={`${position.x} + ${position.y}`}
              className="absolute flex items-center justify-center"
              style={{ left: position.x, top: position.y }}
              ref={(element) => {
                if (element) {
                  buttonRefs.current[index] = element;
                }
              }}
            >
              <CustomButton type="full" color="light" label={fakeGuests[index]} size="md" />
            </div>
          ))}
        </div>
        <div className="flex justify-end min-w-full">
          <CustomButton
            type="full"
            color="primary"
            label="퀴즈 시작하기"
            size="md"
            onClick={() => console.log('퀴즈 시작하기')}
          />
        </div>
      </div>
    </div>
  );
}
