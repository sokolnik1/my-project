import React, { useState } from 'react';
import Input from '../Inputs/Input';
import IncomeCategorySelector from './IncomeCategorySelector';

const AddIncomeForm = ({ onAddIncome }) => {
  const [income, setIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "",
  });

  const handleChange = (key, value) =>
    setIncome((prev) => ({ ...prev, [key]: value }));

  const handleCategorySelect = ({ source, icon }) => {
    handleChange("source", source);
    handleChange("icon", icon);
  };

  return (
    <div>
      <IncomeCategorySelector onSelect={handleCategorySelect} />

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
          onClick={() => onAddIncome(income)}
        >
          Добавить доход
        </button>
      </div>
    </div>
  );
};

export default AddIncomeForm;
