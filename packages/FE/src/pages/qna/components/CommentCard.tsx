interface CommentCardProps {
  comments: {
    content: string;
    isOrganizer: boolean;
  }[];
  commentValue: string;
  setCommentValue: React.Dispatch<React.SetStateAction<string>>;
}

export default function CommentCard({ comments, commentValue, setCommentValue }: CommentCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // TODO: 코멘트 추가 API 호출
      setCommentValue('');
    }
  };

  return (
    <div className="flex flex-col gap-3 w-[1000px] px-3 py-5 mt-2 bg-white rounded-none">
      {comments
        .filter((cm) => cm.isOrganizer)
        .map((comment) => (
          <div className="bg-weak-primary rounded-base p-3">
            <span>{comment.content}</span>
          </div>
        ))}
      {comments
        .filter((cm) => !cm.isOrganizer)
        .map((comment) => (
          <div className="border-b-2 p-2 border-border">
            <span>{comment.content}</span>
          </div>
        ))}
      <input
        type="text"
        placeholder="코멘트를 입력해주세요"
        className="h-10 p-3 border-2 mt-8 border-border rounded-base focus:outline-none"
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
