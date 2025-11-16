import { DarkMode } from "../types";

const Stats = ({ darkMode }: DarkMode) => {
  const stats = [
    { number: "5+", label: "Years Experience" },
    { number: "10+", label: "Documentatio Guides Written" },
    { number: "50+", label: "Code Reviews Completed" },
    { number: "90%", label: "Test Coverage" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${
            darkMode ? "bg-gray-800/50" : "bg-white/50"
          } backdrop-blur-lg rounded-2xl p-8 border ${
            darkMode ? "border-gray-700" : "border-gray-300"
          } text-center hover:scale-105 transition-transform`}
        >
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            {stat.number}
          </div>
          <div className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
