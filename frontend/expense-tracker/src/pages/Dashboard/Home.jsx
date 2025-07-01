import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import InfoCard from "../../components/Cards/InfoCard";
import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from "../../utils/helper";
import { UserContext } from "../../context/UserContext";

import RecentTransactions from "../../components/Dashboard/RecentTransactions";
import FinanceOverview from "../../components/Dashboard/FinanceOverview";
import ExpenseTransactions from "../../components/Dashboard/ExpenseTransactions";
import Last30DaysExpenses from "../../components/Dashboard/Last30DaysExpenses";
import RecentIncomeWithChart from "../../components/Dashboard/RecentIncomeWithChart";
import RecentIncome from "../../components/Dashboard/RecentIncome";

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [limitType, setLimitType] = useState("week");
  const [limits, setLimits] = useState({
    week: 10000,
    month: 40000,
    custom: {
      amount: 5000,
      startDate: "",
      endDate: ""
    }
  });
  const [spent, setSpent] = useState({
    week: 0,
    month: 0,
    custom: 0
  });

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get("/dashboard");
      if (response.data) setDashboardData(response.data);
    } catch (error) {
      console.log("Ошибка получения данных дашборда:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLimits = async () => {
    try {
      const [budgetRes, customRes] = await Promise.all([
        axiosInstance.get(API_PATHS.AUTH.BUDGET_LIMITS),
        axiosInstance.get("/auth/custom-limits")
      ]);

      if (budgetRes.data) {
        setLimits(prev => ({
          ...prev,
          week: budgetRes.data.weekLimit || prev.week,
          month: budgetRes.data.monthLimit || prev.month
        }));
      }

      if (customRes.data?.customLimits?.length > 0) {
        const last = customRes.data.customLimits[customRes.data.customLimits.length - 1];
        setLimits(prev => ({
          ...prev,
          custom: {
            amount: last.limit,
            startDate: new Date(last.startDate).toISOString().split('T')[0],
            endDate: new Date(last.endDate).toISOString().split('T')[0]
          }
        }));
      }
    } catch (error) {
      console.error("Ошибка загрузки лимитов:", error);
    }
  };

  const updateLimits = async () => {
    try {
      await axiosInstance.patch(API_PATHS.AUTH.BUDGET_LIMITS, {
        weekLimit: limits.week,
        monthLimit: limits.month
      });
      alert("Лимиты обновлены успешно");
    } catch (error) {
      console.error("Ошибка при обновлении лимитов:", error);
    }
  };

  const saveCustomLimit = async () => {
    if (!limits.custom.startDate || !limits.custom.endDate || !limits.custom.amount) {
      return alert("Заполните все поля кастомного лимита");
    }

    try {
      await axiosInstance.post("/auth/custom-limits", {
        startDate: limits.custom.startDate,
        endDate: limits.custom.endDate,
        limit: limits.custom.amount
      });
      alert("Кастомный лимит сохранен");
      fetchLimits();
    } catch (error) {
      console.error("Ошибка сохранения кастомного лимита:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchLimits();
  }, []);

  useEffect(() => {
    if (!dashboardData) return;
  
    const now = new Date();
  
    // 1. Текущая неделя: Понедельник — Воскресенье
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = getEndOfWeek(now);
  
    const weekTransactions = dashboardData.last30DaysExpense?.transactions?.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startOfWeek && txDate <= endOfWeek;
    }) || [];
    const weekSpent = weekTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  
    // 2. Текущий месяц: с 1 по 30/31
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);
  
    const monthTransactions = dashboardData.last30DaysExpense?.transactions?.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startOfMonth && txDate <= endOfMonth;
    }) || [];
    const monthSpent = monthTransactions.reduce((acc, tx) => acc + tx.amount, 0);
  
    // 3. Кастомный лимит: пользователь задаёт дату
    let customSpent = 0;
    if (limits.custom.startDate && limits.custom.endDate) {
      const start = new Date(limits.custom.startDate);
      const end = new Date(limits.custom.endDate);
      end.setHours(23, 59, 59, 999);
      const expenses = dashboardData.last30DaysExpense?.transactions || [];
      const filtered = expenses.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= start && txDate <= end;
      });
      customSpent = filtered.reduce((acc, tx) => acc + tx.amount, 0);
    }
  
    setSpent({
      week: weekSpent,
      month: monthSpent,
      custom: customSpent
    });
  }, [dashboardData, limits.custom.startDate, limits.custom.endDate]);

  const getStartOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getEndOfWeek = (date) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
  };

  const formatWeekRange = (start, end) => {
    const formatter = new Intl.DateTimeFormat("ru-RU", { 
      day: "numeric", 
      month: "long",
      year: start.getFullYear() !== end.getFullYear() ? "numeric" : undefined
    });
    
    return `${formatter.format(start)} – ${formatter.format(end)}`;
  };

  const now = new Date();
  const startOfWeek = getStartOfWeek(now);
  const endOfWeek = getEndOfWeek(now);
  const daysLeftWeek = Math.ceil((endOfWeek - now) / (1000 * 60 * 60 * 24));

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysLeftMonth = Math.ceil((endOfMonth - now) / (1000 * 60 * 60 * 24));

  return (
    <DashboardLayout activeMenu="Главная">
      <div className="my-5 mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h4 className="text-lg font-semibold mb-4">Лимиты бюджета</h4>

          <div className="flex items-center gap-4 mb-6">
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${limitType === "week" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`} 
              onClick={() => setLimitType("week")}
            >
              Неделя
            </button>
            <button 
              className={`px-4 py-2 rounded-lg text-sm font-medium ${limitType === "month" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}`} 
              onClick={() => setLimitType("month")}
            >
              Месяц
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 flex flex-col">
              {limitType === "week" && (
                <>
                  <LimitBlock
                    label="Неделя"
                    limit={limits.week}
                    spent={spent.week}
                    onChange={(value) => setLimits(prev => ({...prev, week: value}))}
                    dateText={`${formatWeekRange(startOfWeek, endOfWeek)}. Осталось ${daysLeftWeek} ${pluralize(daysLeftWeek)}`}
                  />
                  <button 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2" 
                    onClick={updateLimits}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Сохранить недельный лимит
                  </button>
                </>
              )}

              {limitType === "month" && (
                <>
                  <LimitBlock
                    label="Месяц"
                    limit={limits.month}
                    spent={spent.month}
                    onChange={(value) => setLimits(prev => ({...prev, month: value}))}
                    dateText={`${new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(startOfMonth)} – ${new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(endOfMonth)}. Осталось ${daysLeftMonth} ${pluralize(daysLeftMonth)}`}
                  />
                  <button 
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-all text-sm font-medium flex items-center justify-center gap-2" 
                    onClick={updateLimits}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Сохранить месячный лимит
                  </button>
                </>
              )}
            </div>

            <div className="md:w-1/2 flex flex-col">
              <LimitBlock
                label="Кастомный"
                limit={limits.custom.amount}
                spent={spent.custom}
                onChange={(value) => setLimits(prev => ({
                  ...prev, 
                  custom: {...prev.custom, amount: value}
                }))}
                dateText={
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-600">Выберите диапазон дат:</p>
                    <div className="flex gap-3">
                      <input 
                        type="date" 
                        value={limits.custom.startDate} 
                        onChange={(e) => setLimits(prev => ({
                          ...prev,
                          custom: {...prev.custom, startDate: e.target.value}
                        }))} 
                        className="border rounded-md px-3 py-2 text-sm w-full" 
                      />
                      <input 
                        type="date" 
                        value={limits.custom.endDate} 
                        onChange={(e) => setLimits(prev => ({
                          ...prev,
                          custom: {...prev.custom, endDate: e.target.value}
                        }))} 
                        className="border rounded-md px-3 py-2 text-sm w-full" 
                      />
                    </div>
                  </div>
                }
              />
              <button 
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                onClick={saveCustomLimit}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Сохранить кастомный лимит
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard icon={<IoMdCard />} label="Общий Баланс" value={addThousandsSeparator(dashboardData?.totalBalance || 0)} color="bg-primary" />
          <InfoCard icon={<LuWalletMinimal />} label="Общий Доход" value={addThousandsSeparator(dashboardData?.totalIncome || 0)} color="bg-orange-500" />
          <InfoCard icon={<LuHandCoins />} label="Общий Расход" value={addThousandsSeparator(dashboardData?.totalExpenses || 0)} color="bg-red-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions transactions={dashboardData?.recentTransactions} onSeeMore={() => navigate("/expense")} />
          <FinanceOverview totalBalance={dashboardData?.totalBalance || 0} totalIncome={dashboardData?.totalIncome || 0} totalExpense={dashboardData?.totalExpenses || 0} />
          <ExpenseTransactions transactions={dashboardData?.last30DaysExpense?.transactions || []} onSeeMore={() => navigate("/expense")} />
          <Last30DaysExpenses data={dashboardData?.last30DaysExpense?.transactions || []} />
          <RecentIncomeWithChart data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []} totalIncome={dashboardData?.totalIncome || 0} />
          <RecentIncome transactions={dashboardData?.last60DaysIncome?.transactions || []} onSeeMore={() => navigate("/income")} />
        </div>
      </div>
    </DashboardLayout>
  );
};

const LimitBlock = ({ label, limit, spent, onChange, dateText }) => {
  const percent = limit === 0 ? 0 : Math.min(100, Math.round((spent / limit) * 100));
  const color = percent < 70 ? "bg-green-500" : percent < 100 ? "bg-yellow-400" : "bg-red-500";

  return (
    <div className="h-full flex flex-col justify-between gap-4 bg-gray-50 p-4 rounded-lg">
      <div>
        {dateText && <p className="text-sm text-gray-600 mb-3">{dateText}</p>}
        <label className="block text-sm font-medium text-gray-700 mb-1">Лимит на {label.toLowerCase()} (₽)</label>
        <input 
          type="number" 
          value={limit} 
          onChange={(e) => onChange(Number(e.target.value))} 
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary" 
        />
      </div>
      
      <div>
        <p className="text-sm text-gray-600 mb-1">
          Использовано: <span className="font-medium">{spent.toLocaleString("ru-RU")}₽</span> из <span className="font-medium">{limit.toLocaleString("ru-RU")}₽</span> ({percent}%)
        </p>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
        {percent >= 100 && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Превышен лимит!
          </p>
        )}
      </div>
    </div>
  );
};

const pluralize = (count) => {
  if (count % 10 === 1 && count % 100 !== 11) return "день";
  if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return "дня";
  return "дней";
};

export default Home;




