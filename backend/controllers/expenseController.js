const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// добавление расходов
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // валидация
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении расхода" });
  }
};

// получение всех расходов
exports.getAllExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении расходов" });
  }
};

// удаление расхода
exports.deleteExpense = async (req, res) => {
  const userId = req.user.id;
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Расход успешно удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении расхода" });
  }
};

// экспорт в excel
exports.downloadExpenseExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Подготовка данных Excel с техническими ключами
    const data = expense.map((item) => ({
      category: item.category,
      amount: item.amount,
      date: new Date(item.date).toLocaleDateString("ru-RU")
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data, {
      header: ["category", "amount", "date"]
    });

    // Установка русских заголовков в первой строке
    ws["A1"].v = "Категория";
    ws["B1"].v = "Сумма";
    ws["C1"].v = "Дата";

    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    xlsx.writeFile(wb, "expense_details.xlsx");
    res.download("expense_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Ошибка при экспорте расходов" });
  }
};