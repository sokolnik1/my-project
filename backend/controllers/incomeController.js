const xlsx = require("xlsx");
const Income = require("../models/Income");

// добавление дохода
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // валидация
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "Все поля обязательны для заполнения" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при добавлении дохода" });
  }
};

// получение всех доходов
exports.getAllIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении доходов" });
  }
};

// удаление доходов
exports.deleteIncome = async (req, res) => {
  const userId = req.user.id;
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Доход успешно удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении дохода" });
  }
};

// экспорт в excel
exports.downloadIncomeExcel = async (req, res) => {
  const userId = req.user.id;
  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Подготовка данных для Excel с техническими ключами
    const data = income.map((item) => ({
      source: item.source,
      amount: item.amount,
      date: new Date(item.date).toLocaleDateString("ru-RU")
    }));

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data, {
      header: ["source", "amount", "date"]
    });

    // Установка заголовков на русском
    ws["A1"].v = "Источник дохода";
    ws["B1"].v = "Сумма";
    ws["C1"].v = "Дата";

    xlsx.utils.book_append_sheet(wb, ws, "Income");
    xlsx.writeFile(wb, "income_details.xlsx");
    res.download("income_details.xlsx");
  } catch (error) {
    res.status(500).json({ message: "Ошибка при экспорте данных" });
  }
};