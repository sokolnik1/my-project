import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import TransactionInfoCard from '../Cards/TransactionInfoCard'
import moment from 'moment';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between ">
        <h5 className="text-lg">Расходы</h5>

        <button className="card-btn" onClick={onSeeMore}>
          Все расходы <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0,4)?.map((expense) => (
          <TransactionInfoCard
          key={expense._id}
          title={expense.category}
          icon={expense.icon}
          date={new Date(expense.date).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          })}
          amount={expense.amount}
          type="expense"
          hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;