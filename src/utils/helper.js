import moment from 'moment';
import 'moment/locale/ru';

// Устанавливаем русскую локаль для дат
moment.locale('ru');

// Форматирование даты (день.месяц.год)
export const formatDate = (date) => {
  return moment(date).format('DD.MM.YYYY');
};

// Валидация email
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Получение инициалов
export const getInitials = (name) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }
  return initials.toUpperCase();
};

// Форматирование чисел с разделителями
export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return "";
  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}₽`
    : formattedInteger;
};

// Подготовка данных для графика расходов
export const prepareExpenseBarChartData = (data = []) => {
  return data.map(item => ({
    category: item?.category,
    amount: item?.amount,
    date: formatDate(item?.date)
  }));
};

// Подготовка данных для графика доходов
export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sortedData.map(item => ({
    month: formatDate(item?.date),
    amount: item?.amount,
    source: item?.source
  }));
};

// Подготовка данных для линейного графика расходов
export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  return sortedData.map(item => ({
    month: formatDate(item?.date),
    amount: item?.amount,
    category: item?.category
  }));
};