import { getQuizSocket } from '@/shared/utils/socket';
import { useEffect, useRef, useState } from 'react';

interface MasterChatProps {
  // type: 'master' | 'participant';
  pinCode: string;
}

export default function MasterChat({ pinCode }: MasterChatProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = getQuizSocket();

  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      //메세지 전송
      setIsFocused(false);
      setMessage('');
      setTimeout(() => {
        socket.emit('message', {
          pinCode,
          message: '',
          position: -1,
        });
      }, 1500);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket.emit('message', { pinCode, message: e.target.value, position: -1 });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setIsFocused(true);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
      if (e.key === 'Escape') {
        setMessage('');
        setIsFocused(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      {isFocused && (
        <input
          ref={inputRef}
          value={message}
          onKeyDown={handleEnterKeyDown}
          onChange={handleMessageChange}
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-md shadow-sm outline-blue-500 px-2 w-1/3 h-10 text-md "
        />
      )}
    </>
  );
}
