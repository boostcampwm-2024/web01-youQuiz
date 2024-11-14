import InputBox from '@/shared/ui/input-box/InputBox';
import ToggleButton from '@/shared/ui/buttons/ToggleButton';

interface AnswerBoxProps {
  /**정답 체크된 상태인지 여부 */
  selected: boolean;
  /**정답 선택 함수 */
  answerSetter: () => void;
  /**선지 설정 함수 */
  optionSetter: any;
  /** 인풋 박스 ref */
  inputRef?: (el: HTMLInputElement | null) => void;
  /** 키 입력 함수 (유저가 Enter를 누르면 호출이 됩니다.) */
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function AnswerBox({
  selected,
  answerSetter,
  optionSetter,
  inputRef,
  onKeyDown,
}: AnswerBoxProps) {
  return (
    <div className="flex items-center gap-4  ">
      <ToggleButton
        type="check"
        isClickable
        isActive={selected}
        onClick={answerSetter}
        size="small"
      />
      <div className="flex-1">
        <InputBox
          placeholder="선지를 입력해주세요"
          type="underline"
          ref={inputRef}
          onKeyDown={onKeyDown}
          onSubmit={optionSetter}
        />
      </div>
    </div>
  );
}
