import React, { useEffect, useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import CustomBarChart from '../Charts/CustomBarChart';
import { prepareIncomeBarChartData } from '../../utils/helper';

const IncomeOverview = ({ transactions, onAddIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const result = prepareIncomeBarChartData(transactions);
    setChartData(result);

    return () => {};
  }, [transactions]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="">
          <h5 className="text-lg">Анализ дохода</h5>
          <p className="text-xs text-gray-400 mt-0.5">
            Отслеживайте свои доходы и анализируйте тенденции.
          </p>
        </div>

        <button className="add-btn" onClick={onAddIncome}>
          <LuPlus className="text-lg" />
          Добавить доход
        </button>
      </div>

      <div className="mt-10">
        <CustomBarChart data={chartData} />
      </div>
    </div>
  );
};

export default IncomeOverview;