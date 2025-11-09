
const GlassyProgressBar = ({ progress = 25 }) => {
  return (
    <div className="w-full h-6 bg-black/40 rounded-full relative overflow-hidden shadow-inner border border-white/10 backdrop-blur-md">
      {/* Inner shine layer */}
      <div
        className="absolute inset-0 rounded-full bg-linear-to-b from-white/20 to-white/5 pointer-events-none"
      ></div>

      {/* Progress fill */}
      <div
        className="h-full rounded-full bg-linear-to-r from-blue-500 to-blue-800 shadow-[0_0_15px_#6366f1aa] transition-all duration-700 ease-out"
        style={{ width: `${progress}%` }}
      >
        {/* Gloss reflection at the left */}
        <div className="absolute top-0 left-0 w-6 h-6 bg-white/40 blur-md rounded-full"></div>
      </div>

      {/* Outer rim gloss */}
      <div className="absolute inset-0 rounded-full border border-white/10"></div>
    </div>
  );
};

export default GlassyProgressBar;
