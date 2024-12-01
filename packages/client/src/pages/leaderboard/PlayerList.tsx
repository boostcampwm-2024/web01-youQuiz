import { Ranking } from '.';

interface PlayerListProps {
  players: Ranking[];
}

export default function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="space-y-2 mt-10">
      {players.map((player, index) => (
        <div
          key={index + 3}
          className="group flex items-center p-3 gap-3 rounded-xl hover:bg-white/80 hover:shadow-sm transition-all duration-200"
        >
          {/* Rank */}
          <div className="w-12 h-12 rounded-base bg-gradient-to-br from-blue-100 to-blue-50 border border-gray-100 flex items-center justify-center font-bold text-blue-600 text-xl group-hover:animate-bounce">
            {index + 4}
          </div>

          {/* Status & Name */}
          <div className="flex-1 flex items-center gap-4">
            {/* <div
              className={`w-2 h-2 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}
            /> */}
            <span className="font-semibold text-lg text-gray-800">{player.nickname}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            {/* <div className="flex items-center gap-2 text-blue-600"> */}
            {/* <CheckCircle2 className="w-4 h-4" />
              <span>
                {player.correct}/{player.total}
              </span>
            </div>
            <div className="flex items-center gap-2 text-purple-600">
              <Timer className="w-4 h-4" />
              <span>{player.speed}s</span>
            </div> */}
            <div className="w-20 text-lg text-right font-semibold">{player.score}점</div>
          </div>
        </div>
      ))}
    </div>
  );
}
