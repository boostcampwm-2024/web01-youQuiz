import { CustomButton } from '@/shared/ui/buttons';
import { generateRandomPositions } from '@/shared/utils/generateRandomPositions';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getQuizSocket } from '@/shared/utils/socket';
import { getCookie } from '@/shared/utils/cookie';
import { toastController } from '@/features/toast/model/toastController';
import LoadingSpinner from '@/shared/assets/icons/loading-alt-loop.svg?react';
import { useGetUserType } from '@/shared/hooks/useGetUserType';

const GUEST_DISPLAY_SIZE = { width: 940, height: 568 };
const SPACING = 10;
const BUTTON_SIZE = { width: 74, height: 44 };

const from = { x: SPACING, y: SPACING };
const to = { x: GUEST_DISPLAY_SIZE.width - SPACING, y: GUEST_DISPLAY_SIZE.height - SPACING };

export default function QuizWait() {
  const { pinCode } = useParams();
  const guestLink = `${import.meta.env.VITE_CLIENT_URL}/nickname/${pinCode}`;
  const buttonRefs = useRef<HTMLDivElement[]>([]);
  const [buttonSize, setButtonSize] = useState(BUTTON_SIZE);
  const [guests, setGuests] = useState<string[]>([]);
  const guestCount = guests.length;
  const socket = getQuizSocket();
  const navigate = useNavigate();
  const toast = toastController();

  const { data: userType } = useGetUserType({ pinCode: pinCode!, sid: getCookie('sid')! });

  useEffect(() => {
    socket.on('nickname', (response) => {
      setGuests([...response]);
    });

    socket.on('start quiz', (response) => {
      console.log('start quiz', response);
      navigate(`/quiz/session/${pinCode}/1`);
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
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  const handleQuizStart = () => {
    socket.emit('start quiz', { sid: getCookie('sid'), pinCode });
    navigate(`/quiz/session/host/${pinCode}/1`);
  };

  return (
    <div className="flex gap-6 min-w-[980px] px-64 pt-16">
      <div className="flex flex-col gap-16 w-80 h-96 bg-white p-14 rounded-xl shadow-md">
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
        <div className="w-[1020px] h-[700px] bg-white rounded-xl shadow-md p-10">
          <div className="relative flex items-center mb-4">
            <p className="font-bold text-2xl absolute inset-0 flex items-center justify-center">
              참가 대기 중
            </p>
            <p className="flex items-center gap-2 font-bold text-lg ml-auto">
              <LoadingSpinner className="animate-spin" />
              {guests.length === 0 ? 'no' : guests.length} participants
            </p>
          </div>
          <div className="relative w-full h-[568px] bg-blue-50 rounded-xl shadow-md">
            {randomPositions.map((position, index) => (
              <div
                key={`${position.x} + ${position.y}`}
                className="absolute flex items-center justify-center bg-white rounded-xl shadow-md animate-bounce"
                style={{ left: position.x, top: position.y }}
                ref={(element) => {
                  if (element) {
                    buttonRefs.current[index] = element;
                  }
                }}
              >
                <div className="flex justify-center items-center gap-3 min-w-20 h-11 p-2">
                  {/* TODO: connect 여부에 따른 색상 수정 */}
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  {guests[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
        {userType === 'master' && (
          <div className="flex justify-end min-w-full">
            <CustomButton
              type="full"
              color="primary"
              label="퀴즈 시작하기"
              size="md"
              onClick={handleQuizStart}
            />
          </div>
        )}
      </div>
    </div>
  );
}
