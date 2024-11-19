import { CustomButton } from '@/shared/ui/buttons';
import { generateRandomPositions } from '@/shared/utils/generateRandomPositions';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizSocket } from '@/shared/utils/socket';
import { getCookie } from '@/shared/utils/cookie';
import { toastController } from '@/features/toast/model/toastController';

const GUEST_DISPLAY_SIZE = { width: 1020, height: 576 };
const SPACING = 10;
const BUTTON_SIZE = { width: 74, height: 44 };

const from = { x: SPACING, y: SPACING };
const to = { x: GUEST_DISPLAY_SIZE.width - SPACING, y: GUEST_DISPLAY_SIZE.height - SPACING };

export default function QuizWait() {
  const { pinCode } = useParams();
  const guestLink = `${import.meta.env.VITE_CLIENT_URL}/${pinCode}`;
  const buttonRefs = useRef<HTMLDivElement[]>([]);
  const [buttonSize, setButtonSize] = useState(BUTTON_SIZE);
  const [guests, setGuests] = useState<string[]>([]);
  const guestCount = guests.length;
  const socket = getQuizSocket();
  const navigate = useNavigate();
  const toast = toastController();

  useEffect(() => {
    socket.on('nickname', (response) => {
      setGuests([...response]);
    });
  }, []);

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

  const randomPositions = generateRandomPositions({ from, to, count: guestCount, buttonSize });

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(guestLink);
      toast.success('링크가 복사되었습니다.');
    } catch (error) {
      toast.error('링크 복사에 실패했습니다.');
    }
  };

  const handleQuizStart = () => {
    socket.emit('master entry', { classId: '123', sid: getCookie('sid') });
    navigate('/quiz/session');
  };

  return (
    <div className="flex gap-6 min-w-[980px] px-64 pt-16">
      <div className="flex flex-col gap-16 w-80 h-[676px] bg-white p-14">
        {/* TODO: Suspense를 통해 loading 시 fallback 컴포넌트  */}
        <QRCodeSVG value={guestLink} />
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
              <CustomButton type="full" color="light" label={guests[index]} size="md" />
            </div>
          ))}
        </div>
        <div className="flex justify-end min-w-full">
          <CustomButton
            type="full"
            color="primary"
            label="퀴즈 시작하기"
            size="md"
            onClick={handleQuizStart}
          />
        </div>
      </div>
    </div>
  );
}
