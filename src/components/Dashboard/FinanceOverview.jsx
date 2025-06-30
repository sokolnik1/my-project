import React from 'react'
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900"];

const FinanceOverview = ({ totalBalance, totalIncome, totalExpense }) => {
  const balanceData = [
    { name: "Общий Баланс", amount: totalBalance },
    { name: "Общие Расходы", amount: totalExpense },
    { name: "Общие Доходы", amount: totalIncome },
  ];
  
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Финансовый обзор</h5>
      </div>

      <CustomPieChart
        data={balanceData}
        label="Общий Баланс"
        totalAmount={`${totalBalance}`}
        colors={COLORS}
        showTextAnchor
      />
    </div>
  );
};

export default FinanceOverview;