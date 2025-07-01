import React from "react";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
      <p className="text-xs font-semibold text-purple-800 mb-1">
        {payload[0].name}
      </p>
      <p className="text-sm text-gray-600">
        Сумма:{" "}
        <span className="text-sm font-medium text-gray-900">
          {payload[0].value.toLocaleString('ru-RU')} ₽
        </span>
      </p>
    </div>
  );
};

export default CustomTooltip;