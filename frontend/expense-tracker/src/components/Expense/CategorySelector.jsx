import React, { useState } from "react";
import EmojiPicker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const predefinedCategories = [
  { name: "Еда", icon: "🍔" },
  { name: "Машина", icon: "🚗" },
  { name: "Дом", icon: "🏠" },
  { name: "Подарок", icon: "🎁" },
  { name: "Здоровье", icon: "💊" },
  { name: "Развлечения", icon: "🎮" },
  { name: "Одежда", icon: "👕" },
];

const CategorySelector = ({ onSelect }) => {
  const [customMode, setCustomMode] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [customIcon, setCustomIcon] = useState("");
  const [selected, setSelected] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const handlePredefinedClick = (category) => {
    setSelected(category.name);
    setCustomMode(false);
    onSelect({ category: category.name, icon: category.icon });
  };

  const handleCustomSubmit = () => {
    if (customCategory && customIcon) {
      setSelected(customCategory);
      onSelect({ category: customCategory, icon: customIcon });
    }
  };

  return (
    <div className="mb-4">
      <p className="mb-2 font-medium text-sm text-gray-600">
        Выберите категорию:
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {predefinedCategories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => handlePredefinedClick(cat)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition
              ${
                selected === cat.name
                  ? "bg-purple-600 text-white"
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
              ? "bg-purple-600 text-white"
              : "bg-purple-100 hover:bg-purple-200 text-purple-800"
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
            placeholder="Ваша категория (например: Учёба)"
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
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700"
          >
            Добавить категорию
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

export default CategorySelector;

