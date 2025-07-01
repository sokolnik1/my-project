import React, { useState } from "react";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const predefinedCategories = [
  { name: "Зарплата", icon: "💰" },
  { name: "Фриланс", icon: "🧑‍💻" },
  { name: "Инвестиции", icon: "📈" },
  { name: "Подарок", icon: "🎁" },
  { name: "Продажа", icon: "💵" },
  { name: "Бонус", icon: "🎉" },
  { name: "Стипендия", icon: "🎓" },
];

const IncomeCategorySelector = ({ onSelect }) => {
  const [customMode, setCustomMode] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customIcon, setCustomIcon] = useState("");
  const [selected, setSelected] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handlePredefinedClick = (category) => {
    setSelected(category.name);
    setCustomMode(false);
    onSelect({ source: category.name, icon: category.icon });
  };

  const handleCustomSubmit = () => {
    if (customCategory && customIcon) {
      setSelected(customCategory);
      onSelect({ source: customCategory, icon: customIcon });
    }
  };

  return (
    <div className="mb-4">
      <p className="mb-2 font-medium text-sm text-gray-600">
        Выберите источник дохода:
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handlePredefinedClick(cat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
              ${
                selected === cat.name
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
          >
            <span>{cat.icon}</span> {cat.name}
          </button>
        ))}

        <button
          onClick={() => {
            setCustomMode(true);
            setSelected("custom");
          }}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
            selected === "custom"
              ? "bg-green-600 text-white"
              : "bg-green-100 hover:bg-green-200 text-green-800"
          }`}
        >
          ➕ Другое
        </button>
      </div>

      {selected && selected !== "custom" && (
        <div className="mb-2 text-sm text-gray-700">
          ✅ Вы выбрали: <strong>{selected}</strong>
        </div>
      )}

      {customMode && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Источник дохода (например: Репетиторство)"
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPicker(!showPicker)}
              className="bg-gray-100 px-3 py-1.5 rounded-lg text-sm"
            >
              {customIcon || "😊"} Выбрать эмодзи
            </button>

            {customIcon && <span className="text-xl">{customIcon}</span>}
          </div>

          {showPicker && (
            <div className="z-50 relative">
              <EmojiPicker
                data={data}
                onEmojiSelect={(emoji) => {
                  setCustomIcon(emoji.native);
                  setShowPicker(false);
                }}
              />
            </div>
          )}

          <button
            onClick={handleCustomSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
          >
            Добавить источник
          </button>

          {customCategory && customIcon && (
            <div className="text-sm text-gray-700">
              ✅ Вы выбрали: <strong>{customCategory}</strong> {customIcon}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IncomeCategorySelector;
