import React, { useState } from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const ExpenseList = ({ transactions, onDelete, onDownload }) => {
  const [groupedMode, setGroupedMode] = useState(false);

  // Группировка по категориям
  const groupedData = transactions.reduce((acc, item) => {
    const key = item.category;
    if (!acc[key]) {
      acc[key] = {
        _id: key,
        category: key,
        icon: item.icon,
        amount: 0,
      };
    }
    acc[key].amount += item.amount;
    return acc;
  }, {});

  const groupedArray = Object.values(groupedData);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Все Расходы</h5>

        <div className="flex items-center gap-4">
          <label className="text-sm text-gray-500">
            <input
              type="checkbox"
              className="mr-1"
              checked={groupedMode}
              onChange={() => setGroupedMode(!groupedMode)}
            />
            Группировать
          </label>

          <button className="card-btn" onClick={onDownload}>
            <LuDownload className="text-base" /> Скачать
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
        {!groupedMode
          ? transactions?.map((expense) => (
              <TransactionInfoCard
                key={expense._id}
                title={expense.category}
                icon={expense.icon}
                date={new Date(expense.date).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                amount={expense.amount}
                type="expense"
                onDelete={() => onDelete(expense._id)}
              />
            ))
          : groupedArray.map((group) => (
              <TransactionInfoCard
                key={group._id}
                title={group.category}
                icon={group.icon}
                date="—" // дата не нужна при группировке
                amount={group.amount}
                type="expense"
                hideDeleteBtn // скрываем кнопку удаления
              />
            ))}
      </div>
    </div>
  );
};

export default ExpenseList;
