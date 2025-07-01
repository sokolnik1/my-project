import React from "react";

const BudgetProgressBar = ({ title, limit, spent }) => {
  const percent = Math.min(100, (spent / limit) * 100);

  const getColor = () => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 70) return "bg-yellow-400";
    return "bg-green-500";
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
      <h6 className="text-sm font-medium text-gray-800 mb-1">{title}</h6>

      <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()}`}
          style={{ width: `${percent}%`, transition: "width 0.4s" }}
        ></div>
      </div>

      <p className="text-xs text-gray-600 mt-2">
        Потрачено: <span className="font-medium">{spent.toLocaleString()}₽</span> из{" "}
        <span className="font-medium">{limit.toLocaleString()}₽</span> (
        <span className="font-semibold">{Math.round(percent)}%</span>)
      </p>
    </div>
  );
};

export default BudgetProgressBar;
