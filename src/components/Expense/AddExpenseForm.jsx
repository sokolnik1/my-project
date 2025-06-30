import React, { useState } from "react";
import Input from "../Inputs/Input";
import CategorySelector from "./CategorySelector"; // 👈 Новый компонент

const AddExpenseForm = ({ onAddExpense }) => {
  const [income, setIncome] = useState({
    category: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) =>
    setIncome((prev) => ({ ...prev, [key]: value }));

  const handleCategorySelect = ({ category, icon }) => {
    handleChange("category", category);
    handleChange("icon", icon);
  };

  return (
    <div>
      <CategorySelector onSelect={handleCategorySelect} />

      <Input
        value={income.amount}
        onChange={({ target }) => handleChange("amount", target.value)}
        label="Сумма"
        placeholder=""
        type="number"
      />

      <Input
        value={income.date}
        onChange={({ target }) => handleChange("date", target.value)}
        label="Дата"
        placeholder=""
        type="date"
      />

      <div className="flex justify-end mt-6">
        <button
          type="button"
          className="add-btn add-btn-fill"
          onClick={() => onAddExpense(income)}
        >
          Добавить расход
        </button>
      </div>
    </div>
  );
};

export default AddExpenseForm;
