import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { LuImage, LuX } from 'react-icons/lu';

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [translatedSearch, setTranslatedSearch] = useState('');

  // Словарь: русское → английское
  const emojiDict = {
    "еда": "food",
    "машина": "car",
    "дом": "house",
    "подарок": "gift",
    "работа": "work",
    "отпуск": "vacation",
    "транспорт": "transport",
    "развлечения": "fun",
    "одежда": "clothes",
    "здоровье": "health",
    "животное": "animal",
    "улыбка": "smile",
    "деньги": "money",
    "собака": "dog",
    "кошка": "cat",
    "музыка": "music"
  };

  // Обрабатываем поиск
  const handleSearch = (input) => {
    const lower = input.toLowerCase().trim();
    const translated = emojiDict[lower] || lower;
    setTranslatedSearch(translated);
  };

  return (
    <div className="flex flex-col md:flex-row items-start gap-5 mb-6 relative">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-purple-50 text-primary rounded-lg">
          {icon ? (
            <span className="text-2xl">{icon}</span>
          ) : (
            <LuImage />
          )}
        </div>
        <p>{icon ? "Сменить иконку" : "Выбрать иконку"}</p>
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-4">
          <button
            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-full absolute -top-2 -right-2 z-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            <LuX />
          </button>

          <Picker
            data={data}
            onEmojiSelect={(emoji) => {
              onSelect(emoji.native);
              setIsOpen(false);
            }}
            theme="light"
            previewPosition="none"
            search={translatedSearch}
            onSearch={handleSearch}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;

