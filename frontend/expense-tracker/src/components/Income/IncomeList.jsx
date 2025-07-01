import React, { useState } from 'react';
import { LuDownload } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';

const IncomeList = ({ transactions, onDelete, onDownload }) => {
  const [groupedMode, setGroupedMode] = useState(false);

  // Группировка по source
  const groupedData = transactions.reduce((acc, item) => {
    const key = item.source;
    if (!acc[key]) {
      acc[key] = {
        _id: key,
        source: key,
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
        <h5 className="text-lg">Все Доходы</h5>

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
          ? transactions?.map((income) => (
              <TransactionInfoCard
                key={income._id}
                title={income.source}
                icon={income.icon}
                date={new Date(income.date).toLocaleDateString("ru-RU", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                amount={income.amount}
                type="income"
                onDelete={() => onDelete(income._id)}
              />
            ))
          : groupedArray.map((group) => (
              <TransactionInfoCard
                key={group._id}
                title={group.source}
                icon={group.icon}
                date="—"
                amount={group.amount}
                type="income"
                hideDeleteBtn
              />
            ))}
      </div>
    </div>
  );
};

export default IncomeList;
