import { Sun, MoonStar } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ModeToggle = () => {
   const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`relative w-28 h-11 rounded-full p-1.5 flex items-center transition-all duration-500 cursor-pointer ${
        theme === "dark" ? "bg-card" : "bg-gray-200"
      }`}
      onClick={() => {
        toggleTheme();
      }}
    >
      {/* Sliding Button */}
      <div
        className={`absolute top-1 left-1 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
          theme === "dark"
            ? "translate-x-[68px] bg-[#1C1C1C] text-white shadow-[inset_0_0_6px_rgba(255,255,255,0.2)]"
            : "translate-x-0 bg-white text-black shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        }`}
      >
        {theme === "dark" ? <MoonStar size={18} /> : <Sun size={18} />}
      </div>

      {/* Text Labels */}
      <div className="flex justify-between w-full px-3 z-10">
        <span
          className={`text-[10px] font-extrabold  transition-all duration-500 ${
            theme === "dark" ? "text-white" : "opacity-0"
          }`}
        >
          NIGHT
          <br />
          MODE
        </span>
        <span
          className={`text-[10px] font-extrabold transition-all duration-500 ${
            // isNight ? "text-white" : "text-gray-400"
            theme === "dark" ? "opacity-0" : "text-black"
          }`}
        >
          DAY
          <br />
          MODE
        </span>
      </div>
    </div>
  );
};

export default ModeToggle;
