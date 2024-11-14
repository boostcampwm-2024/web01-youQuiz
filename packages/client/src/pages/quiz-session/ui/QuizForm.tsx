import ToggleButton from '@/shared/ui/buttons/ToggleButton';

type Choice = {
  content: string;
  isAnswer: boolean;
};

interface QuizProps {
  title: string;
  choices: Choice[];
}

interface QuizFormProps {
  options: string[];
  selectedOptions: number[];
  onToggle: (index: number) => void;
  quizData: QuizProps;
}

export default function QuizForm({ options, selectedOptions, onToggle, quizData }: QuizFormProps) {
  console.log(quizData);
  return (
    <div className="flex flex-col bg-white rounded-base w-2/4 min-h-[432px] py-6">
      <p className="text-md-xl text-center mb-2">{quizData.title}</p>
      <p className="flex flex-col justify-center items-start gap-10 pt-10 p-10">
        {quizData.choices.map((option, index) => (
          <div
            key={index}
            className="flex items-center gap-6 cursor-pointer"
            onClick={() => onToggle(index)}
          >
            <ToggleButton
              type="check"
              isClickable
              isActive={selectedOptions.includes(index)}
              size="small"
            />
            <span className="text-md-md border-b">{option.content}</span>
          </div>
        ))}
      </p>
    </div>
  );
}
