const CustomLimit = require("../models/CustomLimit");

exports.addCustomLimit = async (req, res) => {
  const userId = req.user.id;
  const { startDate, endDate, limit } = req.body;

  if (!startDate || !endDate || !limit) {
    return res.status(400).json({ message: "Все поля обязательны: startDate, endDate, limit" });
  }

  try {
    const newLimit = await CustomLimit.create({
      userId,
      startDate,
      endDate,
      limit,
    });

    res.status(201).json(newLimit);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при создании лимита", error: error.message });
  }
};

exports.getCustomLimits = async (req, res) => {
  const userId = req.user.id;

  try {
    const limits = await CustomLimit.find({ userId }).sort({ startDate: -1 });
    res.status(200).json(limits);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении лимитов", error: error.message });
  }
};

