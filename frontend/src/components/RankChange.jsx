export default function RankChangeIndicator({ change }) {

  if (change > 0) {
    return (
      <span className="text-green-400 font-bold ml-2">
        ↑{change}
      </span>
    );
  }

  if (change < 0) {
    return (
      <span className="text-red-400 font-bold ml-2">
        ↓{Math.abs(change)}
      </span>
    );
  }

  return null;
}